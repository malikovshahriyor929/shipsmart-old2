'use client';

import { Attachment, ChatMessageType, MessagesType } from '@core/types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ---- Minimal types ----
type Json = {
  data: {
    chatId: number,
    seq?: number,
    lastSeq?: number,
    message?: MessagesType,
    text: string
  }
  type: string
}
type WSStatus = 'idle' | 'connecting' | 'open' | 'closed';

type UseWSOpts = {
  token?: string | (() => string | null | undefined); // sent right after open
  authType?: string;        // server auth message type, e.g. "auth" or "AUTH"
  authKey?: string;         // token field name, e.g. "token" or "access_token"
  requireAuthBeforeSend?: boolean; // buffer app messages until we see auth-ok
  reconnectMs?: number;     // fixed reconnect delay (ms), default 1200
  authOkEvents?: string[];  // which server events mean "auth succeeded"
};

type HookReturn = {
  status: WSStatus;
  authed: boolean;
  lastPingTs?: number;
  messages: Array<{ at: number; room?: string | number; text: string; raw?: Json }>;
  socket: WebSocket | null
  connect: () => void;
  disconnect: () => void;
  joinRoom: (chatId: number) => void;
  leaveRoom: (chatId: number) => void;
  chatSend: (chatId: number, text: string, extra?: Record<string, any>) => void;
  send: (type: string, data?: any) => void; // low-level
};

// ---- The hook: useWebSocket ----
export function useWebSocket(url: string, opts?: UseWSOpts): HookReturn {
  const cleanUrl = useMemo(() => url.replace(/\/+$/, ''), [url]); // no trailing slash
  const wsRef = useRef<WebSocket | null>(null);
  const outboxRef = useRef<any[]>([]);
  const roomsRef = useRef<Set<string | number>>(new Set());
  const reconnectTimer = useRef<number | null>(null);

  const authOkSet = useMemo(
    () => new Set(opts?.authOkEvents ?? ["ready", 'auth.ok', 'AUTH_OK', 'ok']),
    [opts?.authOkEvents]
  );

  const [status, setStatus] = useState<WSStatus>('idle');
  const [authed, setAuthed] = useState(false);
  const [lastPingTs, setLastPingTs] = useState<number | undefined>(undefined);
  const [messages, setMessages] = useState<HookReturn['messages']>([]);

  const requireAuthBeforeSend = opts?.requireAuthBeforeSend ?? Boolean(opts?.token ?? true);
  const reconnectMs = opts?.reconnectMs ?? 1200;
  const authType = opts?.authType ?? 'auth';
  const authKey = opts?.authKey ?? 'token';

  const getToken = useCallback(() => {
    if (typeof opts?.token === 'function') return opts?.token() ?? '';
    return opts?.token ?? '';
  }, [opts?.token]);

  const flushOutbox = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (requireAuthBeforeSend && !authed) return;
    const copy = outboxRef.current.splice(0);
    for (const payload of copy) {
      try { ws.send(JSON.stringify(payload)); } catch { /* ignore */ }
    }
  }, [authed, requireAuthBeforeSend]);

  const send = useCallback((type: string, data?: any) => {
    const ws = wsRef.current;
    const payload = { type, data };
    if (!ws || ws.readyState !== WebSocket.OPEN || (requireAuthBeforeSend && !authed)) {
      outboxRef.current.push(payload);
      return;
    }
    try { ws.send(JSON.stringify(payload)); } catch { /* ignore */ }
  }, [authed, requireAuthBeforeSend]);

  const joinRoom = useCallback((chatId: number) => {
    roomsRef.current.add(chatId);
    send('room.join', { chatId });
  }, [send]);

  const leaveRoom = useCallback((chatId: number) => {
    roomsRef.current.delete(chatId);
    send('room.leave', { chatId });
  }, [send]);

  const chatSend = useCallback((chatId: number, text: string, extra?: Record<string, any>) => {
    send('chat.send', { chatId, body: text, ...(extra || {}) });
  }, [send]);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimer.current) return;
    reconnectTimer.current = window.setTimeout(() => {
      reconnectTimer.current = null;
      // Reconnect only if user didn't call disconnect
      if (wsRef.current === null) return; // user called disconnect()
      connect();
    }, reconnectMs) as unknown as number;
  }, [reconnectMs]);

  const handleMessage = useCallback((evt: MessageEvent) => {
    let msg: any;
    try { msg = typeof evt.data === 'string' ? JSON.parse(evt.data) : evt.data; }
    catch { return; }

    const type = msg?.type;
    const data = msg?.data;

    if (!type) return;

    if (type === 'ping') {
      setLastPingTs(Number(data?.ts ?? Date.now()));
      // auto-pong
      try { wsRef.current?.send(JSON.stringify({ type: 'pong', data: { ts: data?.ts ?? Date.now() } })); } catch { }
      return;
    }

    if (authOkSet.has(type)) {
      setAuthed(true);
      flushOutbox();
      // rejoin any remembered rooms
      roomsRef.current.forEach((r) => send('room.join', { chatId: r }));
      return;
    }

    if (type === 'error' && data?.code === 'AUTH') {
      setAuthed(false);
      return;
    }

    // chat event examples (adjust to your server)
    if (type === 'message.new') {
      setMessages((prev) => prev.concat([{ at: Date.now(), room: data?.chatId, text: String(data?.text ?? ''), raw: msg }]));
      return;
    }

    // fallback: log any other server events as raw
    setMessages((prev) => prev.concat([{ at: Date.now(), text: `[${type}] ${JSON.stringify(data)}`, raw: msg }]));
  }, [authOkSet, flushOutbox, send]);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;
    // if already open/connecting, do nothing
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) return;

    // If user previously disconnected, wsRef.current will be null; re-create a marker object so scheduleReconnect knows we’re allowed to reconnect
    if (wsRef.current === null) wsRef.current = undefined as any;

    let ws: WebSocket;
    try {
      ws = new WebSocket(cleanUrl);
    } catch {
      scheduleReconnect();
      return;
    }
    wsRef.current = ws;
    setStatus('connecting');
    setAuthed(false);

    ws.addEventListener('open', () => {
      setStatus('open');
      // auth immediately if token present
      const token = getToken();
      if (token) {
        try { ws.send(JSON.stringify({ type: authType, data: { [authKey]: token } })); } catch { }
      }
      if (!requireAuthBeforeSend) flushOutbox();
    });

    ws.addEventListener('message', handleMessage);

    ws.addEventListener('error', () => {
      // bubble via status/messages if you want; here we just rely on close
    });

    ws.addEventListener('close', () => {
      setStatus('closed');
      // If user did not call disconnect(), try to reconnect
      if (wsRef.current !== null) scheduleReconnect();
    });
  }, [authKey, authType, cleanUrl, flushOutbox, getToken, handleMessage, requireAuthBeforeSend, scheduleReconnect]);

  const disconnect = useCallback(() => {
    // prevent further reconnects
    if (reconnectTimer.current) { clearTimeout(reconnectTimer.current); reconnectTimer.current = null; }
    const ws = wsRef.current;
    wsRef.current = null; // mark as manual close
    try { ws?.close(1000, 'client-disconnect'); } catch { }
    setStatus('closed');
  }, []);

  useEffect(() => () => {
    // cleanup on unmount
    disconnect();
  }, [disconnect]);

  return { status, authed, lastPingTs, messages, connect, disconnect, joinRoom, leaveRoom, chatSend, send, socket: wsRef.current };
}

// export async function getMessages(chatId: number): Promise<ChatMessageType[]> {
//   const { data } = await axiosInstance.get(`/v1/chats/${chatId}/messages`);
//   return data;
// }

// export async function sendMessage(chatId: number, body?: string, type: string = 'text', attachments?: Array<string>, extra?: Partial<ChatMessageType>,) {
//   // server expects: { type: 'text', body, ... }
//   const payload = { type, body, attachments, ...(extra ?? {}) };
//   if (attachments?.length == 0) {
//     delete payload.attachments
//   }

//   const { data } = await axiosInstance.post(`/v1/chats/${chatId}/messages`, payload);
//   return data.data as ChatMessageType;
// }

// export async function UploadAttachments(file: FormData) {
//   const { data } = await axiosInstance.post<{ data: Attachment }>(`/v1/attachments/upload`, file);
//   return data.data;
// }


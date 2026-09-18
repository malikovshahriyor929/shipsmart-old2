'use client';

import React, { useState, useRef } from 'react';
import { Button, ActionIcon, Title, Text } from 'rizzui';
import {
  PiPaperPlaneRightFill,
  PiPaperclipBold,
  PiXBold,
  PiVideo,
} from 'react-icons/pi';
import cn from '@core/utils/class-names';
import EmojiButton from './emoji-button';
import { Attachment } from '@core/types';
import { t } from 'i18next';

interface ChatInputProps {
  onSendMessage: (text: string, attachments?: Attachment[]) => void;
  selected: number | undefined;
  UploadAttachments: (file: FormData) => Promise<Attachment>;
}

export default function ChatInput({ onSendMessage, selected, UploadAttachments }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);
  React.useEffect(() => {
    if (selected) inputRef.current?.focus({ preventScroll: true });
  }, [selected]);
  useAutoFocus(inputRef, { when: true, delay: 0 });
  useAutoFocus(inputRef, { when: !!selected });
  async function uploadSelectedFiles(files: File[]) {
    if (!files.length) return;
    setLoading(true);
    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const fd = new FormData();
          fd.append('files[]', file, file.name);
          const res = await UploadAttachments(fd);
          return Array.isArray(res) ? res : [res];
        })
      );
      const flat: Attachment[] = results.flat() as Attachment[];
      setAttachments((prev) => [...prev, ...flat]);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      setLoading(true);
      onSendMessage(message.trim(), attachments);
      setTimeout(() => setLoading(false), 1000);
      setMessage('');
      setAttachments([]);
    }
  };
  const handleAttachment = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    uploadSelectedFiles(files);
    e.target.value = '';
  };
  // Show fullscreen overlay whenever files are dragged over the window
  React.useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      // allow drop globally (prevents browser from opening the file)
      e.preventDefault();
      const types = Array.from(e.dataTransfer?.types ?? []);
      if (types.includes('Files')) setDragging(true);
    };
    const onDragEnter = (e: DragEvent) => {
      const types = Array.from(e.dataTransfer?.types ?? []);
      if (types.includes('Files')) setDragging(true);
    };
    const onDrop = (e: DragEvent) => {
      // if overlay is not visible and user drops somewhere else -> block navigation
      const overlay = document.getElementById('chat-drop-overlay');
      if (!overlay) e.preventDefault();
    };
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('drop', onDrop);
    };
  }, []);


  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  }
  return (
    <div className="border-t border-gray-200 bg-white pt-3 lg:px-3 dark:border-gray-200 dark:bg-gray-100/40 dark:rounded-br-lg">
      { attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          { attachments.map((file, index) => (
            <div
              key={ index }
              className="relative rounded-md bg-gray-100 p-2 dark:bg-gray-200/70"
            >
              <div className="flex items-center">
                { ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes((file.extension ?? '').toLowerCase()) ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded">
                    <img
                      src={ file.url }
                      alt={ file.file_name }
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : ['mp4', 'mkv', 'webm', 'mov'].includes((file.extension ?? '').toLowerCase()) ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100 dark:bg-blue-900/40">
                    <PiVideo className="h-5 w-5 text-blue-600 dark:text-blue-600" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100 dark:bg-blue-900/40">
                    <PiPaperclipBold className="h-4 w-4 text-blue-600 dark:text-blue-600" />
                  </div>
                ) }
                <div className="ml-2 max-w-[120px]">
                  <p className="truncate text-xs font-medium">{ file.file_name }</p>
                  <p className="text-xs text-gray-500">
                    { ((file.file_size ?? 0) / 1024 / 1024).toFixed(2) } MB
                  </p>
                </div>
              </div>
              <button
                className="absolute -right-1 -top-1 rounded-full bg-gray-700 p-0.5 text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400"
                onClick={ () => removeAttachment(index) }
              >
                <PiXBold className="h-3 w-3" />
              </button>
            </div>
          )) }
        </div>
      ) }

      <form onSubmit={ handleSubmit } className="flex items-center gap-2">
        <div className="flex">
          <ActionIcon
            variant="text"
            size="sm"
            className="h-9 w-9 text-gray-500 hover:text-gray-700 dark:hover:text-gray-600"
            onClick={ handleAttachment }
          >
            <PiPaperclipBold className="h-5 w-5" />
          </ActionIcon>

          <input
            ref={ fileInputRef }
            type="file"
            multiple
            // optional: limit types
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
            className="hidden"
            onChange={ handleFileChange }
          />

          {/* <EmojiButton onPick={ handleEmojiClick } /> */}
        </div>

        <div className={ cn('relative flex-1 rounded-2xl') }
        >
          <textarea
            ref={ inputRef }
            value={ message }
            onChange={ (e) => setMessage(e.target.value) }
            placeholder={ t('chat.typeMessageOrDrop') ?? 'Type a message or drop files…' }
            // placeholder="Type a message or drop files…"
            className={ cn(
              'max-h-30 min-h-[40px] w-full resize-none rounded-2xl border  border-gray-200 px-4 py-2 pr-12 text-sm transition-colors duration-200 focus-within:ring-0 focus:border-mainBlue focus:outline-none focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-gray-500',
              message.length > 0 && 'border-mainBlue dark:border-gray-300',
              'bg-white dark:bg-transparent dark:border-gray-200 dark:text-gray-800',
            ) }
            rows={ 2 }
            onKeyDown={ (e) => {
              if (e.key === 'Enter' && !e.shiftKey && !loading) {
                e.preventDefault();
                handleSubmit(e);
              }
            } }
          />

          <div className="absolute right-0 top-0 mr-1 flex h-[90%] items-center justify-center">
            <Button
              type="submit"
              size="sm"
              className="rounded-full dark:bg-gray-100 dark:text-white dark:border-gray-200 dark:hover:bg-gray-200"
              disabled={ loading || (!message.trim() && attachments.length === 0) }
            >
              <PiPaperPlaneRightFill className="h-4 w-4" />
            </Button>
          </div>

        </div>
      </form>
      { dragging && (
        <FullScreenDropOverlay
          onDropFiles={ (files) => {
            uploadSelectedFiles(files);
            setDragging(false);
          } }
          onCancel={ () => setDragging(false) }
        />
      ) }
    </div>
  );
}

// function useAutoFocus<T extends HTMLElement>(
//   ref: React.RefObject<T>,
//   opts: { when?: boolean; select?: boolean; preventScroll?: boolean; delay?: number } = {}
// ) {
//   const { when = true, select = false, preventScroll = true, delay = 0 } = opts;
//   React.useEffect(() => {
//     if (!when) return;
//     const t = setTimeout(() => {
//       const el = ref.current;
//       if (!el) return;
//       (el as HTMLElement).focus({ preventScroll });
//       if (select && 'select' in el && typeof (el as any).select === 'function') {
//         (el as unknown as HTMLInputElement).select();
//       }
//     }, delay);
//     return () => clearTimeout(t);
//   }, [when, preventScroll, select, delay, ref]);
// }

// 'use client';

// import React, { useState, useRef } from 'react';
// import { createPortal } from 'react-dom';
// import { Button, ActionIcon, Title, Text } from 'rizzui';
// import { PiPaperPlaneRightFill, PiPaperclipBold, PiXBold, PiVideo } from 'react-icons/pi';
// import cn from '@core/utils/class-names';
// import EmojiButton from './emoji-button';
// import { UploadAttachments } from './socket-next';
// import { Attachment } from '@core/types';

// interface ChatInputProps {
//   onSendMessage: (text: string, attachments?: Attachment[]) => void;
//   selected: number | undefined;
// }

// export default function ChatInput({ onSendMessage, selected }: ChatInputProps) {
//   const [message, setMessage] = useState('');
//   const [attachments, setAttachments] = useState<Attachment[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [dragging, setDragging] = useState(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const inputRef = React.useRef<HTMLTextAreaElement>(null);

//   React.useEffect(() => {
//     inputRef.current?.focus({ preventScroll: true });
//   }, []);
//   React.useEffect(() => {
//     if (selected) inputRef.current?.focus({ preventScroll: true });
//   }, [selected]);
//   useAutoFocus(inputRef, { when: true, delay: 0 });
//   useAutoFocus(inputRef, { when: !!selected });

//   // Show fullscreen overlay whenever files are dragged over the window
//   React.useEffect(() => {
//     const onDragOver = (e: DragEvent) => {
//       // allow drop globally (prevents browser from opening the file)
//       e.preventDefault();
//       const types = Array.from(e.dataTransfer?.types ?? []);
//       if (types.includes('Files')) setDragging(true);
//     };
//     const onDragEnter = (e: DragEvent) => {
//       const types = Array.from(e.dataTransfer?.types ?? []);
//       if (types.includes('Files')) setDragging(true);
//     };
//     const onDrop = (e: DragEvent) => {
//       // if overlay is not visible and user drops somewhere else -> block navigation
//       const overlay = document.getElementById('chat-drop-overlay');
//       if (!overlay) e.preventDefault();
//     };
//     window.addEventListener('dragover', onDragOver);
//     window.addEventListener('dragenter', onDragEnter);
//     window.addEventListener('drop', onDrop);
//     return () => {
//       window.removeEventListener('dragover', onDragOver);
//       window.removeEventListener('dragenter', onDragEnter);
//       window.removeEventListener('drop', onDrop);
//     };
//   }, []);

//   // ESC bilan yopish
//   React.useEffect(() => {
//     const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setDragging(false);
//     window.addEventListener('keydown', onEsc);
//     return () => window.removeEventListener('keydown', onEsc);
//   }, []);

//   async function uploadSelectedFiles(files: File[]) {
//     if (!files.length) return;
//     setLoading(true);
//     try {
//       const results = await Promise.all(
//         files.map(async (file) => {
//           const fd = new FormData();
//           fd.append('files[]', file, file.name);
//           const res = await UploadAttachments(fd);
//           return Array.isArray(res) ? res : [res];
//         })
//       );
//       const flat = results.flat() as Attachment[];
//       setAttachments((prev) => [...prev, ...flat]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (message.trim() || attachments.length > 0) {
//       setLoading(true);
//       onSendMessage(message.trim(), attachments);
//       setTimeout(() => setLoading(false), 2000);
//       setMessage('');
//       setAttachments([]);
//     }
//   };

//   const handleAttachment = () => fileInputRef.current?.click();
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files ?? []);
//     if (!files.length) return;
//     uploadSelectedFiles(files);
//     e.target.value = '';
//   };

//   const removeAttachment = (index: number) =>
//     setAttachments((prev) => prev.filter((_, i) => i !== index));

//   return (
//     <div className="border-t border-gray-200 bg-white pt-3 lg:px-3 dark:border-gray-200 dark:bg-gray-100/40">
//       {/* Previews */ }
//       { attachments.length > 0 && (
//         <div className="mb-3 flex flex-wrap gap-2">
//           { attachments.map((file, index) => (
//             <div key={ index } className="relative rounded-md bg-gray-100 p-2 dark:bg-gray-200/70">
//               <div className="flex items-center">
//                 { ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes((file.extension ?? '').toLowerCase()) ? (
//                   <div className="relative h-10 w-10 overflow-hidden rounded">
//                     <img src={ file.url } alt={ file.file_name } className="h-full w-full object-cover" />
//                   </div>
//                 ) : ['mp4', 'mkv', 'webm', 'mov'].includes((file.extension ?? '').toLowerCase()) ? (
//                   <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100 dark:bg-blue-900/40">
//                     <PiVideo className="h-5 w-5 text-blue-600 dark:text-blue-600" />
//                   </div>
//                 ) : (
//                   <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100 dark:bg-blue-900/40">
//                     <PiPaperclipBold className="h-4 w-4 text-blue-600 dark:text-blue-600" />
//                   </div>
//                 ) }
//                 <div className="ml-2 max-w-[140px]">
//                   <p className="truncate text-xs font-medium">{ file.file_name }</p>
//                   <p className="text-xs text-gray-500">{ ((file.file_size ?? 0) / 1024 / 1024).toFixed(2) } MB</p>
//                 </div>
//               </div>
//               <button
//                 className="absolute -right-1 -top-1 rounded-full bg-gray-700 p-0.5 text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400"
//                 onClick={ () => removeAttachment(index) }
//               >
//                 <PiXBold className="h-3 w-3" />
//               </button>
//             </div>
//           )) }
//         </div>
//       ) }

//       <form onSubmit={ handleSubmit } className="flex items-center gap-2">
//         <div className="flex">
//           <ActionIcon
//             variant="text"
//             size="sm"
//             className="h-9 w-9 text-gray-500 hover:text-gray-700 dark:hover:text-gray-600"
//             onClick={ handleAttachment }
//           >
//             <PiPaperclipBold className="h-5 w-5" />
//           </ActionIcon>

//           <input
//             ref={ fileInputRef }
//             type="file"
//             multiple
//             accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
//             className="hidden"
//             onChange={ handleFileChange }
//           />

//           <EmojiButton />
//         </div>

//         {/* Wrapper (no DnD here; overlay is fullscreen) */ }
//         <div className={ cn('relative flex-1 rounded-2xl') }>
//           <textarea
//             ref={ inputRef }
//             value={ message }
//             onChange={ (e) => setMessage(e.target.value) }
//             placeholder="Type a message…"
//             className={ cn(
//               'max-h-30 min-h-[40px] w-full resize-none rounded-2xl border border-gray-200 px-4 py-2 pr-12 text-sm transition-colors duration-200',
//               'focus:border-mainBlue focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500',
//               message.length > 0 && 'border-mainBlue dark:border-gray-300',
//               'bg-white dark:bg-transparent dark:border-gray-200 dark:text-gray-800'
//             ) }
//             rows={ 2 }
//             onKeyDown={ (e) => {
//               if (e.key === 'Enter' && !e.shiftKey && !loading) {
//                 e.preventDefault();
//                 handleSubmit(e);
//               }
//             } }
//           />

//           <div className="absolute right-0 top-0 mr-1 flex h-[90%] items-center justify-center">
//             <Button
//               type="submit"
//               size="sm"
//               className="rounded-full dark:bg-gray-100 dark:text-white dark:border-gray-200 dark:hover:bg-gray-200"
//               disabled={ loading || (!message.trim() && attachments.length === 0) }
//             >
//               <PiPaperPlaneRightFill className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </form>

//       {/* FULLSCREEN DROP OVERLAY (only drop target) */ }
//       { dragging && (
//         <FullScreenDropOverlay
//           onDropFiles={ (files) => {
//             uploadSelectedFiles(files);
//             setDragging(false);
//           } }
//           onCancel={ () => setDragging(false) }
//         />
//       ) }
//     </div>
//   );
// }

/* ---------- Fullscreen overlay component (portal to <body>) ---------- */
function FullScreenDropOverlay({
  onDropFiles,
  onCancel,
}: {
  onDropFiles: (files: File[]) => void;
  onCancel: () => void;
}) {
  const counter = React.useRef(0);

  const overlay = (
    <div
      id="chat-drop-overlay"
      className="size-full max-h-[85%] max-w-[95%] ml-[2.8%] px-1 backdrop-blur-md  mt-[10%] absolute top-0 left-0 flex items-center justify-center border-2 border-gray-800 rounded-2xl "
      onDragEnter={ (e) => {
        e.preventDefault(); e.stopPropagation();
        counter.current += 1;
      } }
      onDragOver={ (e) => {
        e.preventDefault(); e.stopPropagation();
      } }
      onDragLeave={ (e) => {
        e.preventDefault(); e.stopPropagation();
        counter.current -= 1;
        if (counter.current <= 0) {
          counter.current = 0;
          onCancel();
        }
      } }
      onDrop={ (e) => {
        e.preventDefault(); e.stopPropagation();
        counter.current = 0;
        const files = Array.from(e.dataTransfer?.files ?? []);
        if (files.length) onDropFiles(files);
        else onCancel();
      } }
    >
      <div className="pointer-events-none flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-mainBlue/70 px-6 py-8">
        <Title as="h3" className="text-sm text-gray-700 dark:text-gray-100">
          { t('chat.dropFilesToAttach') ?? 'Drop files to attach' }
        </Title>
        <Text className="text-[11px] text-gray-600 dark:text-gray-300">
          <span className="font-medium">{t('chat.supported') ?? 'Supported'}:</span>  {t('chat.supportedTypesList') ?? 'images, video, .pdf, .docx, .xlsx, .csv, .txt'}
        </Text>
      </div>
    </div>
  );
  return overlay
}

function useAutoFocus<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  opts: { when?: boolean; select?: boolean; preventScroll?: boolean; delay?: number } = {}
) {
  const { when = true, select = false, preventScroll = true, delay = 0 } = opts;
  React.useEffect(() => {
    if (!when) return;
    const t = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      (el as HTMLElement).focus({ preventScroll });
      if (select && 'select' in el && typeof (el as any).select === 'function') {
        (el as unknown as HTMLInputElement).select();
      }
    }, delay);
    return () => clearTimeout(t);
  }, [when, preventScroll, select, delay, ref]);
}

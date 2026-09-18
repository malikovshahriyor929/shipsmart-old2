// 'use client';

// import React, { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
// import { Avatar, Button, Modal, Title } from 'rizzui';
// import { format } from 'date-fns';
// import {
//   PiArrowLeft,
//   PiDotsThreeVertical,
//   PiDownloadSimpleBold,
//   PiFilePdf,
//   PiFileZip,
//   PiFileDoc,
//   PiX,
// } from 'react-icons/pi';
// import cn from '@core/utils/class-names';
// import { Attachment, ChatMessageType, ChatType, Creater, GroupType, MessagesType } from '@core/types';
// import { useMeasure } from 'react-use';
// import forceDownload from '@core/utils/downlaod';
// import CustomVideoPlayer from '../video-player';
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import Image from 'next/image';
// import ChatMessagesSkeleton from './loadings/message-loading';
// import InfoModal from './info-modal';
// import ModalButton from '../modal-button';
// export type ChatMessagesHandle = {
//   scrollToBottom: () => void;
// };
// interface ChatMessagesProps {
//   chat: MessagesType[];
//   selectedChats: Creater | GroupType | null;
//   currentUserId: string;
//   type?: string;
//   selected?: number | undefined;
//   setSelected: React.Dispatch<React.SetStateAction<number | undefined>>
//   loadingOlder: boolean;
//   hasMore: boolean;
//   fetchOlder: () => void;
//   ref: React.Ref<ChatMessagesHandle>;
//   loadingMessage?: boolean;
// }
// type Kind = 'photo' | 'video' | 'file';

// const PHOTO_EXT = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'heic', 'heif']);
// const VIDEO_EXT = new Set(['mp4', 'webm', 'mkv', 'mov', 'm4v', 'avi']);

// function kindOf(a: Attachment): Kind {
//   const ext = (a.extension || a.file_name?.split('.').pop() || '').toLowerCase();
//   if (PHOTO_EXT.has(ext)) return 'photo';
//   if (VIDEO_EXT.has(ext)) return 'video';
//   return 'file';
// }

// function rank(kind: Kind): number {
//   // video first (wide), then photos, then files
//   return kind === 'video' ? 0 : kind === 'photo' ? 1 : 2;
// }
// function isGroupChat(chat: Creater | GroupType): chat is GroupType {
//   return chat.type === 'group';
// }


// export default function ChatMessages(
//   { chat,
//     currentUserId,
//     type,
//     selected,
//     fetchOlder,
//     loadingOlder,
//     hasMore,
//     ref,
//     selectedChats,
//     setSelected,
//     loadingMessage
//   }: ChatMessagesProps,
// ) {
//   const [photoModal, setPhotoModal] = useState<{
//     open: boolean;
//     items: Attachment[];
//     index: number;
//   }>({ open: false, items: [], index: 0 });
//   const openPhotoAt = (items: Attachment[], index: number) => setPhotoModal({ open: true, items, index });
//   const closePhoto = useCallback(() => setPhotoModal((s) => ({ ...s, open: false })), []);
//   const nextPhoto = useCallback(() => setPhotoModal((s) => ({ ...s, index: (s.index + 1) % s.items.length })), []);
//   const prevPhoto = useCallback(() => setPhotoModal((s) => ({ ...s, index: (s.index - 1 + s.items.length) % s.items.length })), []);

//   // useEffect(() => {
//   //   // Scroll to bottom when messages change
//   //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   // }, [chat]);
//   const isPrivateChat = selectedChats?.type === 'private';
//   let chatName: string = '';
//   let chatAvatar: string | undefined;
//   let chatStatus: string = 'offline';
//   if (isPrivateChat) {
//     // const otherUser = chat?.find(
//     //   (u) => u.sent_by_me == false
//     // );
//     // if (otherUser) {
//     chatName = selectedChats?.type === 'private' && 'last_name' in selectedChats
//       ? `${selectedChats.first_name} ${selectedChats.last_name}`
//       : 'Unknown';
//     chatAvatar = selectedChats?.type === 'private' && 'avatar' in selectedChats ? selectedChats.avatar?.url : undefined;
//     chatStatus = 'online' in selectedChats && selectedChats.online ? "online" : "offline";
//     // }
//     // chatStatus =
//     //   otherUser?.status === 'online'
//     //     ? 'online'
//     //     : otherUser?.lastSeen
//     //       ? `last seen ${format(otherUser.lastSeen, 'h:mm a')}`
//     //       : 'offline';
//   } else if (selectedChats && isGroupChat(selectedChats)) {
//     chatName = selectedChats.title || 'Unknown';
//     const onlineCount = Number(selectedChats.online_members) || 0;
//     const totalCount = selectedChats.total_members || 0;
//     if (onlineCount > 0) {
//       chatStatus = `${onlineCount} member${onlineCount > 1 ? 's' : ''} online`;
//     } else if (totalCount > 0) {
//       chatStatus = `${totalCount} member${totalCount > 1 ? 's' : ''}`;
//     } else {
//       chatStatus = 'offline';
//     }
//   } else {
//     chatName = 'Unknown';
//     chatStatus = 'offline';
//   }
//   // Helper function to group messages by date
//   const groupMessagesByDate = (
//     messages: MessagesType[]
//   ): { date: string; messages: MessagesType[] }[] => {
//     const groups: Record<string, MessagesType[]> = {};

//     messages?.forEach((message) => {
//       const dateStr = format(message.created_at, 'yyyy-MM-dd');
//       if (!groups[dateStr]) {
//         groups[dateStr] = [];
//       }
//       groups[dateStr].push(message);
//     });

//     return Object.entries(groups).map(([date, messages]) => ({
//       date,
//       messages,
//     }));
//   };
//   const messageGroups = groupMessagesByDate(chat);
//   // const renderAttachment = (attachment: Attachment) => {
//   //   if (attachment.extension === 'jpeg' || attachment.extension === 'jpg' || attachment.extension === 'png') {
//   //     return (
//   //       <div className="relative mb-1 border border-gray-200 dark:border-gray-700 w-fit overflow-hidden rounded-lg">
//   //         <img
//   //           height={ 60 }
//   //           width={ 120 }
//   //           src={ attachment.url ?? "/chatPhotodefualt.webp" }
//   //           alt={ attachment.file_name || 'Image' }
//   //           className="h-auto w-auto rounded-lg object-cover"
//   //         />
//   //         <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:bg-black/20 hover:opacity-100">
//   //           <Button
//   //             isLoading={ loadingAttachmentId === attachment.public_id }
//   //             onClick={ () => attachment.url && forceDownload(attachment.url, attachment.file_name) }
//   //             rounded="pill"
//   //             color="primary"
//   //             size="sm"
//   //             variant="solid"
//   //             className="bg-transparent text-lg text-white transition-colors duration-300 hover:bg-black/30"
//   //           >
//   //             <PiArrowDownBold />
//   //           </Button>
//   //         </div>
//   //       </div>
//   //     );
//   //   }
//   //   if (attachment.extension === 'mp4' || attachment.extension === 'webm' || attachment.extension === 'mkv' || attachment.extension === 'mov') {
//   //     return (
//   //       <div className="relative mb-1 w-fit overflow-hidden rounded-lg">
//   //         <CustomVideoPlayer src={ attachment.url ?? "/chatVdDefualt.jpg" } className='min-w-[120px] min-h-[60px]' />
//   //         {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:bg-black/20 hover:opacity-100">
//   //           <Button
//   //             isLoading={ loadingAttachmentId === attachment.public_id }
//   //             onClick={ () => attachment.url && forceDownload(attachment.url, attachment.file_name) }
//   //             rounded="pill"
//   //             color="primary"
//   //             size="sm"
//   //             variant="solid"
//   //             className="bg-transparent text-lg text-white transition-colors duration-300 hover:bg-black/30"
//   //           >
//   //             <PiArrowDownBold />
//   //           </Button>
//   //         </div> */}
//   //       </div>
//   //     );
//   //   }

//   //   // File attachment
//   //   let icon = <PiFilePdf className="h-6 w-6 text-red-500" />;
//   //   if (
//   //     attachment.file_name?.endsWith('.doc') ||
//   //     attachment.file_name?.endsWith('.docx')
//   //   ) {
//   //     icon = <PiFileDoc className="h-6 w-6 text-blue-500" />;
//   //   } else if (
//   //     attachment.file_name?.endsWith('.zip') ||
//   //     attachment.file_name?.endsWith('.rar')
//   //   ) {
//   //     icon = <PiFileZip className="h-6 w-6 text-orange-500" />;
//   //   }

//   //   return (
//   //     <div className="mb-1 flex items-center rounded-lg bg-gray-100 p-3 dark:bg-gray-100">
//   //       { icon }
//   //       <div className="ml-3 flex-1 overflow-hidden">
//   //         <p className="truncate font-medium">{ attachment.file_name }</p>
//   //         <p className="text-xs text-gray-500">{ ((attachment.file_size ?? 0) / 1024 / 1024)?.toFixed(2) } Mb</p>
//   //       </div>
//   //       <button
//   //         className="ml-2 rounded-full p-1 text-gray-500 hover:text-gray-600"
//   //         onClick={ () => attachment.url && forceDownload(attachment.url, attachment.file_name) }
//   //       >
//   //         <PiDownloadSimpleBold className="h-5 w-5" />
//   //       </button>
//   //     </div>
//   //   );
//   // };
//   // ------------------ scroll ------------------ 
//   // const scrollRef = useRef<HTMLDivElement | null>(null);
//   // const endRef = useRef<HTMLDivElement | null>(null);

//   // // Measure **content** height (not the container)
//   // const [bindContentMeasure, { height: contentH }] = useMeasure();
//   // const prevContentH = useRef(0);
//   // // Snapshot/restore for PREPEND
//   // const restoreRef = useRef<{ top: number; height: number; active: boolean }>({ top: 0, height: 0, active: false, });
//   // // Expose scrollToBottom to parent
//   // useImperativeHandle(
//   //   ref,
//   //   () => ({
//   //     scrollToBottom() {
//   //       requestAnimationFrame(() => {
//   //         endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
//   //       });
//   //     },
//   //   }),
//   //   []
//   // );
//   // const setScrollEl = useCallback((el: HTMLDivElement | null) => {
//   //   scrollRef.current = el;
//   // }, []);

//   // const didInitialAutoscroll = useRef(false);

//   // const isNearBottom = useCallback(() => {
//   //   const el = scrollRef.current;
//   //   if (!el) return true;
//   //   const threshold = 80;
//   //   return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
//   // }, []);

//   // useEffect(() => {
//   //   const el = scrollRef.current;
//   //   if (!el) return;

//   //   if (!didInitialAutoscroll.current) {
//   //     didInitialAutoscroll.current = true;     // run only once per chat select
//   //     prevContentH.current = contentH;
//   //     setTimeout(() => endRef.current?.scrollIntoView(), 0);
//   //     return;
//   //   }

//   //   if (!restoreRef.current.active) {
//   //     const delta = contentH - prevContentH.current;
//   //     if (delta > 0) {
//   //       if (isNearBottom()) {
//   //         requestAnimationFrame(() => {
//   //           endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
//   //         });
//   //       } else {
//   //         scrollRef.current!.scrollTop += delta;
//   //       }
//   //     }
//   //     prevContentH.current = contentH;
//   //   }
//   //   didInitialAutoscroll.current = false;
//   // }, [contentH, messageGroups.length, isNearBottom]);

//   // useLayoutEffect(() => {
//   //   // FIX: only restore when we actually requested prepend and loading is done
//   //   if (!restoreRef.current.active || loadingOlder) return;

//   //   const el = scrollRef.current;
//   //   if (!el) return;

//   //   const delta = el.scrollHeight - restoreRef.current.height;
//   //   el.scrollTop = restoreRef.current.top + delta;

//   //   // FIX: clear flag and set **new baseline** to avoid a 2nd “delta” jump
//   //   restoreRef.current.active = false;
//   //   prevContentH.current = el.scrollHeight;
//   // }, [chat, loadingOlder]);

//   // // --- Infinite scroll trigger (top) with rAF throttle ---
//   // const rafLock = useRef<number | null>(null);
//   // const onScroll = useCallback(() => {
//   //   if (rafLock.current !== null) return;
//   //   rafLock.current = requestAnimationFrame(() => {
//   //     rafLock.current = null;
//   //     const el = scrollRef.current;
//   //     if (!el) return;

//   //     if (!loadingOlder && hasMore && el.scrollTop <= 50) {
//   //       // FIX: snapshot BEFORE fetching
//   //       restoreRef.current.top = el.scrollTop; // usually ~0
//   //       restoreRef.current.height = el.scrollHeight;
//   //       restoreRef.current.active = true;
//   //       fetchOlder();
//   //     }
//   //   });
//   // }, [loadingOlder, hasMore, fetchOlder]);
//   // --- Scroll / measure refs ---

//   const renderAttachment = (attachment: Attachment) => {
//     const ext = (attachment.extension || '').toLowerCase();

//     if (ext === 'jpeg' || ext === 'jpg' || ext === 'png' || ext === 'webp' || ext === 'gif') {
//       return (
//         <div className="relative mb-1 border border-gray-200 dark:border-gray-700 w-ful overflow-hidden rounded-lg">
//           <img
//             src={ attachment.url ?? "/chatPhotodefualt.webp" }
//             alt={ attachment.file_name || 'Image' }
//             className="w-full h-auto md:h-40 min-[1650px]:h-64 object-cover"
//           />
//           {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:bg-black/20 hover:opacity-100">
//             <Button
//               isLoading={ loadingAttachmentId === attachment.public_id }
//               onClick={ () => attachment.url && forceDownload(attachment.url, attachment.file_name) }
//               rounded="pill"
//               color="primary"
//               size="sm"
//               variant="solid"
//               className="bg-transparent text-lg text-white transition-colors duration-300 hover:bg-black/30"
//             >
//               <PiArrowDownBold />
//             </Button>
//           </div> */}
//         </div>
//       );
//     }

//     if (ext === 'mp4' || ext === 'webm' || ext === 'mkv' || ext === 'mov') {
//       return (
//         <div className="relative mb-1 w-full overflow-hidden rounded-lg">
//           <CustomVideoPlayer src={ attachment.url ?? "/chatVdDefualt.jpg" } className="w-full" poster='/chatVdDefualt.jpg' size='sm' />
//         </div>
//       );
//     }

//     // File fallback
//     let icon = <PiFilePdf className="h-6 w-6 text-red-500" />;
//     if (attachment.file_name?.endsWith('.doc') || attachment.file_name?.endsWith('.docx')) {
//       icon = <PiFileDoc className="h-6 w-6 text-blue-500" />;
//     } else if (attachment.file_name?.endsWith('.zip') || attachment.file_name?.endsWith('.rar')) {
//       icon = <PiFileZip className="h-6 w-6 text-orange-500" />;
//     }

//     return (
//       <div className="mb-1 flex items-center rounded-lg bg-gray-100 p-3 dark:bg-gray-100 w-full">
//         { icon }
//         <div className="ml-3 flex-1 overflow-hidden">
//           <p className="truncate font-medium">{ attachment.file_name }</p>
//           <p className="text-xs text-gray-500">
//             { (((attachment.file_size ?? 0) / 1024 / 1024)).toFixed(2) } Mb
//           </p>
//         </div>
//         <button
//           className="ml-2 rounded-full p-1 text-gray-500 hover:text-gray-600"
//           onClick={ () => attachment.url && forceDownload(attachment.url, attachment.file_name) }
//         >
//           <PiDownloadSimpleBold className="h-5 w-5" />
//         </button>
//       </div>
//     );
//   };

//   useEffect(() => {
//     if (!photoModal.open) return;
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === 'ArrowRight') nextPhoto();
//       if (e.key === 'ArrowLeft') prevPhoto();
//       if (e.key === 'Escape') closePhoto();
//     };
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, [photoModal.open, nextPhoto, prevPhoto, closePhoto]);

//   const scrollRef = useRef<HTMLDivElement | null>(null);
//   const endRef = useRef<HTMLDivElement | null>(null);
//   const [bindContentMeasure, { height: contentH }] = useMeasure();
//   const prevContentH = useRef(0);
//   const didInitialAutoscroll = useRef(false);
//   // Snapshot/restore for PREPEND
//   const restoreRef = useRef<{ top: number; height: number; active: boolean }>({
//     top: 0,
//     height: 0,
//     active: false,
//   });
//   // Expose scrollToBottom to parent
//   useImperativeHandle(
//     ref,
//     () => ({
//       scrollToBottom() {
//         requestAnimationFrame(() => {
//           endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
//         });
//       },
//     }),
//     []
//   );
//   const setScrollEl = useCallback((el: HTMLDivElement | null) => {
//     scrollRef.current = el;
//   }, []);
//   const isNearBottom = useCallback(() => {
//     const el = scrollRef.current;
//     if (!el) return true;
//     const threshold = 80;
//     return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
//   }, []);
//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;

//     if (!didInitialAutoscroll.current) {
//       didInitialAutoscroll.current = true;     // run only once per chat select
//       prevContentH.current = contentH;
//       // requestAnimationFrame(() => {
//       // isNearBottom() && endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
//       isNearBottom() && setTimeout(() => endRef.current?.scrollIntoView(), 0);
//       // })

//       return;
//     }

//     if (!restoreRef.current.active) {
//       const delta = contentH - prevContentH.current;
//       if (delta > 0) {
//         if (isNearBottom()) {
//           requestAnimationFrame(() => {
//             endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
//           });
//         } else {
//           // keep viewport anchored while content above/below reflows
//           scrollRef.current!.scrollTop += delta;
//         }
//       }
//       prevContentH.current = contentH;
//     }
//     didInitialAutoscroll.current = false;
//   }, [contentH, messageGroups.length, isNearBottom]);
//   useLayoutEffect(() => {
//     // FIX: only restore when we actually requested prepend and loading is done
//     if (!restoreRef.current.active || loadingOlder) return;

//     const el = scrollRef.current;
//     if (!el) return;

//     const delta = el.scrollHeight - restoreRef.current.height;
//     el.scrollTop = restoreRef.current.top + delta;

//     // FIX: clear flag and set **new baseline** to avoid a 2nd “delta” jump
//     restoreRef.current.active = false;
//     prevContentH.current = el.scrollHeight;
//   }, [chat, loadingOlder]);
//   // useEffect(() => {
//   //   // FIX: only restore when we actually requested prepend and loading is done
//   //   setTimeout(() => {
//   //     endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
//   //   }, 0);
//   // }, [messageGroups.length]);
//   const rafLock = useRef<number | null>(null);
//   const onScroll = useCallback(() => {
//     if (rafLock.current !== null) return;
//     rafLock.current = requestAnimationFrame(() => {
//       rafLock.current = null;
//       const el = scrollRef.current;
//       if (!el) return;

//       if (!loadingOlder && hasMore && el.scrollTop <= 50) {
//         // FIX: snapshot BEFORE fetching
//         restoreRef.current.top = el.scrollTop; // usually ~0
//         restoreRef.current.height = el.scrollHeight;
//         restoreRef.current.active = true;
//         fetchOlder();
//       }
//     });
//   }, [loadingOlder, hasMore, fetchOlder]);
//   // --- end Scroll / measure refs ---

//   return (
//     <>
//       {/* Chat header */ }
//       <div className="flex items-center justify-between border-b border-gray-200 min-[820px]:px-3 py-2 dark:border-gray-200">
//         <div className="flex items-center">
//           <button
//             onClick={ () => setSelected(undefined) }
//             className="mr-3 rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 min-[820px]:hidden "
//           >
//             <PiArrowLeft className="h-6 w-6" />
//           </button>
//           <ModalButton
//             label=''
//             icon=''
//             disabled={ selectedChats?.type !== 'private' }
//             className='bg-transparent hover:bg-transparent w-full flex justify-normal h-auto cursor-pointer items-center rounded-l-md m-0 py-0 px-0 ring-0 border-none'
//             view={ selectedChats?.type === 'private' && (
//               <InfoModal user={ selectedChats as Creater & { chat_id?: number } } />
//             ) }
//           >
//             <div className='flex '>
//               <div className="relative">
//                 <Avatar
//                   src={ chatAvatar }
//                   name={ chatName }
//                   size="md"
//                   className="ring-2 ring-white dark:ring-gray-800"
//                 />
//                 { isPrivateChat && chatStatus === 'online' && (
//                   <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-200"></span>
//                 ) }
//               </div>
//               <div className="ml-3 flex flex-col items-start ">
//                 { chatName == "Unknown" ?
//                   <div className='w-[100px] animate-pulse duration-300 h-5 my-1 bg-gray-400 rounded-lg' />
//                   : <h3 className="font-medium">{ chatName }</h3>
//                 }
//                 <p className={ `text-xs text-gray-500 ${!isPrivateChat && "lowercase"} ` }>{ chatStatus }</p>
//               </div>
//             </div>
//           </ModalButton>
//         </div>
//         <button className="rounded-full p-1.5 hover:bg-gray-100">
//           <PiDotsThreeVertical className="h-5 w-5 text-gray-600" />
//         </button>
//       </div>

//       {/* Chat messages */ }
//       <div
//         ref={ setScrollEl }
//         className="flex-1 overflow-y-auto p-4 duration-300 ease-in-out"
//         onScroll={ onScroll }
//       >
//         <div ref={ bindContentMeasure as any }>
//           { loadingMessage ? <ChatMessagesSkeleton />
//             : messageGroups.length > 0
//               ? messageGroups.map((group, indexs) => (
//                 <div key={ indexs } className="mb-6">
//                   <div className="mb-4 flex justify-center">
//                     <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-gray-100">
//                       { format(new Date(group.date), 'MMMM d, yyyy') }
//                     </span>
//                   </div>

//                   { group.messages.map((message, index) => {
//                     const isCurrentUser = message.sent_by_me;
//                     const showAvatar =
//                       !isCurrentUser &&
//                       (index === 0 ||
//                         group.messages[index - 1].sender.id !== message.sender.id);

//                     // Find the sender
//                     const sender = chat.find(
//                       (p: any) => p.id === message.sender.id
//                     );

//                     return (
//                       <div
//                         key={ `${indexs}-${index}` }
//                         className={ cn(
//                           'mb-4 flex',
//                           isCurrentUser ? 'justify-end' : 'justify-start'
//                         ) }
//                       >
//                         { !isCurrentUser && (
//                           <Avatar
//                             src={ message.sender.avatar?.url }
//                             name={ sender?.sender.first_name || 'Sender' }
//                             size="sm"
//                             className="mr-2 self-end"
//                           />
//                         ) }

//                         <div
//                           className={ cn(
//                             'max-w-[55%]',
//                             isCurrentUser ? 'items-end' : 'items-start'
//                           ) }
//                         >
//                           {/* {!isCurrentUser && showAvatar && chat.type === 'group' && (
//                       <p className="mb-1 text-xs font-medium text-gray-500">
//                         {sender?.sender.first_name}
//                       </p>
//                     )} */}

//                           <div>
//                             {/* Render attachments if any */ }
//                             { message?.attachment && message.attachment.length > 0 && (() => {
//                               const sorted = [...message.attachment].sort((a, b) => rank(kindOf(a)) - rank(kindOf(b)));
//                               const photos = sorted.filter(a => kindOf(a) === 'photo');        // photos of THIS message
//                               const total = sorted.length;
//                               const isEven = total % 2 === 0;

//                               return (
//                                 <div className='relative mb-1'>
//                                   <div className=" grid grid-cols-2  gap-2">
//                                     { sorted.map((attachment, i) => {
//                                       const k = kindOf(attachment);

//                                       let spanClass = 'col-span-1 ';
//                                       if (k === 'video' || k === 'file') spanClass = 'col-span-2';
//                                       else if (!isEven && i === 0) spanClass = 'col-span-2';
//                                       const photoIdx =
//                                         k === 'photo' ? photos.findIndex(p => p.public_id === attachment.public_id) : -1;
//                                       const onTileClick =
//                                         k === 'photo'
//                                           ? () => openPhotoAt(photos, Math.max(0, photoIdx))
//                                           : undefined;
//                                       return (
//                                         <div key={ attachment.public_id || i } className={ spanClass } onClick={ onTileClick } role={ k === 'photo' ? 'button' : undefined }>
//                                           { renderAttachment(attachment) }
//                                         </div>
//                                       );
//                                     }) }
//                                   </div>
//                                   <div
//                                     className={ cn(
//                                       'flex items-center text-xs',
//                                       isCurrentUser ? 'justify-end' : 'justify-start'
//                                     ) }
//                                   >
//                                     <span className="mr-1">
//                                       { format(message.created_at, 'h:mm a') }
//                                     </span>
//                                   </div>
//                                 </div>
//                               );
//                             })() }
//                             { message.body && (
//                               <div
//                                 className={ cn(
//                                   'rounded-2xl px-3 pt-2 min-w-[70px] w-fit pb-5 dark:text-white/80 relative',
//                                   isCurrentUser
//                                     ? 'rounded-br-sm ml-auto bg-mainBlue text-white dark:bg-blue-900'
//                                     : 'rounded-bl-sm mr-auto bg-gray-100 dark:bg-white/10'
//                                 ) }
//                               >
//                                 <p className="whitespace-pre-wrap  break-all [overflow-wrap:anywhere] text-sm">
//                                   { message.body }
//                                 </p>
//                                 <div
//                                   className={ cn(
//                                     'flex items-center text-xs absolute bottom-0 right-0 mr-1 mb-1',
//                                     isCurrentUser ? 'justify-end  text-gray-300' : 'justify-start text-gray-400'
//                                   ) }
//                                 >
//                                   <span className="mr-1">
//                                     { format(message.created_at, 'h:mm a') }
//                                   </span>

//                                   {/* {isCurrentUser && (
//                           <span>
//                             {message.status === 'sent' && (
//                               <PiCheck className="h-3.5 w-3.5" />
//                             )}
//                             {message.status === 'delivered' && (
//                               <PiCheckBold className="h-3.5 w-3.5" />
//                             )}
//                             {message.status === 'read' && (
//                               <PiChecksBold className="h-3.5 w-3.5" />
//                             )}
//                           </span>
//                         )} */}
//                                 </div>
//                               </div>
//                             ) }
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   }) }
//                 </div>
//               ))
//               : <div className="absolute w-full flex  h-[80%] flex-col items-center justify-center p-5 text-center">
//                 <div className="mb-5 h-60 w-60 rounded-full">
//                   <Image
//                     width={ 240 }
//                     height={ 240 }
//                     src="/PLACEHOLDER_IMAGE.png"
//                     alt="Select a chat"
//                     className="h-full w-full object-cover opacity-80"
//                   />
//                 </div>
//                 <Title as="h4" className="mb-2 text-lg font-semibold text-mainBlue">
//                   Start a conversation
//                 </Title>
//                 <p className="text-mainBlue/70 dark:text-gray-400">
//                   Write Some messages
//                 </p>
//               </div> }
//           <div ref={ endRef } />
//         </div>
//       </div>
//       <Modal isOpen={ photoModal.open } onClose={ closePhoto } size="full" containerClassName='bg-transparent backdrop-blur' overlayClassName='backdrop-blur' >
//         { photoModal.items.length > 0 && (
//           <div className="w-screen h-screen backdrop-blur bg-transparent relative ">

//             <div className='fixed top-3 right-3 z-50  hover:bg-gray-400 duration-300 rounded-lg ' onClick={ closePhoto }>
//               <PiX className='size-10 text-white' />
//             </div>

//             <div className="relative z-30 h-[100vh] flex items-center justify-center " onClick={ closePhoto }>
//               <img
//                 src={ photoModal.items[photoModal.index]?.url ?? '/chatPhotodefualt.webp' }
//                 alt={ photoModal.items[photoModal.index]?.file_name || 'Image' }
//                 className="mx-auto h-auto max-h-[70vh] w-full max-w-[70vw] rounded-xl object-contain"
//               />
//             </div>

//             { photoModal.items.length > 1 && (
//               <div className="px-10 fixed top-1/2 z-40 left-0 w-full  flex items-center justify-between">
//                 <div className='  hover:bg-gray-400 duration-300  rounded-full ' onClick={ prevPhoto }>
//                   <FiChevronLeft className='text-white size-10 -translate-x-0.5' />
//                 </div>
//                 <div className='  hover:bg-gray-400 duration-300 rounded-full ' onClick={ nextPhoto }>
//                   <FiChevronRight className='text-white size-10 translate-x-0.5' />
//                 </div>
//               </div>
//             ) }
//           </div>
//         ) }
//       </Modal>

//     </>
//   );
// }

// // 'use client';

// // import React, {
// //   useCallback,
// //   useEffect,
// //   useImperativeHandle,
// //   useLayoutEffect,
// //   useMemo,
// //   useRef,
// //   useState,
// // } from 'react';
// // import { Avatar, Button } from 'rizzui';
// // import { format } from 'date-fns';
// // import {
// //   PiArrowLeft,
// //   PiDotsThreeVertical,
// //   PiDownloadSimpleBold,
// //   PiFilePdf,
// //   PiFileZip,
// //   PiFileDoc,
// //   PiArrowDownBold,
// // } from 'react-icons/pi';
// // import cn from '@core/utils/class-names';
// // import { useRouter } from '@/i18n/routing';
// // import Image from 'next/image';
// // import toast from 'react-hot-toast';
// // import { ChatMessageType } from '@core/types';
// // import { useMeasure } from 'react-use';

// // export type ChatMessagesHandle = { scrollToBottom: () => void };

// // type ChatMessagesProps = {
// //   chat: ChatMessageType[];
// //   currentUserId: string;
// //   type?: string;
// //   selected?: number;
// //   loadingOlder: boolean;
// //   hasMore: boolean;
// //   fetchOlder: () => void;
// // };

// // // ✅ forwardRef so parent ref actually works
// // const ChatMessages = React.forwardRef<ChatMessagesHandle, ChatMessagesProps>(
// //   ({ chat, currentUserId, type, selected, fetchOlder, loadingOlder, hasMore }, ref) => {
// //     const router = useRouter();

// //     // --- Header (peer info) ---
// //     const isPrivateChat = type === 'private';
// //     let chatName = '';
// //     let chatAvatar: string | undefined;
// //     let chatStatus = 'offline';
// //     if (isPrivateChat) {
// //       const otherUser = chat?.find((u) => u.sent_by_me === false);
// //       if (otherUser) {
// //         chatName = `${otherUser?.sender?.first_name ?? ''} ${otherUser?.sender?.last_name ?? ''}`.trim();
// //         chatAvatar = otherUser?.sender?.avatar?.url;
// //       }
// //     }

// //     // --- Grouping by date (be robust to string/number dates) ---
// //     const messageGroups = useMemo(() => {
// //       const groups: Record<string, ChatMessageType[]> = {};
// //       for (const m of chat) {
// //         const d = new Date(m.created_at as any); // FIX: normalize
// //         const key = isNaN(d.getTime()) ? '1970-01-01' : format(d, 'yyyy-MM-dd');
// //         (groups[key] ||= []).push(m);
// //       }
// //       return Object.entries(groups).map(([date, messages]) => ({ date, messages }));
// //     }, [chat]);

// //     // --- Attachments (unchanged UI) ---
// //     const [loadingAttachmentId, setLoadingAttachmentId] = useState<string | null>(null);
// //     const handleDownload = (attachmentId: string) => {
// //       setLoadingAttachmentId(attachmentId);
// //       setTimeout(() => {
// //         setLoadingAttachmentId(null);
// //         toast.success('Downloaded');
// //       }, 800);
// //     };

// //     // --- Scroll / measure refs ---
// //     const scrollRef = useRef<HTMLDivElement | null>(null);
// //     const endRef = useRef<HTMLDivElement | null>(null);

// //     // Measure **content** height (not the container)
// //     const [bindContentMeasure, { height: contentH }] = useMeasure();
// //     const prevContentH = useRef(0);

// //     // Snapshot/restore for PREPEND
// //     const restoreRef = useRef<{ top: number; height: number; active: boolean }>({
// //       top: 0,
// //       height: 0,
// //       active: false,
// //     });

// //     // Expose scrollToBottom to parent
// //     useImperativeHandle(
// //       ref,
// //       () => ({
// //         scrollToBottom() {
// //           requestAnimationFrame(() => {
// //             endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
// //           });
// //         },
// //       }),
// //       []
// //     );

// //     const setScrollEl = useCallback((el: HTMLDivElement | null) => {
// //       scrollRef.current = el;
// //     }, []);

// //     const didInitialAutoscroll = useRef(false);

// //     const isNearBottom = useCallback(() => {
// //       const el = scrollRef.current;
// //       if (!el) return true;
// //       const threshold = 80;
// //       return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
// //     }, []);

// //     // --- Append/initial behavior driven by CONTENT height ---
// //     useEffect(() => {
// //       const el = scrollRef.current;
// //       if (!el) return;

// //       // Initial short list → go bottom
// //       // if (messageGroups.length <= 5) {
// //       //   prevContentH.current = contentH;
// //       //   setTimeout(() => endRef.current?.scrollIntoView(), 0);
// //       //   return;
// //       // }
// //       if (!didInitialAutoscroll.current) {
// //         didInitialAutoscroll.current = true;     // run only once per chat select
// //         prevContentH.current = contentH;
// //         setTimeout(() => endRef.current?.scrollIntoView(), 0);
// //         return;
// //       }

// //       if (!restoreRef.current.active) {
// //         const delta = contentH - prevContentH.current;
// //         if (delta > 0) {
// //           if (isNearBottom()) {
// //             // only auto-bottom if the user is already near bottom
// //             requestAnimationFrame(() => {
// //               endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
// //             });
// //           } else {
// //             // keep viewport anchored while content above/below reflows
// //             scrollRef.current!.scrollTop += delta;
// //           }
// //         }
// //         prevContentH.current = contentH;
// //       }
// //       didInitialAutoscroll.current = false;
// //     }, [contentH, messageGroups.length, isNearBottom]);

// //     // --- PREPEND restore (run AFTER fetchOlder finishes) ---
// //     useLayoutEffect(() => {
// //       // FIX: only restore when we actually requested prepend and loading is done
// //       if (!restoreRef.current.active || loadingOlder) return;

// //       const el = scrollRef.current;
// //       if (!el) return;

// //       const delta = el.scrollHeight - restoreRef.current.height;
// //       el.scrollTop = restoreRef.current.top + delta;

// //       // FIX: clear flag and set **new baseline** to avoid a 2nd “delta” jump
// //       restoreRef.current.active = false;
// //       prevContentH.current = el.scrollHeight;
// //     }, [chat, loadingOlder]);

// //     // --- Infinite scroll trigger (top) with rAF throttle ---
// //     const rafLock = useRef<number | null>(null);
// //     const onScroll = useCallback(() => {
// //       if (rafLock.current !== null) return;
// //       rafLock.current = requestAnimationFrame(() => {
// //         rafLock.current = null;
// //         const el = scrollRef.current;
// //         if (!el) return;

// //         if (!loadingOlder && hasMore && el.scrollTop <= 50) {
// //           // FIX: snapshot BEFORE fetching
// //           restoreRef.current.top = el.scrollTop; // usually ~0
// //           restoreRef.current.height = el.scrollHeight;
// //           restoreRef.current.active = true;
// //           fetchOlder();
// //         }
// //       });
// //     }, [loadingOlder, hasMore, fetchOlder]);

// //     return (
// //       <>
// //         {/* Header */ }
// //         <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-200">
// //           <div className="flex items-center">
// //             <button
// //               onClick={ () => router.back() }
// //               className="mr-3 rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
// //             >
// //               <PiArrowLeft className="h-6 w-6" />
// //             </button>
// //             <div className="relative">
// //               <Avatar src={ chatAvatar } name={ chatName } size="md" className="ring-2 ring-white dark:ring-gray-800" />
// //             </div>
// //             <div className="ml-3">
// //               <h3 className="font-medium">{ chatName }</h3>
// //               <p className="text-xs text-gray-500">{ chatStatus }</p>
// //             </div>
// //           </div>
// //           <button className="rounded-full p-1.5 hover:bg-gray-100">
// //             <PiDotsThreeVertical className="h-5 w-5 text-gray-600" />
// //           </button>
// //         </div>

// //         {/* Messages */ }
// //         <div
// //           ref={ setScrollEl }
// //           className="flex-1 overflow-y-auto p-4 duration-300 ease-in-out"
// //           onScroll={ onScroll }
// //         >
// //           {/* FIX: measure the **content** for correct delta math */ }
// //           { messageGroups.map((group, gi) => (
// //             <div key={ gi } className="mb-6">
// //               <div className="mb-4 flex justify-center">
// //                 <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-gray-100">
// //                   { format(new Date(group.date), 'MMMM d, yyyy') }
// //                 </span>
// //               </div>

// //               { group.messages.map((message, mi) => {
// //                 const isMe = message.sent_by_me;
// //                 return (
// //                   <div
// //                     key={ `${gi}-${mi}` }
// //                     className={ cn('mb-4 flex', isMe ? 'justify-end' : 'justify-start') }
// //                   >
// //                     { !isMe && (
// //                       <Avatar
// //                         src={ message.sender?.avatar?.url }
// //                         name={ (message.sender as any)?.first_name ?? 'Sender' }
// //                         size="sm"
// //                         className="mr-2 self-end"
// //                       />
// //                     ) }

// //                     <div className={ cn('max-w-[50%]', isMe ? 'items-end' : 'items-start') }>
// //                       { message.body && (
// //                         <div
// //                           className={ cn(
// //                             'rounded-2xl px-4 py-2 dark:text-white/80',
// //                             isMe ? 'rounded-br-sm bg-mainBlue text-white dark:bg-blue-900'
// //                               : 'rounded-bl-sm bg-gray-100 dark:bg-white/10'
// //                           ) }
// //                         >
// //                           <p className="whitespace-pre-wrap break-words text-sm">{ message.body }</p>
// //                         </div>
// //                       ) }
// //                       <div
// //                         className={ cn(
// //                           'mt-1 flex items-center text-xs text-gray-500',
// //                           isMe ? 'justify-end' : 'justify-start'
// //                         ) }
// //                       >
// //                         <span className="mr-1">
// //                           { format(new Date(message.created_at as any), 'h:mm a') /* FIX: normalize */ }
// //                         </span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               }) }
// //             </div>
// //           )) }
// //           <div ref={ endRef } />
// //         </div>
// //       </>
// //     );
// //   }
// // );

// // ChatMessages.displayName = 'ChatMessages';
// // export default ChatMessages;

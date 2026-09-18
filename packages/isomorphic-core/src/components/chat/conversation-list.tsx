// // 'use client';

// // import React, { useState } from 'react';
// // import { Avatar, Input } from 'rizzui';
// // import { Chat, User } from '@/data/chat-data';
// // import { formatDistanceToNow } from 'date-fns';
// // import {
// //   PiMagnifyingGlassBold,
// //   PiUserCirclePlusBold,
// //   PiUserPlus,
// // } from 'react-icons/pi';
// // import cn from '@core/utils/class-names';
// // import toast from 'react-hot-toast';

// // interface ConversationListProps {
// //   chats: Chat[];
// //   activeChatId?: string;
// //   onSelectChat: (chatId: string) => void;
// //   className?: string;
// // }

// // export default function ConversationList({
// //   chats,
// //   activeChatId,
// //   onSelectChat,
// //   className,
// // }: ConversationListProps) {
// //   const [searchTerm, setSearchTerm] = useState('');

// //   // Filter chats based on search term
// //   const filteredChats = searchTerm
// //     ? chats.filter((chat) => {
// //         // For private chats, search in the other user's name
// //         if (chat.type === 'private') {
// //           const otherUser = chat.participants.find(
// //             (p) => p.id !== 'current-user'
// //           );
// //           return otherUser?.name
// //             .toLowerCase()
// //             .includes(searchTerm.toLowerCase());
// //         }
// //         // For group chats, search in the group name
// //         return chat.name?.toLowerCase().includes(searchTerm.toLowerCase());
// //       })
// //     : chats;

// //   // Sort chats by last message timestamp
// //   const sortedChats = [...filteredChats].sort((a, b) => {
// //     const timeA = a.lastMessage?.timestamp.getTime() || 0;
// //     const timeB = b.lastMessage?.timestamp.getTime() || 0;
// //     return timeB - timeA;
// //   });

// //   return (
// //     <div className={cn('flex h-full flex-col', className)}>
// //       <div className="border-b border-gray-200 p-4 dark:border-gray-200">
// //         <div className="mb-3 flex items-center justify-between">
// //           <h2 className="text-xl font-semibold">Messages</h2>
// //           <button
// //             onClick={() =>
// //               toast.success('Hehe boy... User can be added by Crocodilo!!')
// //             }
// //             className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-100"
// //           >
// //             <PiUserPlus className="h-6 w-6" />
// //           </button>
// //         </div>
// //         <Input
// //           placeholder="Search messages..."
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //           prefix={<PiMagnifyingGlassBold className="h-4 w-4 text-gray-500" />}
// //           className="w-full"
// //           inputClassName={cn(
// //             'h-10 pl-10 text-sm transition-colors duration-200',
// //             'bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-500',
// //             'focus:border-0 focus:ring-0 focus:outline-none focus:ring-0',
// //             'dark:bg-gray-100 dark:border-gray-200 dark:text-white '
// //           )}
// //         />
// //       </div>
// //       <div className="flex-1 overflow-y-auto">
// //         {sortedChats.length === 0 ? (
// //           <div className="flex h-full items-center justify-center p-5">
// //             <p className="text-gray-500">No conversations found</p>
// //           </div>
// //         ) : (
// //           <div>
// //             {sortedChats.map((chat) => {
// //               const isActive = chat.id === activeChatId;

// //               // Get chat name and avatar
// //               let name: string;
// //               let avatar: string | undefined;

// //               if (chat.type === 'private') {
// //                 const otherUser = chat.participants.find(
// //                   (u) => u.id !== 'current-user'
// //                 );
// //                 name = otherUser?.name || 'Unknown User';
// //                 avatar = otherUser?.avatar;
// //               } else {
// //                 name = chat.name || 'Group Chat';
// //                 avatar = chat.avatar;
// //               }

// //               // Get last message details
// //               const lastMessage = chat.lastMessage;
// //               const isUnread = chat.unreadCount && chat.unreadCount > 0;
// //               const lastMessageTime = lastMessage?.timestamp
// //                 ? formatDistanceToNow(lastMessage.timestamp, {
// //                     addSuffix: false,
// //                   })
// //                 : '';

// //               // Get last message sender name if it's a group chat
// //               let lastMessageSender = '';
// //               let lastMessageSenderAvatar: string | undefined;
// //               if (chat.type === 'group' && lastMessage) {
// //                 const sender = chat.participants.find(
// //                   (p) => p.id === lastMessage.senderId
// //                 );
// //                 if (lastMessage.senderId === 'current-user') {
// //                   lastMessageSender = 'You: ';
// //                 } else if (sender) {
// //                   lastMessageSender = `${sender.name.split(' ')[0]}: `;
// //                   lastMessageSenderAvatar = sender.avatar;
// //                 }
// //               }

// //               return (
// //                 <div
// //                   key={chat.id}
// //                   onClick={() => onSelectChat(chat.id)}
// //                   className={cn(
// //                     'flex cursor-pointer items-center rounded-l-md border-b border-gray-100 px-4 py-3 dark:border-gray-200',
// //                     isActive && 'bg-mainBlue dark:bg-gray-200',
// //                     isUnread && 'font-medium'
// //                   )}
// //                 >
// //                   <div className="relative mr-3">
// //                     <Avatar
// //                       src={avatar}
// //                       name={name}
// //                       size="lg"
// //                       className="ring-1 ring-white/50"
// //                     />
// //                     {chat.type === 'private' &&
// //                       chat.participants.find((u) => u.id !== 'current-user')
// //                         ?.status === 'online' && (
// //                         <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-white/50"></span>
// //                       )}
// //                   </div>

// //                   <div className="flex flex-1 flex-col overflow-hidden">
// //                     <div className="flex items-center justify-between">
// //                       <h3
// //                         className={cn(
// //                           'truncate text-sm',
// //                           isUnread ? 'font-semibold' : 'font-medium',
// //                           isActive ? 'text-white' : 'text-gray-800'
// //                         )}
// //                       >
// //                         {name}
// //                       </h3>
// //                       <span
// //                         className={cn(
// //                           'ml-2 text-xs',
// //                           isActive ? 'text-white' : 'text-gray-500'
// //                         )}
// //                       >
// //                         {lastMessageTime}
// //                       </span>
// //                     </div>

// //                     <div className="flex items-center">
// //                       {chat.type == 'group' && (
// //                         <Avatar
// //                           src={lastMessageSenderAvatar}
// //                           name={name}
// //                           className="mr-1 h-4 w-4 ring-1 ring-white/50"
// //                           customSize={16}
// //                         />
// //                       )}
// //                       <p
// //                         className={cn(
// //                           'truncate text-xs text-gray-500',
// //                           isUnread &&
// //                             'font-medium text-gray-800 dark:text-gray-500',
// //                           isActive && 'text-white'
// //                         )}
// //                       >
// //                         <span className={cn('font-semibold')}>
// //                           {lastMessageSender}
// //                         </span>

// //                         {lastMessage?.text ||
// //                           (lastMessage?.attachments &&
// //                           lastMessage.attachments.length > 0
// //                             ? `${lastMessage.attachments[0].type === 'image' ? 'Photo' : 'File'} ${lastMessage.attachments.length > 1 ? `(+${lastMessage.attachments.length - 1} more)` : ''}`
// //                             : 'No messages yet')}
// //                       </p>
// //                       {isUnread ? (
// //                         <div
// //                           className={cn(
// //                             'ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-mainBlue text-xs font-medium text-white',
// //                             isActive && 'bg-white text-mainBlue'
// //                           )}
// //                         >
// //                           {chat.unreadCount}
// //                         </div>
// //                       ) : (
// //                         <div className="ml-2 h-5 w-5"></div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// 'use client';

// import React, { useEffect, useRef, useState } from 'react';
// import { Avatar, Empty, EmptyProductBoxIcon, Input, Tab } from 'rizzui';
// import { formatDistanceToNow } from 'date-fns';
// import {
//   PiMagnifyingGlass,
//   PiMagnifyingGlassBold,
//   PiUsers,
//   PiXBold,
// } from 'react-icons/pi';
// import cn from '@core/utils/class-names';
// import toast from 'react-hot-toast';
// import { ChatType, Creater } from '@core/types';
// import ContactSkeleton from './loadings/messages-sidebar-loading';
// import { parseDueAt } from '@core/utils/dd.mm.yy-to-Date';
// import ModalButton from '../modal-button';
// import InfoModal from './info-modal';
// interface ConversationListProps {
//   chats: ChatType[];
//   contacts: (Creater & { chat_id?: number })[]
//   activeChatId: string | number | undefined;
//   onSelectChat: (chatId: string, type?: string) => void;
//   fetchChats: (type: string) => void
//   className?: string;
//   loadingSidebar: boolean;
//   tab: number;
//   setTab: React.Dispatch<React.SetStateAction<number>>
//   handleSendMessageInfo: (user: Creater & { chat_id?: number }) => void;
//   session: {
//     user: {
//       id: string;
//       role?: {
//         id: number;
//         text: string;
//       } | undefined;
//       accessToken?: string | undefined;
//       refreshToken?: string | undefined;
//       accessTokenExpiry?: number | undefined;
//     }
//   } | null
// }

// export default function ConversationList({
//   chats,
//   activeChatId,
//   onSelectChat,
//   className,
//   contacts,
//   fetchChats,
//   loadingSidebar,
//   handleSendMessageInfo,
//   tab,
//   setTab,
//   session
// }: ConversationListProps) {
//   // const [open, setOpen] = useState(false);
//   // const [contactInfomodal, setContactInfomodal] = useState<Creater | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   // const [tab, setTab] = useState(0);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);
//   // const session = useSession().data?.user.
//   // const { closeModal } = useModal()

//   // focus when opened
//   useEffect(() => {
//     if (searchOpen) setTimeout(() => inputRef.current?.focus(), 0);
//   }, [searchOpen]);

//   // Esc to close
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') setSearchOpen(false);
//     };
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, []);

//   // Filter chats based on search term
//   const filteredChats = searchTerm
//     ? chats.filter((chat) => {
//       // For private chats, search in the other user's name
//       if (chat.type === 'private') {
//         const otherUser = chat.other_user
//         return otherUser?.first_name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
//           || otherUser?.last_name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
//       }
//       // For group chats, search in the group name
//       return (chat?.title)?.toLowerCase().includes(searchTerm.toLowerCase())
//         || (chat.other_user?.first_name)?.toLowerCase().includes(searchTerm.toLowerCase());
//     })
//     : chats;
//   const filteredContacts = searchTerm
//     ? contacts.filter((contact) => {
//       return contact?.first_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) || contact?.last_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) || contact?.last_name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
//     })
//     : contacts;

//   const sortedChats = [...filteredChats].sort((a, b) => {
//     const timeA = a.last_message?.created_at ? parseDueAt(a.last_message?.created_at)?.getTime() : 0;
//     const timeB = b.last_message?.created_at ? parseDueAt(b.last_message?.created_at)?.getTime() : 0;
//     return (timeB || 0) - (timeA || 0);
//   });

//   // const handleSendMessage = async (user: Creater & { chat_id?: number }) => {
//   //   if (user) {
//   //     if (chats.find(val => val?.other_user?.id == user?.id)) {
//   //       onSelectChat(user?.chat_id?.toFixed() || '', "private")
//   //     } else {
//   //       try {
//   //         const res = await axiosInstance.post("/v1/chats/private", { otherUserId: user.id })
//   //         onSelectChat(res.data.data.id.toFixed(), "private")
//   //         fetchChats("chats")
//   //       } catch (error) {
//   //         if (isAxiosError(error)) toast.error(error.response?.data.message)
//   //       }
//   //     }
//   //     setTab(0)
//   //     closeModal()
//   //   }
//   // }


//   return (
//     <div className={ cn('flex h-full flex-col', className) }>
//       <div className="relative border-none border-gray-200 px-4 dark:border-gray-200">
//         <div className="flex h-12 items-center justify-between">
//           <h2
//             className={ cn(
//               'text-xl font-semibold transition-all duration-200',
//               searchOpen && 'pointer-events-none -translate-y-1 opacity-0'
//             ) }
//           >
//             Messages
//           </h2>

//           <div className="flex items-center gap-1">
//             <button
//               onClick={ () => setSearchOpen(true) }
//               className="rounded-full p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-600 dark:hover:bg-gray-100"
//               aria-label="Search"
//             >
//               <PiMagnifyingGlass className="h-6 w-6" />
//             </button>

//             {/* Users icon */ }
//             { session?.user.role?.text == "Advisor" &&
//               <button
//                 onClick={ () => toast.success('Hehe boy... User can be added by Crocodilo!!') }
//                 className="rounded-full p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-600 dark:hover:bg-gray-100"
//                 aria-label="Users"
//               >
//                 <PiUsers className="h-6 w-6" />
//               </button>
//             }
//           </div>

//           {/* Overlay search input (slides over title) */ }
//           <div
//             className={ cn(
//               'absolute inset-0 flex items-center px-0 sm:px-2 transition-all duration-300',
//               searchOpen
//                 ? 'pointer-events-auto translate-y-0 opacity-100'
//                 : 'pointer-events-none -translate-y-2 opacity-0'
//             ) }
//           >
//             <Input
//               ref={ inputRef }
//               placeholder="Search messages..."
//               value={ searchTerm }
//               onChange={ (e) => setSearchTerm(e.target.value) }
//               prefix={ <PiMagnifyingGlassBold className="h-4 w-4 text-gray-500" /> }
//               suffix={
//                 <button
//                   type="button"
//                   onClick={ () => {
//                     if (searchTerm) setSearchTerm('');
//                     else setSearchOpen(false);
//                   } }
//                   className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
//                   aria-label="Close search"
//                 >
//                   <PiXBold className="h-4 w-4" />
//                 </button>
//               }
//               className="w-full"
//               inputClassName={ cn(
//                 'h-10 text-sm bg-white dark:bg-gray-100',
//                 'border border-gray-300 dark:border-gray-200 text-gray-700 placeholder-gray-500',
//                 'focus:border-mainBlue focus:ring-0'
//               ) }
//             />
//           </div>
//         </div>
//       </div>

//       <Tab selectedIndex={ tab } onChange={ (key) => setTab(key) }>
//         <Tab.List>
//           <Tab.ListItem>Chats</Tab.ListItem>
//           <Tab.ListItem>Contact</Tab.ListItem>
//         </Tab.List>
//         <Tab.Panels>
//           <Tab.Panel>
//             <div className="custom-scrollbar h-[calc(100vh-280px)] scroll-smooth overflow-y-auto">
//               { loadingSidebar ? <ContactSkeleton type='chat' count={ 12 } />
//                 : chats.length === 0 ? (
//                   <div className="flex h-full flex-col gap-1 items-center justify-center p-5">
//                     <Empty image={ <EmptyProductBoxIcon className='w-32 h-32' /> } />
//                     <p className="text-gray-500">No conversations found</p>
//                   </div>
//                 ) : (
//                   sortedChats.map((chat, i) => {
//                     const fullName = chat.other_user?.first_name + " " + chat.other_user?.last_name
//                     const isActive = (chat.id == activeChatId && +activeChatId) ?? false

//                     // Get chat name and avatar
//                     let name: string;
//                     let avatar: string | undefined;

//                     if (chat.type === 'private') {
//                       name = fullName || 'Unknown User';
//                       avatar = chat.other_user?.avatar?.url;
//                     } else {
//                       name = chat.title || 'Group Chat';
//                       avatar = chat.other_user?.avatar?.url;
//                     }

//                     // Get last message details
//                     const lastMessage = chat.last_message;
//                     const isUnread = chat.has_new;
//                     const lastMessageTime = lastMessage?.created_at
//                       ? formatDistanceToNow(lastMessage?.created_at, {
//                         addSuffix: false,
//                       })
//                       : '';

//                     // Get last message sender name if it's a group chat
//                     let lastMessageSender = '';
//                     let lastMessageSenderAvatar: string | undefined;
//                     if (chat.type === 'group' && lastMessage) {
//                       // const sender = chat.participants.find(
//                       //   (p) => p.id === lastMessage.senderId
//                       // );
//                       if (lastMessage.sent_by_me) {
//                         lastMessageSender = 'You: ';
//                       } else if (lastMessage.sender) {
//                         lastMessageSender = `${lastMessage.sender.first_name[0]} ${lastMessage.sender.last_name[0]}: `;
//                         lastMessageSenderAvatar = lastMessage.sender.avatar.url;
//                       }
//                     }

//                     return (
//                       <div
//                         key={ i }
//                         onClick={ () => onSelectChat(chat.id.toFixed(), chat.type) }
//                         className={ cn(
//                           'flex cursor-pointer items-center rounded-l-md border-b border-gray-100 px-4 py-3 dark:border-gray-200',
//                           isActive && 'bg-mainBlue dark:bg-gray-200',
//                           isUnread && 'font-medium'
//                         ) }
//                       >
//                         <div className="relative mr-3">
//                           <Avatar
//                             src={ avatar }
//                             name={ name }
//                             size="lg"
//                             className="ring-1 ring-white/50"
//                           />
//                           { chat.type === 'private' &&
//                             chat.other_user.online && (
//                               <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-white/50"></span>
//                             ) }
//                         </div>

//                         <div className="flex flex-1 flex-col overflow-hidden">
//                           <div className="flex items-center justify-between gap-1">
//                             <h3
//                               className={ cn(
//                                 'truncate text-sm',
//                                 isUnread ? 'font-semibold' : 'font-medium',
//                                 isActive ? 'text-white' : 'text-gray-800'
//                               ) }
//                             >
//                               { chat.type === 'private' ? fullName : name }
//                             </h3>
//                             <span
//                               className={ cn(
//                                 ' text-xs text-nowrap',
//                                 isActive ? 'text-white' : 'text-gray-500'
//                               ) }
//                             >
//                               { lastMessageTime }
//                             </span>
//                           </div>

//                           <div className="flex items-center">
//                             {/* { chat.type == 'group' && (
//                         <Avatar
//                           src={ lastMessageSenderAvatar }
//                           name={ name }
//                           className="mr-1 h-4 w-4 ring-1 ring-white/50"
//                           customSize={ 16 }
//                         />
//                       ) } */}
//                             <p
//                               className={ cn(
//                                 'truncate text-xs text-gray-500',
//                                 isUnread &&
//                                 'font-medium text-gray-800 dark:text-gray-500',
//                                 isActive && 'text-white'
//                               ) }
//                             >
//                               <span className={ cn('font-semibold') }>
//                                 { lastMessageSender }
//                               </span>

//                               { lastMessage?.body ||
//                                 (lastMessage?.attachment &&
//                                   lastMessage.attachment.length > 0
//                                   ? `${lastMessage.attachment[0].extension === 'png' ? 'Photo' : 'File'} ${lastMessage.attachment.length > 1 ? `(+${lastMessage.attachment.length - 1} more)` : ''}`
//                                   : 'No messages yet') }
//                             </p>
//                             { isUnread ? (
//                               <div
//                                 className={ cn(
//                                   'ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-mainBlue text-xs font-medium text-white',
//                                   isActive && 'bg-white text-mainBlue'
//                                 ) }
//                               >
//                                 { chat.unread_count > 99 ? '99+' : chat.unread_count }
//                               </div>
//                             ) : (
//                               <div className="ml-2 h-5 w-5"></div>
//                             ) }
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })
//                 ) }
//             </div>
//           </Tab.Panel>
//           <Tab.Panel>
//             <div className="custom-scrollbar h-[calc(100vh-280px)] scroll-smooth overflow-y-auto ">
//               { loadingSidebar ? <ContactSkeleton type='contact' /> :
//                 filteredContacts.length === 0 ? (
//                   <div className="flex h-full flex-col gap-1 items-center justify-center p-5">
//                     <Empty image={ <EmptyProductBoxIcon className='w-32 h-32' /> } />
//                     <p className="text-gray-500">No Contacts found</p>
//                   </div>
//                 ) : (
//                   filteredContacts?.map((contact, i) => {
//                     const fullName = contact?.first_name + " " + contact?.last_name
//                     return (
//                       <ModalButton
//                         key={ i + contact.id }
//                         label=''
//                         icon=''
//                         className='bg-transparent hover:bg-transparent w-full flex justify-normal h-auto cursor-pointer items-center rounded-l-md m-0 py-0 px-0 ring-0 hover:bg-slate-100 max-[600px]:bg-transparent '
//                         view={
//                           <InfoModal user={ contact } onSendMessage={ handleSendMessageInfo } />
//                         }
//                       >
//                         <div
//                           key={ contact.id }
//                           // onClick={ () => setContactInfomodal(contact) }
//                           className={ cn('flex cursor-pointer items-center rounded-l-md border-b border-gray-100 px-4 py-3 dark:border-gray-200 w-full') }
//                         >
//                           <div className="relative mr-3">
//                             <Avatar
//                               src={ contact.avatar?.url }
//                               name={ fullName }
//                               size="lg"
//                               className="ring-1 ring-white/50"
//                             />
//                             { contact.online && (
//                               <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-white/50"></span>
//                             ) }
//                           </div>

//                           <div className="flex flex-1 flex-col overflow-hidden">
//                             <div className="flex items-center justify-between gap-1">
//                               <h3
//                                 className={ cn('truncate text-sm font-medium ') }
//                               >
//                                 { fullName }
//                               </h3>
//                             </div>

//                             <div className="flex items-center">
//                               <p
//                                 className={ cn(
//                                   'truncate text-xs text-gray-500',
//                                 ) }
//                               >
//                                 <span className={ cn('font-semibold') }>
//                                   { "@" + contact.username }
//                                 </span>
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </ModalButton>

//                     );
//                   })
//                 ) }
//             </div>
//           </Tab.Panel>
//         </Tab.Panels>
//       </Tab>



//     </div>
//   );
// }

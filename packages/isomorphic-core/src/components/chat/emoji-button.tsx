// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import EmojiPicker, { Theme as EmojiPickerTheme } from 'emoji-picker-react';
// import { ActionIcon } from 'rizzui';
// import { PiSmiley, PiSmileyBold } from 'react-icons/pi';
// import { useTheme } from 'next-themes';
// export default function EmojiButton() {
//   const [showPicker, setShowPicker] = useState(false);
//   const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
//   const pickerRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const { theme } = useTheme();

//   const handleEmojiClick = (emojiData: any) => {
//     setSelectedEmoji(emojiData.emoji);
//     setShowPicker(false);
//   };

//   // Close emoji picker when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         pickerRef.current &&
//         !pickerRef.current.contains(event.target as Node) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(event.target as Node)
//       ) {
//         setShowPicker(false);
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="relative inline-block">
//       <ActionIcon
//         ref={buttonRef}
//         onClick={() => setShowPicker(!showPicker)}
//         variant="text"
//         size="sm"
//         className="h-9 w-9 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//       >
//         <PiSmileyBold className="h-5 w-5" />
//       </ActionIcon>

//       {showPicker && (
//         <div ref={pickerRef} className="absolute bottom-full right-0 z-50 mb-2">
//           <EmojiPicker
//             height={400}
//             width={450}
//             lazyLoadEmojis={true}
//             onEmojiClick={handleEmojiClick}

//             theme={theme === 'dark' ? ('dark' as EmojiPickerTheme) : ('light' as EmojiPickerTheme)}
//             autoFocusSearch={false}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useRef, useEffect } from 'react';
import EmojiPicker, { Theme as EmojiPickerTheme, EmojiClickData } from 'emoji-picker-react';
import { ActionIcon } from 'rizzui';
import { PiSmileyBold } from 'react-icons/pi';
import { useTheme } from 'next-themes';

type EmojiButtonProps = {
  onPick?: (emoji: string) => void; // <- send value to parent
};

export default function EmojiButton({ onPick }: EmojiButtonProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const value = emojiData.emoji;            // <- the emoji string
    setSelectedEmoji(value);                  // keep locally if you need it
    onPick?.(value);
    setShowPicker(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      <ActionIcon
        ref={ buttonRef }
        onClick={ () => setShowPicker(v => !v) }
        variant="text"
        size="sm"
        className="h-9 w-9 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <PiSmileyBold className="h-5 w-5" />
      </ActionIcon>

      { showPicker && (
        <div ref={ pickerRef } className="absolute bottom-full left-0 z-50 mb-2">
          <EmojiPicker
            height={ 400 }
            width={ 450 }
            lazyLoadEmojis
            className='max-[540px]:max-w-[350px]'
            onEmojiClick={ handleEmojiClick }
            theme={ theme === 'dark' ? ('dark' as EmojiPickerTheme) : ('light' as EmojiPickerTheme) }
            autoFocusSearch={ false }
          />
        </div>
      ) }
    </div>
  );
}

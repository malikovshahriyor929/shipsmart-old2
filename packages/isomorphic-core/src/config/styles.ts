const tabItemClassName =
  "relative flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium outline-none transition-all duration-200";

const tabItemColor =
  "bg-primary/10 text-primary hover:bg-primary/15 dark:bg-gray-200/70 dark:text-gray-700 dark:hover:bg-gray-200";

const selectedTabClasses =
  "data-[headlessui-state~=selected]:bg-mainBlue/90 data-[headlessui-state~=selected]:text-white data-[headlessui-state~=selected]:before:hidden dark:data-[headlessui-state~=selected]:bg-gray-700 dark:data-[headlessui-state~=selected]:text-gray-100";

export { tabItemClassName, tabItemColor, selectedTabClasses };

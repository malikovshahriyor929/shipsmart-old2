import { useState } from "react";

export function useSidebarState(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen,
    toggleSidebar,
  };
}

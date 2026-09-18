"use client";

import { atom, useAtomValue, useSetAtom } from "jotai";

export type DrawerPlacements = "left" | "right" | "top" | "bottom";

type DrawerTypes = {
  view: React.ReactNode;
  isOpen: boolean;
  placement?: DrawerPlacements;
  containerClassName?: string;
  withIcon?: boolean;
};

const drawerAtom = atom<DrawerTypes>({
  isOpen: false,
  view: null,
  placement: "right",
  containerClassName: "",
  withIcon: false,
});

export function useDrawer() {
  const state = useAtomValue(drawerAtom);
  const setState = useSetAtom(drawerAtom);

  const openDrawer = ({
    view,
    placement,
    containerClassName,
    withIcon,
  }: {
    view: React.ReactNode;
    placement: DrawerPlacements;
    containerClassName?: string;
    withIcon?: boolean;
  }) => {
    setState({
      ...state,
      isOpen: true,
      view,
      placement,
      containerClassName,
      withIcon,
    });
  };

  const closeDrawer = () => {
    setState({
      ...state,
      isOpen: false,
    });
  };

  return {
    ...state,
    openDrawer,
    closeDrawer,
  };
}

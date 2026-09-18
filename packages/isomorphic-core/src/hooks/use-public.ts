'use client';

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

// global atom for "is this public landing context?"
const isPublicAtom = atom<boolean>(false);

export function usePublic() {
  const [isPublic, setIsPublic] = useAtom(isPublicAtom);

  return {
    isPublic,
    setIsPublic,
  };
}

export function useIsPublic() {
  return useAtomValue(isPublicAtom);
}

export function useSetIsPublic() {
  return useSetAtom(isPublicAtom);
}

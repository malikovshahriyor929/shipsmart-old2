'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export type StaffRoleKey = 'advisor' | 'teacher' | 'counselor';
export type StaffMode = 'create' | 'edit';

export const ROLE_CODE: Record<StaffRoleKey, number> = {
  advisor: 3,
  teacher: 4, 
  counselor: 6,
};

export const ROLE_KEY_BY_CODE: Record<number, StaffRoleKey> = {
  3: 'advisor',
  4: 'teacher', 
  6: 'counselor',
};

export const API_ROLE_SEGMENT: Record<
  StaffRoleKey,
  'advisors' | 'teachers' | 'counselors'
> = {
  advisor: 'advisors',
  teacher: 'teachers',
  counselor: 'counselors',
};

type Ctx = {
  role: StaffRoleKey;
  setRole: React.Dispatch<React.SetStateAction<StaffRoleKey>>;

  mode: StaffMode;
  setMode: React.Dispatch<React.SetStateAction<StaffMode>>;

  editingId: number | null;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
};

const UsersRoleContext = createContext<Ctx | null>(null);

export function UsersRoleProvider({
  defaultRole = 'advisor',
  defaultMode = 'create',
  children,
}: {
  defaultRole?: StaffRoleKey;
  defaultMode?: StaffMode;
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<StaffRoleKey>(defaultRole);
  const [mode, setMode] = useState<StaffMode>(defaultMode);
  const [editingId, setEditingId] = useState<number | null>(null);

  const value = useMemo(
    () => ({ role, setRole, mode, setMode, editingId, setEditingId }),
    [role, mode, editingId]
  );

  return (
    <UsersRoleContext.Provider value={value}>
      {children}
    </UsersRoleContext.Provider>
  );
}

export function useUsersRole() {
  const ctx = useContext(UsersRoleContext);
  if (!ctx)
    throw new Error('useUsersRole must be used inside UsersRoleProvider');
  return ctx;
}

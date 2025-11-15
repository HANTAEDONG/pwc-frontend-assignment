"use client";

import { create } from "zustand";

export type UiDialogType =
  | "none"
  | "deleteFavorite"
  | "deleteFavoriteConfirm"
  | "favoriteDetail"
  | "favoriteForm"
  | "logout"
  | "globalError";

export interface UiDialogPayload {
  targetId?: string;
  title?: string;
  message?: string;
  count?: number;
  favoriteId?: number | null;
  editingId?: string;
  initialCompanyName?: string;
  onConfirm?: () => void | Promise<void>;
  onSuccess?: () => void;
}

interface UiDialogState {
  activeDialog: UiDialogType;
  dialogPayload: UiDialogPayload | null;
  openDialog: (type: UiDialogType, payload?: UiDialogPayload) => void;
  closeDialog: () => void;
}

export const useUiDialogStore = create<UiDialogState>((set) => ({
  activeDialog: "none",
  dialogPayload: null,

  openDialog: (type, payload) => {
    set({
      activeDialog: type,
      dialogPayload: payload ?? null,
    });
  },

  closeDialog: () => {
    set({
      activeDialog: "none",
      dialogPayload: null,
    });
  },
}));

export const useUiDialog = () =>
  useUiDialogStore((state) => ({
    activeDialog: state.activeDialog,
    dialogPayload: state.dialogPayload,
    openDialog: state.openDialog,
    closeDialog: state.closeDialog,
  }));

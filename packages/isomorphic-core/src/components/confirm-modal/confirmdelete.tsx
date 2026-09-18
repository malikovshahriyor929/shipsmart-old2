"use client";

import { useState } from "react";
import { Button, Modal, Text } from "rizzui";
import { PiTrash } from "react-icons/pi";
import { t } from "i18next";

type ConfirmDeleteButtonProps = {
  onConfirm: () => Promise<void> | void;
  size?: "sm" | "md" | "lg";
};

export default function ConfirmDeleteButton({ onConfirm, size = "sm" }: ConfirmDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    try {
      setBusy(true);
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button
        size={ size }
        variant="outline"
        className="bg-red/10 border-red/40 text-red hover:bg-red/20  py-4 hover:border-red/40 hover:text-red"
        onClick={ (e) => {
          e.stopPropagation();
          setOpen(true);
        } }
      >
        <PiTrash className="h-4 w-4" />
      </Button>

      <Modal isOpen={ open } onClose={ () => (!busy && setOpen(false)) } size="lg">
        <div className="w-full max-w-xl min-w-[350px] rounded-2xl bg-white dark:bg-gray-800 p-6 space-y-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center flex-col  gap-3">
              <div className="flex items-center gap-2 bg-red-500 rounded-lg p-2">
                <PiTrash className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-mainBlue">  { t("commons.confirm-delete-title") }</h3>
            </div>
            <Text className=" text-center text-gray-600">
              { t("commons.confirm-delete-desc") }
            </Text>
          </div>
          <div className="mt-10  flex justify-end gap-4">
            <Button variant="outline" onClick={ () => setOpen(false) } disabled={ busy }>
              { t("commons.cancel") }
            </Button>
            <Button onClick={ handleConfirm } isLoading={ busy } className="bg-red-600 text-white hover:bg-red-700">
              { t("commons.delete") }
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

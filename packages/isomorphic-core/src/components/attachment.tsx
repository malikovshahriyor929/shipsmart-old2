import { ChangeEvent, useCallback, useRef, useState } from "react";
import { Attachment } from "@core/types";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { PiPaperclip, PiX, PiXBold } from "react-icons/pi";
import { Button, Modal, Tooltip } from "rizzui";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTranslations } from "next-intl";

type AttachmentFieldProps = {
  attachmentPath: string;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  onPickFile: (e: ChangeEvent<HTMLInputElement>) => any;
};

export const AttachmentField = ({
  attachmentPath,
  setValue,
  watch,
  onPickFile,
}: AttachmentFieldProps) => {
  const t = useTranslations();
  const attachment: Attachment | any = watch(attachmentPath as any) || {};
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoModal, setPhotoModal] = useState<{
    open: boolean;
    items: Attachment[];
    index: number;
  }>({ open: false, items: [], index: 0 });
  const openPhotoAt = (items: Attachment[], index: number) =>
    setPhotoModal({ open: true, items, index });
  const closePhoto = useCallback(
    () => setPhotoModal((s) => ({ ...s, open: false })),
    []
  );
  const nextPhoto = useCallback(
    () =>
      setPhotoModal((s) => ({ ...s, index: (s.index + 1) % s.items.length })),
    []
  );
  const prevPhoto = useCallback(
    () =>
      setPhotoModal((s) => ({
        ...s,
        index: (s.index - 1 + s.items.length) % s.items.length,
      })),
    []
  );

  const openPicker = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const removeAttachment = () => {
    setValue(
      attachmentPath as any,
      {},
      { shouldDirty: true, shouldValidate: true }
    );
  };

  return (
    <div className="flex items-center gap-2">
      <input
        id={`attachment-${attachmentPath}`}
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPickFile}
      />
      {attachment?.public_id ? (
        <Tooltip content={attachment?.file_name || (t("commons.attachment") ?? "Attachment")}>
          <div className="group relative">
            {attachment?.url ? (
              <img
                src={attachment.url}
                onClick={() => openPhotoAt([attachment], 0)}
                alt={attachment.file_name || (t("commons.attachment") ?? "Attachment")}
                className="h-10 w-10 min-w-10 rounded border border-gray-200 object-cover"
              />
            ) : (
              <div className="grid h-12 w-12 place-items-center rounded border border-gray-200 text-[10px]">
                {attachment?.public_id?.slice(0, 4) || "FILE"}
              </div>
            )}
            <button
              type="button"
              onClick={removeAttachment}
              className="absolute -right-2 -top-2 hidden rounded-full bg-red-500 px-1 py-1 text-[10px] text-white group-hover:block"
              aria-label={t("commons.remove") ?? "Remove"}
            >
              <PiXBold className="h-3 w-3" />
            </button>
          </div>
        </Tooltip>
      ) : (
        <Button
          onClick={openPicker}
          variant="outline"
          className="px-3 max-[420px]:text-sm max-[420px]:px-2 max-[420px]:!py-1"
          disabled={isUploading}
        >
          <PiPaperclip className="h-4 w-4" />
        </Button>
      )}

      <Modal
        isOpen={photoModal.open}
        onClose={closePhoto}
        size="full"
        containerClassName="bg-transparent backdrop-blur"
        overlayClassName="backdrop-blur"
      >
        {photoModal.items.length > 0 && (
          <div className="w-screen h-screen backdrop-blur bg-transparent relative ">
            <div
              className="fixed top-3 right-3 z-50  hover:bg-gray-400 duration-300 rounded-lg "
              onClick={closePhoto}
            >
              <PiX className="size-10 text-white" />
            </div>

            <div
              className="relative z-30 h-[100vh] flex items-center justify-center "
              onClick={closePhoto}
            >
              <img
                src={
                  photoModal.items[photoModal.index]?.url ??
                  "/chatPhotodefualt.webp"
                }
                alt={photoModal.items[photoModal.index]?.file_name || (t("commons.image") ?? "Image")}
                className="mx-auto h-auto max-h-[60vh] w-full max-w-[60vw] rounded-xl object-cover"
              />
            </div>

            {photoModal.items.length > 1 && (
              <div className="px-10 fixed top-1/2 z-40 left-0 w-full  flex items-center justify-between">
                <div
                  className="  hover:bg-gray-400 duration-300  rounded-full "
                  onClick={prevPhoto}
                >
                  <FiChevronLeft className="text-white size-10 -translate-x-0.5" />
                </div>
                <div
                  className="  hover:bg-gray-400 duration-300 rounded-full "
                  onClick={nextPhoto}
                >
                  <FiChevronRight className="text-white size-10 translate-x-0.5" />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

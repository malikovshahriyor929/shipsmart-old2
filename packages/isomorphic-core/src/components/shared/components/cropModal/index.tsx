"use client";

import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Button } from "rizzui/button";
import { Modal } from "rizzui/modal";

type Props = {
  open: boolean;
  /** File (inputdan kelgan) yoki string (dataURL/URL) */
  source: File | string | null;
  onClose: () => void;
  /** Croplangan natijani File ko'rinishida qaytaradi */
  onSave: (file: File, previewUrl: string) => void;
  /** Ixtiyoriy sozlamalar */
  aspect?: number;        // default 3/4
  filename?: string;      // natija nomi (default: source nomidan)
  quality?: number;
  loadingForCrop?: boolean     // 0..1 (default 0.92)
};

export default function CropModal({
  open,
  source,
  onClose,
  onSave,
  aspect = 3 / 4,
  filename,
  quality = 0.92,
  loadingForCrop
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // File bo'lsa objectURL yasab Cropper'ga beramiz
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!source) {
      setImageUrl(null);
      return;
    }
    if (typeof source === "string") {
      setImageUrl(source);
      return;
    }
    const url = URL.createObjectURL(source);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [source]);

  const onCropComplete = useCallback((_: any, areaPixels: any) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const getCroppedImg = async () => {
    if (!imageUrl || !croppedAreaPixels) return;

    const img = new Image();
    img.src = imageUrl;

    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retina (DPR) uchun ixtiyoriy sifat yaxshilash
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(croppedAreaPixels.width * dpr);
    canvas.height = Math.round(croppedAreaPixels.height * dpr);
    ctx.scale(dpr, dpr);

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const finalName =
      filename ||
      (typeof source === "object" && source
        ? (source.name.replace(/\.[^/.]+$/, "") || "image") + "_cropped.jpg"
        : "cropped.jpg");

    // toBlob ba'zi brauzerlarda null qaytarmasligi uchun callback ichida davom etamiz
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          // Fallback: dataURL -> Blob
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          const arr = dataUrl.split(",");
          const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) u8arr[n] = bstr.charCodeAt(n);
          blob = new Blob([u8arr], { type: mime });
        }

        const file = new File([blob], finalName, { type: "image/jpeg" });
        const previewUrl = URL.createObjectURL(blob);
        onSave(file, previewUrl);
      },
      "image/jpeg",
      quality
    );
  };

  return (
    <Modal isOpen={ open } onClose={ onClose } className="w-full">
      <div className="p-4">
        <div className="mb-3">
          <p className="text-lg font-semibold">Crop your photo</p>
        </div>
        <div className="relative w-[400px] max-[450px]:w-[300px] max-[380px]:w-[270px] h-[400px] bg-white rounded-lg">
          { imageUrl && (
            <Cropper
              image={ imageUrl }
              crop={ crop }
              zoom={ zoom }
              aspect={ aspect }
              style={ {
                mediaStyle: { borderRadius: "10px" },
                containerStyle: { opacity: 1, backdropFilter: "none" },
              } }
              onCropChange={ setCrop }
              onZoomChange={ setZoom }
              onCropComplete={ onCropComplete }
            />
          ) }
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={ onClose }>
            Cancel
          </Button>
          <Button onClick={ getCroppedImg } disabled={ loadingForCrop }>{ loadingForCrop ? "Saveing..." : "Save" }</Button>
        </div>
      </div>
    </Modal>
  );
}

import {
  generateUploadButton,
  generateUploadDropzone,
  generateUploader,
  generateReactHelpers,
} from "@uploadthing/react";
import type { OurFileRouter } from "../../../../apps/admin/src/app/api/uploadthing/core";

export const Uploader: ReturnType<typeof generateUploader> =
  generateUploader<OurFileRouter>();
export const UploadButton: ReturnType<typeof generateUploadButton> =
  generateUploadButton<OurFileRouter>();
export const UploadDropzone: ReturnType<typeof generateUploadDropzone> =
  generateUploadDropzone<OurFileRouter>();
const uploadthingHelpers: ReturnType<
  typeof generateReactHelpers<OurFileRouter>
> = generateReactHelpers<OurFileRouter>();
export const useUploadThing: typeof uploadthingHelpers.useUploadThing =
  uploadthingHelpers.useUploadThing;
export const uploadFiles: typeof uploadthingHelpers.uploadFiles =
  uploadthingHelpers.uploadFiles;

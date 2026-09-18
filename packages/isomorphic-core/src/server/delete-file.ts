'use server';

import { utapi } from '@core/server/uploadthing';

export const deleteFiles = async (fileKey?: string) => {
  if (fileKey) {
    await utapi.deleteFiles(fileKey);
  }
  return;
};

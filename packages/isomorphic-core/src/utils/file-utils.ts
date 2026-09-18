import {
  PiFile as PiFileIcon,
  PiFileText,
  PiFilePdf,
  PiFileImage,
  PiFileVideo,
  PiFileAudio,
  PiFileArchive,
  PiFileCode,
} from 'react-icons/pi';

/* ---------- your existing helpers (kept) ---------- */
export function isImageExt(ext?: string) {
  if (!ext) return false;
  const e = ext.toLowerCase();
  return ['png','jpg','jpeg','gif','webp','avif','bmp','tiff','svg'].includes(e);
}
export function isVideoExt(ext?: string) {
  const e = String(ext || '').toLowerCase();
  return ['mp4','mov','m4v','webm','mkv','avi'].includes(e);
}
export function getExtFromNameOrUrl(nameOrUrl?: string): string {
  if (!nameOrUrl) return '';
  const clean = nameOrUrl.split(/[?#]/)[0];
  const last = clean.split('/').pop() || '';
  const m = last.match(/\.([A-Za-z0-9]+)$/);
  return (m?.[1] || '').toLowerCase();
}

export type FileKind =
  | 'image' | 'video' | 'audio'
  | 'pdf' | 'doc' | 'xls' | 'ppt' | 'txt' | 'csv'
  | 'archive' | 'code' | 'other';

export function kindByExt(ext?: string): FileKind {
  const e = (ext || '').toLowerCase();
  if (!e) return 'other';
  if (isImageExt(e)) return 'image';
  if (isVideoExt(e)) return 'video';
  if (['mp3','wav','aac','flac','ogg','m4a'].includes(e)) return 'audio';
  if (e === 'pdf') return 'pdf';
  if (['doc','docx','rtf','odt','pages'].includes(e)) return 'doc';
  if (['xls','xlsx','ods','xlsm'].includes(e)) return 'xls';
  if (['ppt','pptx','key','odp'].includes(e)) return 'ppt';
  if (['txt','log','md'].includes(e)) return 'txt';
  if (['csv','tsv'].includes(e)) return 'csv';
  if (['zip','rar','7z','tar','gz','bz2'].includes(e)) return 'archive';
  if (['js','ts','tsx','json','html','css','scss','py','java','c','cpp','cs','rb','php','go','rs','sh','yml','yaml'].includes(e)) return 'code';
  return 'other';
}

/* ---------- icon picker (by extension) ---------- */
export function getFileIconByExt(
  ext?: string,
  size?: number
): { Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; className: string; label: string } {
  const kind = kindByExt(ext);

  switch (kind) {
    case 'pdf':   return { Icon: PiFilePdf,   className: 'text-red-600',     label: 'PDF'  };
    case 'image': return { Icon: PiFileImage, className: 'text-purple-600',  label: 'IMG'  };
    case 'video': return { Icon: PiFileVideo, className: 'text-fuchsia-600', label: 'VID'  };
    case 'audio': return { Icon: PiFileAudio, className: 'text-indigo-600',  label: 'AUD'  };
    case 'archive': return { Icon: PiFileArchive, className: 'text-yellow-700', label: 'ZIP' };
    case 'code':  return { Icon: PiFileCode,  className: 'text-slate-700',   label: 'CODE' };
    // fallbacks for office/text-like
    case 'doc':   return { Icon: PiFileText,  className: 'text-blue-600',    label: 'DOC'  };
    case 'xls':   return { Icon: PiFileText,  className: 'text-green-600',   label: 'XLS'  };
    case 'ppt':   return { Icon: PiFileText,  className: 'text-orange-600',  label: 'PPT'  };
    case 'csv':   return { Icon: PiFileText,  className: 'text-emerald-700', label: 'CSV'  };
    case 'txt':   return { Icon: PiFileText,  className: 'text-gray-600',    label: 'TXT'  };
    default:      return { Icon: PiFileIcon,  className: 'text-gray-600',    label: 'FILE' };
  }
}

// export function FileIcon({
//   nameOrUrl,
//   ext,
//   size = 18,
//   showLabel = false,
//   className = '',
// }: {
//   nameOrUrl?: string;
//   ext?: string;
//   size?: number;
//   showLabel?: boolean;
//   className?: string;
// }) {
//   const e = (ext && ext.trim()) || getExtFromNameOrUrl(nameOrUrl);
//   const { Icon, className: colorClass, label } = getFileIconByExt(e);
//   return (
//     <span className={ `inline-flex items-center gap-1 ${className}` }>
//       <Icon className={ colorClass + " size-6" } />
//       { showLabel && <span className="text-[10px] font-medium">{ label }</span> }
//     </span>
//   );
// }
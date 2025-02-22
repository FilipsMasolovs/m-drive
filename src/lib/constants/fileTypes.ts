export const FileTypes = {
  FOLDER: 'folder',
  IMAGE: 'image',
  PDF: 'pdf',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCX: 'docx',
  TXT: 'text/plain',
  APPLICATION: 'application',
} as const

export const MimeTypeMap = {
  'image/jpeg': FileTypes.IMAGE,
  'image/png': FileTypes.IMAGE,
  'image/gif': FileTypes.IMAGE,
  'image/webp': FileTypes.IMAGE,
  'video/mp4': FileTypes.VIDEO,
  'video/webm': FileTypes.VIDEO,
  'video/ogg': FileTypes.VIDEO,
  'audio/mpeg': FileTypes.AUDIO,
  'audio/wav': FileTypes.AUDIO,
  'audio/ogg': FileTypes.AUDIO,
  'application/pdf': FileTypes.PDF,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileTypes.DOCX,
  'text/plain': FileTypes.TXT,
} as const

export const FileIconColors = {
  [FileTypes.FOLDER]: 'text-gray-400',
  [FileTypes.DOCX]: 'text-blue-400',
  [FileTypes.IMAGE]: 'text-yellow-400',
  [FileTypes.AUDIO]: 'text-purple-400',
  [FileTypes.VIDEO]: 'text-red-400',
  [FileTypes.PDF]: 'text-orange-400',
  DEFAULT: 'text-gray-400',
} as const

export type FileType = (typeof FileTypes)[keyof typeof FileTypes]

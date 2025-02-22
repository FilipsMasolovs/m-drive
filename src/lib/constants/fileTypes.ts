export const FileTypes = {
	FOLDER: 'folder',
	IMAGE: 'image',
	PDF: 'pdf',
	VIDEO: 'video',
	AUDIO: 'audio',
	TXT: 'text/plain',
	SPREADSHEET: 'spreadsheet',
	DOCUMENT: 'document',
	APPLICATION: 'application',
	JSON: 'application/json',
	MARKDOWN: 'text/markdown',
} as const

export const FileExtensions = {
	JSON: ['.json'],
	MARKDOWN: ['.md', '.markdown'],
} as const

export const FileIconColors = {
	[FileTypes.FOLDER]: 'text-gray-400',
	[FileTypes.TXT]: 'text-blue-400',
	[FileTypes.IMAGE]: 'text-yellow-400',
	[FileTypes.AUDIO]: 'text-purple-400',
	[FileTypes.VIDEO]: 'text-red-400',
	[FileTypes.PDF]: 'text-orange-400',
	[FileTypes.SPREADSHEET]: 'text-green-400',
	DEFAULT: 'text-gray-400',
} as const

export type FileType = (typeof FileTypes)[keyof typeof FileTypes]

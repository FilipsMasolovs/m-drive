import { FileExtensions, FileTypes, type FileType } from '~/lib/constants/fileTypes'
import { type FileItem } from '~/types/drive'

export function getPreviewType(file: FileItem): FileType {
	const fileType = file.type.toLowerCase()
	const fileName = file.name.toLowerCase()

	if (fileType.includes('image')) {
		return FileTypes.IMAGE
	} else if (fileType.includes('pdf')) {
		return FileTypes.PDF
	} else if (fileType.includes('video')) {
		return FileTypes.VIDEO
	} else if (fileType.includes('text/plain')) {
		return FileTypes.TXT
	} else if (fileType.includes('audio')) {
		return FileTypes.AUDIO
	} else if (fileType.endsWith('.document')) {
		return FileTypes.DOCUMENT
	} else if (fileType.endsWith('sheet')) {
		return FileTypes.SPREADSHEET
	} else if (FileExtensions.JSON.some((ext) => fileName.endsWith(ext))) {
		return FileTypes.JSON
	} else if (FileExtensions.MARKDOWN.some((ext) => fileName.endsWith(ext))) {
		return FileTypes.MARKDOWN
	} else if (fileType.includes('application')) {
		return FileTypes.APPLICATION
	}

	return FileTypes.APPLICATION
}

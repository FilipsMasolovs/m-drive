export const FOLDER_VALIDATION = {
	NAME: {
		MAX_LENGTH: 255,
		PATTERN: /^[^<>:"/\\|?*\x00-\x1F]*$/,
		ERROR_MESSAGES: {
			EMPTY: 'Folder name cannot be empty',
			TOO_LONG: 'Folder name is too long (max 255 characters)',
			INVALID_CHARS: 'Folder name contains invalid characters',
			DUPLICATE: 'A folder with this name already exists',
		},
	},
} as const

export const FILE_VALIDATION = {
	UPLOAD: {
		MAX_SIZE: 134217728,
		MAX_FILES: 100,
		ERROR_MESSAGES: {
			TOO_LARGE: 'File size exceeds 128MB limit',
			TOO_MANY: 'Cannot upload more than 100 files at once',
		},
	},
	NAME: {
		MAX_LENGTH: 255,
		PATTERN: /^[^<>:"/\\|?*\x00-\x1F]*$/,
		ERROR_MESSAGES: {
			EMPTY: 'File name cannot be empty',
			TOO_LONG: 'File name is too long (max 255 characters)',
			INVALID_CHARS: 'File name contains invalid characters',
		},
	},
} as const

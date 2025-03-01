import { auth } from '@clerk/nextjs/server'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { z } from 'zod'
import { FILE_VALIDATION } from '~/lib/constants/validation'
import { MUTATIONS, QUERIES } from '~/server/db/queries'

const f = createUploadthing()

export const ourFileRouter = {
	driveUploader: f({
		blob: {
			maxFileSize: '128MB',
			maxFileCount: FILE_VALIDATION.UPLOAD.MAX_FILES,
		},
	})
		.input(
			z.object({
				folderId: z.number(),
			}),
		)
		.middleware(async ({ input }) => {
			const user = await auth()

			// eslint-disable-next-line @typescript-eslint/only-throw-error
			if (!user.userId) throw new UploadThingError('Unauthorized')

			const folder = await QUERIES.getFolderById(input.folderId)

			// eslint-disable-next-line @typescript-eslint/only-throw-error
			if (!folder) throw new UploadThingError('Folder not found')

			// eslint-disable-next-line @typescript-eslint/only-throw-error
			if (folder.ownerId !== user.userId) throw new UploadThingError('Unauthorized')

			return { userId: user.userId, parentId: input.folderId }
		})
		.onUploadComplete(async ({ metadata, file }) => {
			await MUTATIONS.createFile({
				file: {
					name: file.name,
					type: file.type,
					url: file.ufsUrl,
					parent: metadata.parentId,
					size: file.size,
				},
				userId: metadata.userId,
			})

			return { uploadedBy: metadata.userId }
		}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

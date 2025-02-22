import { create } from 'zustand'
import type { FileItem } from '~/types/drive'

interface PreloadedFile {
  name: string
  originalUrl: string
}

interface FileStore {
  blobUrls: Record<number, string>
  preloadedFiles: Record<number, PreloadedFile>
  setBlobUrl: (fileId: number, url: string) => void
  clearBlobUrls: () => void
  setPreloadedFiles: (files: Record<number, PreloadedFile>) => void
  preloadFiles: (files: FileItem[]) => Promise<void>
}

export const useFileStore = create<FileStore>((set, get) => ({
  blobUrls: {},
  preloadedFiles: {},
  setBlobUrl: (fileId, url) =>
    set((state) => ({
      blobUrls: { ...state.blobUrls, [fileId]: url },
    })),
  clearBlobUrls: () => {
    Object.values(get().blobUrls).forEach((url) => {
      URL.revokeObjectURL(url)
    })
    set({ blobUrls: {} })
  },
  setPreloadedFiles: (files) => set({ preloadedFiles: files }),
  preloadFiles: async (files) => {
    const fileItems = files.filter((file) => file.url !== '')
    const { preloadedFiles, setBlobUrl, setPreloadedFiles } = get()
    await Promise.all(
      fileItems.map(async (file) => {
        try {
          if (!preloadedFiles[file.id] || preloadedFiles[file.id]!.originalUrl !== file.url) {
            const res = await fetch(file.url)
            if (res.ok) {
              const blob = await res.blob()
              const blobUrl = URL.createObjectURL(blob)
              setBlobUrl(file.id, blobUrl)
              setPreloadedFiles({
                ...preloadedFiles,
                [file.id]: {
                  name: file.name,
                  originalUrl: file.url,
                },
              })
            } else {
              console.warn(`Failed to preload file ${file.name}`)
            }
          }
        } catch (error) {
          console.error('Error preloading file', file.name, error)
        }
      }),
    )
  },
}))

import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { create } from 'zustand'
import { handleDeleteItem } from '~/lib/utils/handleDeleteItem'
import type { FileItem, DriveItem } from '~/types/types'

interface ModalState {
  open: boolean
  id: number
  type: string
  realType: string
  size: number
  url: string
  uploadThingUrl: string
  name: string
}

interface RenameModalState {
  open: boolean
  itemId: number
  currentName: string
}

interface DriveStore {
  modal: ModalState
  setModal: (modal: ModalState) => void
  renameModal: RenameModalState | null
  setRenameModal: (modal: RenameModalState | null) => void
  isDeleting: boolean
  setIsDeleting: (isDeleting: boolean) => void
  blobUrls: Record<number, string>
  setBlobUrl: (fileId: number, url: string) => void
  clearBlobUrls: () => void
  preloadedFiles: Record<number, { name: string; originalUrl: string }>
  setPreloadedFiles: (files: Record<number, { name: string; originalUrl: string }>) => void

  // Actions
  handleItemClick: (item: DriveItem, getPreviewType: (file: FileItem) => string) => void
  handleRenameClick: (item: DriveItem) => void
  handleModalClose: (open: boolean) => void
  handleRename: () => void
  handleDelete: (items: DriveItem[], router: AppRouterInstance, itemId?: number) => Promise<void>
  preloadFiles: (files: FileItem[]) => Promise<void>
}

const initialModalState: ModalState = {
  open: false,
  id: 0,
  type: '',
  realType: '',
  size: 0,
  url: '',
  uploadThingUrl: '',
  name: '',
}

export const useDriveStore = create<DriveStore>((set, get) => ({
  modal: initialModalState,
  setModal: (modal) => set({ modal }),
  renameModal: null,
  setRenameModal: (modal) => set({ renameModal: modal }),
  isDeleting: false,
  setIsDeleting: (isDeleting) => set({ isDeleting }),
  blobUrls: {},
  setBlobUrl: (fileId, url) => set((state) => ({ blobUrls: { ...state.blobUrls, [fileId]: url } })),
  clearBlobUrls: () => {
    Object.values(get().blobUrls).forEach((url) => {
      const revokeUrl = () => URL.revokeObjectURL(url)
      revokeUrl()
    })
    set({ blobUrls: {} })
  },
  preloadedFiles: {},
  setPreloadedFiles: (files) => set({ preloadedFiles: files }),
  handleItemClick: (item, getPreviewType) => {
    if (typeof item.type === 'string' && !item.type.includes('folder')) {
      const file = item as FileItem
      if (!file.url) {
        console.warn('No URL provided')
        return
      }

      const preview = get().blobUrls[file.id] ?? file.url
      const currentName = get().preloadedFiles[file.id]?.name ?? file.name
      const previewType = getPreviewType(file)

      set({
        modal: {
          open: true,
          id: file.id,
          type: previewType,
          realType: file.type,
          size: file.size,
          url: preview,
          uploadThingUrl: file.url,
          name: currentName,
        },
      })
    }
  },
  handleRenameClick: (item) => {
    set({
      renameModal: {
        open: true,
        itemId: item.id,
        currentName: item.name,
      },
    })
  },
  handleModalClose: (open) => {
    const { modal } = get()
    set({ modal: { ...modal, open } })
  },
  handleRename: () => {
    const { modal } = get()
    if (modal.id) {
      set({
        renameModal: {
          open: true,
          itemId: modal.id,
          currentName: modal.name,
        },
      })
    }
  },
  handleDelete: async (items: DriveItem[], router: AppRouterInstance, itemId?: number) => {
    const { modal, setModal } = get()
    const idToDelete = itemId ?? modal.id
    if (!idToDelete) return

    set({ isDeleting: true })
    const itemToDelete = items.find((item) => item.id === idToDelete)
    if (itemToDelete) {
      await handleDeleteItem(itemToDelete)
    }
    set({ isDeleting: false })
    if (modal.id === idToDelete) {
      setModal({ ...modal, open: false })
    }
    router.refresh()
  },
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

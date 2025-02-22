import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { create } from 'zustand'
import { handleDeleteItem } from '~/server/actions/files/handleDeleteItem'
import type { DriveItem, FileItem } from '~/types/drive'

interface ModalState {
	open: boolean
	id: number
	type: string
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

interface UIStore {
	modal: ModalState
	renameModal: RenameModalState | null
	isDeleting: boolean
	setModal: (modal: ModalState) => void
	setRenameModal: (modal: RenameModalState | null) => void
	setIsDeleting: (isDeleting: boolean) => void
	handleItemClick: (item: DriveItem, getPreviewType: (file: FileItem) => string) => void
	handleRenameClick: (item: DriveItem) => void
	handleModalClose: (open: boolean) => void
	handleRename: () => void
	handleDelete: (items: DriveItem[], router: AppRouterInstance, itemId?: number) => Promise<void>
}

const initialModalState: ModalState = {
	open: false,
	id: 0,
	type: '',
	size: 0,
	url: '',
	uploadThingUrl: '',
	name: '',
}

export const useUIStore = create<UIStore>((set, get) => ({
	modal: initialModalState,
	renameModal: null,
	isDeleting: false,
	setModal: (modal) => set({ modal }),
	setRenameModal: (modal) => set({ renameModal: modal }),
	setIsDeleting: (isDeleting) => set({ isDeleting }),
	handleItemClick: (item, getPreviewType) => {
		const file = item as FileItem
		if (!file.url) {
			return
		}
		const previewType = getPreviewType(file)
		set({
			modal: {
				open: true,
				id: file.id,
				type: previewType,
				size: file.size,
				url: file.url,
				uploadThingUrl: file.url,
				name: file.name,
			},
		})
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
		if (!idToDelete) {
			return
		}
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
}))

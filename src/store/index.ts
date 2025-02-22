import { useUIStore } from './slices/uiStore'

export const useDriveStore = () => {
	const uiStore = useUIStore()

	return {
		...uiStore,
	}
}

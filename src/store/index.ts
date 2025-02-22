import { useFileStore } from './slices/fileStore'
import { useUIStore } from './slices/uiStore'

export const useDriveStore = () => {
  const fileStore = useFileStore()
  const uiStore = useUIStore()
  
  return {
    ...fileStore,
    ...uiStore,
  }
}

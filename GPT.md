Here is some context from my NextJS app before I tell you what I want!

file: `src/store/slices/uiStore.ts`

```typescript
import { create } from 'zustand'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import type { DriveItem, FileItem } from '~/types/drive'
import { handleDeleteItem } from '~/server/actions/files/handleDeleteItem'

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
  realType: '',
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
    if (typeof item.type === 'string' && !item.type.includes('folder')) {
      const file = item as FileItem
      if (!file.url) {
        console.warn('No URL provided')
        return
      }
      const previewType = getPreviewType(file)
      set({
        modal: {
          open: true,
          id: file.id,
          type: previewType,
          realType: file.type,
          size: file.size,
          url: file.url,
          uploadThingUrl: file.url,
          name: file.name,
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
```

file: `src/store/index.ts`

```typescript
import { useUIStore } from './slices/uiStore'

export const useDriveStore = () => {
  const uiStore = useUIStore()

  return {
    ...uiStore,
  }
}
```

file: `src/components/drive/MDrive/MDrive.tsx`

```typescript
'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import Breadcrumbs from '~/components/drive/Breadcrumbs/Breadcrumbs'
import FileFolderUploads from '~/components/drive/FileFolderUploads/FileFolderUploads'
import ItemModal from '~/components/modals/ItemModal/ItemModal'
import ListItem from '~/components/drive/ListItem/ListItem'
import LoadingComponent from '~/components/common/LoadingComponent/LoadingComponent'
import RenameModal from '~/components/modals/RenameModal/RenameModal'

import { getPreviewType } from '~/lib/utils/files/getPreviewType'
import { useDriveStore } from '~/store'

import styles from './MDrive.module.css'
import { type FileItem, type FolderItem, type DriveItem } from '~/types/drive'

interface MDriveProps {
  files: FileItem[]
  folders: FolderItem[]
  parents: FolderItem[]
  currentFolderId: number
  rootFolderId: number
  capacityUsed: number
  maxCapacity: number
}

export default function MDrive({ files, folders, parents, currentFolderId, rootFolderId, capacityUsed, maxCapacity }: MDriveProps) {
  const router = useRouter()
  const currentItems: DriveItem[] = [...folders, ...files]

  const { modal, renameModal, isDeleting, handleItemClick, handleModalClose, handleRename, handleRenameClick, handleDelete, setModal } = useDriveStore()

  return (
    <main className={styles.pageContainer}>
      <section className={styles.contentsContainer}>
        <Breadcrumbs breadcrumbs={parents} rootFolderId={rootFolderId} />
        <div className={styles.listContainer}>
          {currentItems.map((item, index) => {
            return (
              <ListItem
                key={`${item.id}-${index}`}
                item={item}
                handleItemClick={() => handleItemClick(item, getPreviewType)}
                onRename={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  handleRenameClick(item)
                }}
                onDelete={async (e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  await handleDelete(currentItems, router, item.id)
                }}
              />
            )
          })}
        </div>
      </section>
      {capacityUsed <= maxCapacity && <FileFolderUploads currentFolderId={currentFolderId} />}
      {modal.open && modal.type && (
        <ItemModal {...modal} setIsModalOpen={handleModalClose} onRename={handleRename} onDelete={() => handleDelete(files, router)} />
      )}
      {renameModal?.open && (
        <RenameModal
          currentName={renameModal.currentName}
          itemId={renameModal.itemId}
          onRenameSuccess={(newName: string) => {
            if (modal.id === renameModal.itemId) {
              setModal({
                ...modal,
                name: newName,
              })
            }
          }}
        />
      )}
      {isDeleting && <LoadingComponent />}
    </main>
  )
}
```

file: `src/components/drive/ListItem/ListItem.tsx`

```typescript
import Link from 'next/link'

import { getItemIcon } from '~/lib/utils/files/getItemIcon'
import { formatSize } from '~/lib/utils/files/formatSize'
import { forceDownload } from '~/lib/utils/files/forceDownload'

import styles from './ListItem.module.css'
import { DeleteIcon, DownloadIcon, RenameIcon } from '~/components/common/Icons/Icons'
import { type FileItem, type FolderItem } from '~/types/drive'

export interface ListItemProps {
  item: FileItem | FolderItem
  handleItemClick: React.MouseEventHandler<HTMLDivElement>
  onRename: React.MouseEventHandler<HTMLButtonElement>
  onDelete: React.MouseEventHandler<HTMLButtonElement>
}

function isFolder(item: FileItem | FolderItem): item is FolderItem {
  return item.type === 'folder'
}

export default function ListItem({ item, handleItemClick, onRename, onDelete }: ListItemProps) {
  const commonContent = (
    <>
      <div className={styles.infoContainer}>
        {getItemIcon(item.type)}
        <div className={styles.itemDetails}>
          <span className={styles.itemName}>{item.name}</span>
          <span className={styles.itemTypeSize}>
            {`${item.type[0]?.toUpperCase()}${item.type.slice(1)}${item.type !== 'folder' && 'size' in item ? ` • ${formatSize(item.size)}` : ''}`}
          </span>
        </div>
      </div>
      <div className={styles.actionButtons}>
        {'url' in item && (
          <button
            className={styles.downloadButton}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              void forceDownload(item.url, item.name).catch((err) => {
                console.error('Download failed', err)
              })
            }}
            aria-label="Download item"
          >
            <DownloadIcon />
          </button>
        )}
        <button className={styles.renameButton} onClick={onRename} aria-label="Rename item">
          <RenameIcon />
        </button>
        <button className={styles.deleteButton} onClick={onDelete} aria-label="Delete file">
          <DeleteIcon />
        </button>
      </div>
    </>
  )

  if (isFolder(item)) {
    return (
      <Link href={`/m/${item.id}`} className={styles.listContainer}>
        {commonContent}
      </Link>
    )
  } else {
    return (
      <div className={styles.listContainer} onClick={handleItemClick}>
        {commonContent}
      </div>
    )
  }
}
```

file: `src/components/modals/ItemModal/ItemModal.tsx`

```typescript
import React from 'react'
import GenericModal from '~/components/modals/GenericModal/GenericModal'
import styles from './ItemModal.module.css'
import { forceDownload } from '~/lib/utils/files/forceDownload'
import { isMobileDevice } from '~/lib/utils/device/isMobileDevice'
import { formatSize } from '~/lib/utils/files/formatSize'
import { ActionButton } from '~/components/common/ActionButton/ActionButton'
import { DeleteIcon, DownloadIcon, RenameIcon } from '~/components/common/Icons/Icons'

import MarkdownPreview from '../previews/MarkdownPreview'
import JsonPreview from '../previews/JsonPreview'
import { FileTypes } from '~/lib/constants/fileTypes'

interface ItemModalProps {
  type: string
  size: number
  url: string
  uploadThingUrl: string
  name: string
  setIsModalOpen: (open: boolean) => void
  onRename: () => void
  onDelete: () => void
}

export default React.memo(function ItemModal({ type, size, url, uploadThingUrl, name, setIsModalOpen, onRename, onDelete }: ItemModalProps) {
  const renderContent = () => {
    switch (type) {
      case FileTypes.IMAGE:
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={url} alt={name} className={styles.modalContent} />
      case FileTypes.PDF:
        return (
          <object data={url} type="application/pdf" className={styles.modalContent}>
            <p>
              Unable to display PDF. <a href={url}>Download</a> instead.
            </p>
          </object>
        )
      case FileTypes.VIDEO:
        return (
          <video controls className={styles.modalContent}>
            <source src={url} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        )
      case FileTypes.AUDIO:
        return (
          <audio controls className={styles.modalContent}>
            <source src={url} type="audio/mpeg" />
            Your browser does not support audio playback.
          </audio>
        )
      case FileTypes.JSON:
        return (
          <div className={styles.modalContent}>
            <JsonPreview url={url} />
          </div>
        )
      case FileTypes.MARKDOWN:
        return (
          <div className={styles.modalContent}>
            <MarkdownPreview url={url} />
          </div>
        )
      case FileTypes.TXT:
        return (
          <div className={styles.modalContent}>
            <iframe src={url} title={name} className={styles.modalContent} sandbox="allow-same-origin" />
          </div>
        )
      default:
        return (
          <div className={styles.modalContent}>
            <p>Preview not available for this file type.</p>
            <p>Download to view</p>
          </div>
        )
    }
  }

  return (
    <GenericModal onClose={() => setIsModalOpen(false)} ariaLabel={`${type} preview for ${name}`}>
      <div className={styles.itemInformation}>
        <span>{name}</span>
        <span>
          {type} • {formatSize(size)}
        </span>
      </div>
      {renderContent()}
      <div className={styles.itemActions}>
        <ActionButton onClick={() => void forceDownload(uploadThingUrl, name)} icon={<DownloadIcon />} label="Download" isMobile={isMobileDevice()} />
        <ActionButton onClick={onRename} icon={<RenameIcon />} label="Rename" isMobile={isMobileDevice()} />
        <ActionButton onClick={onDelete} icon={<DeleteIcon />} label="Delete" isMobile={isMobileDevice()} />
      </div>
    </GenericModal>
  )
})
```

file: `src/components/modals/GenericModal/GenericModal.tsx`

```typescript
import React, { useEffect } from 'react'
import styles from './GenericModal.module.css'

interface GenericModalProps {
  onClose: () => void
  ariaLabel?: string
  children: React.ReactNode
}

export default function GenericModal({ onClose, ariaLabel, children }: GenericModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="presentation">
      <div className={styles.modalWrapper} role="dialog" aria-modal="true" aria-label={ariaLabel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
```

Now I want you to analyse these files and then I want to:

1. If a user opens a file in a folder with MULTIPLE files, I want the user to have an option to navigate left and right between the files!
2. Any other improvement suggestions you may have.

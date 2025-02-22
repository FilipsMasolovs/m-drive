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

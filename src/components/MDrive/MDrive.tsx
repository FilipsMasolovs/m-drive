'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import FileFolderUploads from '~/components/FileFolderUploads/FileFolderUploads'
import ItemModal from '~/components/ItemModal/ItemModal'
import ListItem from '~/components/ListItem/ListItem'
import LoadingComponent from '~/components/LoadingComponent/LoadingComponent'
import RenameModal from '~/components/RenameModal/RenameModal'

import { getPreviewType } from '~/lib/utils/getPreviewType'
import { useDriveStore } from '~/store/driveStore'
import type { FolderItem, FileItem, DriveItem } from '~/types/types'

import styles from './MDrive.module.css'

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

  const {
    modal,
    renameModal,
    isDeleting,
    preloadedFiles,
    handleItemClick,
    handleModalClose,
    handleRename,
    handleRenameClick,
    handleDelete,
    preloadFiles,
    clearBlobUrls,
    setPreloadedFiles,
    setModal,
  } = useDriveStore()

  useEffect(() => {
    void preloadFiles(files)
  }, [files, preloadFiles])

  useEffect(() => {
    return () => {
      clearBlobUrls()
    }
  }, [clearBlobUrls])

  return (
    <main className={styles.pageContainer}>
      <section className={styles.contentsContainer}>
        <Breadcrumbs breadcrumbs={parents} rootFolderId={rootFolderId} />
        <div className={styles.listContainer}>
          {currentItems.map((item, index) => {
            const displayedItem =
              typeof item.type === 'string' && !item.type.includes('folder')
                ? {
                    ...item,
                    name: preloadedFiles[item.id]?.name ?? item.name,
                  }
                : item
            return (
              <ListItem
                key={`${item.id}-${index}`}
                item={displayedItem}
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
      {modal.open && modal.type && <ItemModal {...modal} setIsModalOpen={handleModalClose} onRename={handleRename} onDelete={() => handleDelete(files, router)} />}
      {renameModal?.open && (
        <RenameModal
          currentName={renameModal.currentName}
          itemId={renameModal.itemId}
          onRenameSuccess={(newName: string) => {
            if (preloadedFiles[renameModal.itemId]) {
              setPreloadedFiles({
                ...preloadedFiles,
                [renameModal.itemId]: {
                  name: newName,
                  originalUrl: preloadedFiles[renameModal.itemId]!.originalUrl,
                },
              })
            }

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

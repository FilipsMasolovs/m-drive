'use client'

import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

import AppLogo from '~/components/AppLogo/AppLogo'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import FileFolderUploads from '~/components/FileFolderUploads/FileFolderUploads'
import GlobalSearch from '~/components/GlobalSearch/GlobalSearch'
import HeaderItemsContainer from '~/components/HeaderItemsContainer/HeaderItemsContainer'
import ItemModal from '~/components/ItemModal/ItemModal'
import ListItem from '~/components/ListItem/ListItem'
import LoadingComponent from '~/components/LoadingComponent/LoadingComponent'
import RenameModal from '~/components/RenameModal/RenameModal'
import UsageIndicator from '~/components/UsageIndicator/UsageIndicator'

import { handleDeleteItem } from '~/lib/utils/handleDeleteItem'
import type { PreloadedFile } from '~/lib/utils/sessionPreloadedFiles'
import { useSessionPreloadedFiles } from '~/lib/utils/useSessionPreloadedFiles'
import type { FolderItem, FileItem } from '~/types/types'

import styles from './MDrive.module.css'

export type DriveItem = FolderItem | FileItem

type FilePreviewType = 'image' | 'pdf' | 'video' | 'application' | 'text/plain' | 'audio' | 'docx' | string

interface ModalState {
  open: boolean
  id?: number
  type: FilePreviewType | string
  url: string
  uploadThingUrl: string
  name: string
}

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

  const { files: preloadedFiles, setFiles: setPreloadedFiles } = useSessionPreloadedFiles()

  const [deleting, setDeleting] = useState(false)

  const [modal, setModal] = useState<ModalState>({
    open: false,
    type: '',
    url: '',
    uploadThingUrl: '',
    name: '',
  })

  const [renameModal, setRenameModal] = useState<{
    open: boolean
    itemId: number
    currentName: string
  } | null>(null)

  useEffect(() => {
    async function preloadFiles() {
      const fileItems = files.filter((file) => file.url !== '')
      const loaded: Record<number, PreloadedFile> = { ...preloadedFiles }

      await Promise.all(
        fileItems.map(async (file) => {
          try {
            const res = await fetch(file.url)
            if (res.ok) {
              const blob = await res.blob()
              const blobUrl = URL.createObjectURL(blob)
              loaded[file.id] = { url: blobUrl, name: file.name }
            } else {
              console.warn(`Failed to preload file ${file.name}`)
            }
          } catch (error) {
            console.error('Error preloading file', file.name, error)
          }
        }),
      )
      setPreloadedFiles(loaded)
    }
    void preloadFiles()
  }, [files, setPreloadedFiles, preloadedFiles])

  useEffect(() => {
    return () => {
      Object.values(preloadedFiles).forEach((entry) => URL.revokeObjectURL(entry.url))
    }
  }, [preloadedFiles])

  const getPreviewType = (file: FileItem): FilePreviewType => {
    if (file.type.includes('image')) return 'image'
    if (file.type.includes('pdf')) return 'pdf'
    if (file.type.includes('video')) return 'video'
    if (file.type.includes('text/plain')) return 'text/plain'
    if (file.type.includes('audio')) return 'audio'
    if (file.type.includes('docx') || file.type.includes('officedocument')) return 'docx'
    if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('application')) return 'application'
    return file.type
  }

  const handleItemClick = (item: DriveItem) => {
    if (typeof item.type === 'string' && !item.type.includes('folder')) {
      const file = item as FileItem

      if (!file.url) {
        console.warn('No URL provided')
        return
      }

      const preview = preloadedFiles[file.id]?.url ?? file.url
      const currentName = preloadedFiles[file.id]?.name ?? file.name
      const previewType = getPreviewType(file)

      if (previewType) {
        setModal({
          open: true,
          id: file.id,
          type: previewType,
          url: preview,
          uploadThingUrl: file.url,
          name: currentName,
        })
      } else {
        console.log(`Opening file: ${file.name}`)
      }
    }
  }

  const handleRenameClick = (item: FileItem | FolderItem) => {
    setRenameModal({ open: true, itemId: item.id, currentName: item.name })
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.headerContainer}>
        <HeaderItemsContainer>
          <AppLogo redirectPath={`/m/${rootFolderId}`} />
          <GlobalSearch handleItemClick={handleItemClick} />
        </HeaderItemsContainer>
        <HeaderItemsContainer>
          <UsageIndicator capacityUsed={capacityUsed} maxCapacity={maxCapacity} />
          <UserButton />
        </HeaderItemsContainer>
      </header>
      <main className={styles.listContainer}>
        <Breadcrumbs breadcrumbs={parents} rootFolderId={rootFolderId} />
        {currentItems.map((item, index) => {
          const displayedItem = typeof item.type === 'string' && !item.type.includes('folder') ? { ...item, name: preloadedFiles[item.id]?.name ?? item.name } : item
          return (
            <ListItem
              key={`${item.id}-${index}`}
              item={displayedItem}
              handleItemClick={() => handleItemClick(item)}
              handleDelete={async () => {
                setDeleting(true)
                await handleDeleteItem(item)
                setDeleting(false)
              }}
              handleRename={() => handleRenameClick(item)}
            />
          )
        })}
      </main>
      {capacityUsed <= maxCapacity && <FileFolderUploads currentFolderId={currentFolderId} />}
      {modal.open && modal.type && (
        <ItemModal
          type={modal.type}
          url={modal.url}
          uploadThingUrl={modal.uploadThingUrl}
          name={modal.name}
          setIsModalOpen={(open) => setModal((prev) => ({ ...prev, open }))}
          onRename={() => {
            if (modal.id) {
              setRenameModal({ open: true, itemId: modal.id, currentName: modal.name })
            }
          }}
          onDelete={async () => {
            if (modal.id) {
              setDeleting(true)
              const fileToDelete = files.find((item) => item.id === modal.id)
              if (fileToDelete) {
                await handleDeleteItem(fileToDelete)
              }
              setDeleting(false)
              setModal((prev) => ({ ...prev, open: false }))
              router.refresh()
            }
          }}
        />
      )}
      {renameModal?.open && (
        <RenameModal
          currentName={renameModal.currentName}
          itemId={renameModal.itemId}
          setIsModalOpen={(open) => setRenameModal((prev) => (prev ? { ...prev, open } : null))}
          onRenameSuccess={(newName: string) => {
            setPreloadedFiles((prev) => {
              if (prev[renameModal.itemId]) {
                return {
                  ...prev,
                  [renameModal.itemId]: {
                    url: prev[renameModal.itemId]!.url,
                    name: newName,
                  },
                }
              }
              return prev
            })
            router.refresh()
          }}
          setRenameModal={setRenameModal}
        />
      )}
      {deleting && <LoadingComponent />}
    </div>
  )
}

'use client'

import { UserButton } from '@clerk/nextjs'
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
import type { FolderItem, FileItem } from '~/types/types'

import styles from './MDrive.module.css'
import { useSessionPreloadedFiles } from '~/lib/utils/useSessionPreloadedFiles'
import type { PreloadedFile } from '~/lib/utils/sessionPreloadedFiles'
import { useRouter } from 'next/navigation'

export type DriveItem = FolderItem | FileItem

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

  const [modal, setModal] = useState<{ open: boolean; type: 'image' | 'pdf' | 'video' | 'application' | 'text/plain' | 'audio' | 'docx' | null; url: string; name: string }>({
    open: false,
    type: null,
    url: '',
    name: '',
  })

  const [renameModal, setRenameModal] = useState<{ open: boolean; itemId: number; currentName: string } | null>(null)

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
  }, [files, setPreloadedFiles])

  useEffect(() => {
    return () => {
      Object.values(preloadedFiles).forEach((entry) => URL.revokeObjectURL(entry.url))
    }
  }, [preloadedFiles])

  const handleItemClick = (item: DriveItem) => {
    if (typeof item.type === 'string' && !item.type.includes('folder')) {
      const file = item as FileItem
      if (!file.url) {
        console.warn('No URL provided')
        return
      }

      const preview = preloadedFiles[file.id]?.url ?? file.url
      const currentName = preloadedFiles[file.id]?.name ?? file.name

      if (file.type.includes('image')) {
        setModal({ open: true, type: 'image', url: preview, name: currentName })
      } else if (file.type.includes('pdf')) {
        setModal({ open: true, type: 'pdf', url: preview, name: currentName })
      } else if (file.type.includes('video')) {
        setModal({ open: true, type: 'video', url: preview, name: currentName })
      } else if (file.type.includes('text/plain')) {
        setModal({ open: true, type: 'text/plain', url: preview, name: currentName })
      } else if (file.type.includes('audio')) {
        setModal({ open: true, type: 'audio', url: preview, name: currentName })
      } else if (file.type.includes('docx') || file.type.includes('officedocument')) {
        setModal({ open: true, type: 'docx', url: preview, name: currentName })
      } else if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('application')) {
        setModal({ open: true, type: 'application', url: preview, name: currentName })
      } else {
        console.log(`Opening file: ${file.name}`)
      }
    } else {
      console.log(`Folder ${item.name} clicked.`)
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
      {modal.open && modal.type && <ItemModal type={modal.type} url={modal.url} name={modal.name} setIsModalOpen={(open) => setModal((prev) => ({ ...prev, open }))} />}
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

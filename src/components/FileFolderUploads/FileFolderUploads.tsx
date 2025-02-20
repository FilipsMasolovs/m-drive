import { useRouter } from 'next/navigation'

import { UploadButton } from '~/components/UploadThing/uploadthing'

import styles from './FileFolderUploads.module.css'
import { useEffect, useRef, useState } from 'react'
import { handleCreateFolder } from '~/lib/utils/handleCreateFolder'

interface FileFolderUploadsProps {
  currentFolderId: number
}

export default function FileFolderUploads({ currentFolderId }: FileFolderUploadsProps) {
  const router = useRouter()
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [folderName, setFolderName] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await handleCreateFolder(folderName, currentFolderId)

    setFolderName('')
    setIsCreatingFolder(false)
    router.refresh()
  }

  useEffect(() => {
    if (!isCreatingFolder) return

    function handleOutsideClick(e: MouseEvent) {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setFolderName('')
        setIsCreatingFolder(false)
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [isCreatingFolder])

  return (
    <div className={styles.fileAndFolderCreationContainer}>
      <>
        {isCreatingFolder ? (
          <form ref={formRef} onSubmit={handleSubmit}>
            <input className={styles.folderNameInput} type="text" placeholder="Folder name..." value={folderName} onChange={(e) => setFolderName(e.target.value)} />
            <button className={styles.createFolderButton} type="submit">
              +
            </button>
          </form>
        ) : (
          <button className={styles.openFormButton} onClick={() => setIsCreatingFolder(true)}>
            Create Folder
          </button>
        )}
      </>
      <UploadButton
        className={styles.uploadFileButton}
        endpoint="driveUploader"
        onClientUploadComplete={() => {
          router.refresh()
        }}
        input={{
          folderId: currentFolderId,
        }}
      />
    </div>
  )
}

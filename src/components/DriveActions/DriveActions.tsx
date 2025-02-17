import { useRouter } from 'next/navigation'

import { UploadButton } from '~/components/UploadThing/uploadthing'

import styles from './DriveActions.module.css'
import { useState } from 'react'
import { createFolder } from '~/server/actions/actions'

interface DriveActionsProps {
  currentFolderId: number
}

export default function DriveActions({ currentFolderId }: DriveActionsProps) {
  const router = useRouter()
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [folderName, setFolderName] = useState('')

  const handleSubmit = async () => {
    if (!folderName.trim()) {
      return
    }

    await createFolder(folderName, currentFolderId)

    setFolderName('')
  }

  return (
    <>
      <div className={styles.createFolderForm}>
        {isCreatingFolder ? (
          <form onSubmit={handleSubmit}>
            <input className={styles.folderNameInput} type="text" placeholder="Folder name..." value={folderName} onChange={(e) => setFolderName(e.target.value)} />
            <button className={styles.createFolderButton} type="submit">
              +
            </button>
            <button className={styles.closeFormButton} type="button" onClick={() => setIsCreatingFolder(false)}>
              X
            </button>
          </form>
        ) : (
          <button className={styles.openFormButton} onClick={() => setIsCreatingFolder(true)}>
            Create Folder
          </button>
        )}
      </div>
      <div className={styles.fileUploadButton}>
        <UploadButton
          endpoint="driveUploader"
          onClientUploadComplete={() => {
            router.refresh()
          }}
          input={{
            folderId: currentFolderId,
          }}
        />
      </div>
    </>
  )
}

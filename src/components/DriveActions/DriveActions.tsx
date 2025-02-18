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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) {
      return;
    }
    try {
      await createFolder(folderName, currentFolderId);
      setFolderName('');
      setIsCreatingFolder(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className={styles.createFolderForm}>
        {isCreatingFolder ? (
          <form onSubmit={handleSubmit}>
            <input className={styles.folderNameInput} type="text" placeholder="Folder name..." value={folderName} onChange={(e) => setFolderName(e.target.value)} />
            <button className={styles.createFolderButton} type='submit'>
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

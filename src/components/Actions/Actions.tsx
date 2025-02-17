import { Upload, LayoutGrid, LayoutList } from 'lucide-react'

import styles from './Actions.module.css'
import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs'

type ViewMode = 'list' | 'grid'

interface ActionsProps {
  viewMode: ViewMode
  setViewMode: (viewMode: ViewMode) => void
}

export default function Actions({ viewMode, setViewMode }: ActionsProps) {
  return (
    <div className={styles.actionsContainer}>
      <button onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} className={styles.layoutButton}>
        {viewMode === 'list' ? <LayoutGrid className="h-5 w-5" /> : <LayoutList className="h-5 w-5" />}
      </button>
      <button className={styles.fileUploadButton}>
        <Upload />
        Upload
      </button>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

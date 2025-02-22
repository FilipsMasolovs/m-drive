import { useState, useEffect } from 'react'
import { getPreloadedFiles, setPreloadedFiles } from '../server/actions/utils/sessionPreloadedFiles'

import type { PreloadedFile } from '../server/actions/utils/sessionPreloadedFiles'

export function useSessionPreloadedFiles() {
  const [files, setFiles] = useState<Record<number, PreloadedFile>>(getPreloadedFiles())

  useEffect(() => {
    setPreloadedFiles(files)
  }, [files])

  return { files, setFiles }
}

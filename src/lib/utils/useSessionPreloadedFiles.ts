import { useState, useEffect } from 'react'
import { getPreloadedFiles, setPreloadedFiles } from './sessionPreloadedFiles'
import { PreloadedFile } from './sessionPreloadedFiles'

export function useSessionPreloadedFiles() {
  const [files, setFiles] = useState<Record<number, PreloadedFile>>(getPreloadedFiles())

  useEffect(() => {
    setPreloadedFiles(files)
  }, [files])

  return { files, setFiles }
}

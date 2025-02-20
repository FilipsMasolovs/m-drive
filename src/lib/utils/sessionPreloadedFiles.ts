export interface PreloadedFile {
  url: string
  name: string
}

const STORAGE_KEY = 'preloadedFiles'

export function getPreloadedFiles(): Record<number, PreloadedFile> {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Record<number, PreloadedFile>) : {}
  } catch (error) {
    console.error('Error parsing preloadedFiles from sessionStorage:', error)
    return {}
  }
}

export function setPreloadedFiles(files: Record<number, PreloadedFile>): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(files))
  } catch (error) {
    console.error('Error storing preloadedFiles to sessionStorage:', error)
  }
}

export function updatePreloadedFile(fileId: number, newName: string): void {
  const prev = getPreloadedFiles()
  if (prev[fileId]) {
    prev[fileId] = { ...prev[fileId], name: newName }
    setPreloadedFiles(prev)
  }
}

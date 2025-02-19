import React, { useState, useEffect } from 'react'

import type { DriveItem } from '../MDrive/MDrive' // Use `import type` because it is only used as a type
import type { FileItem, FolderItem } from '~/types/types'

import styles from './GlobalSearch.module.css'

interface SearchResults {
  files: FileItem[]
  folders: FolderItem[]
}

export default function GlobalSearch({ handleItemClick }: { handleItemClick: (item: DriveItem) => void }) {
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<{ files: FileItem[]; folders: FolderItem[] }>({
    files: [],
    folders: [],
  })
  const [loading, setLoading] = useState<boolean>(false)

  const DEBOUNCE_DELAY = 300

  useEffect(() => {
    if (!query.trim()) {
      setResults({ files: [], folders: [] })
      return
    }
    const timer = setTimeout(() => {
      setLoading(true)
      void (async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          const data = (await res.json()) as SearchResults
          setResults(data)
        } catch (error) {
          console.error('Search failed:', error)
        } finally {
          setLoading(false)
        }
      })()
    }, DEBOUNCE_DELAY)

    return () => {
      clearTimeout(timer)
    }
  }, [query])

  return (
    <div>
      <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className={styles.searchInput} />
      {query.trim() !== '' && (
        <div className={styles.searchSuggestions}>
          {loading ? (
            <p className={styles.searchSuggestionsPlaceholder}>Loading...</p>
          ) : results.folders.length === 0 && results.files.length === 0 ? (
            <p className={styles.searchSuggestionsPlaceholder}>No results found.</p>
          ) : (
            <>
              {results.folders.length > 0 && (
                <>
                  <h3 className={styles.suggestionType}>Folders</h3>
                  {results.folders.map((folder) => (
                    <div key={folder.id} className={styles.suggestionItem}>
                      <a href={`/m/${folder.id}`}>{folder.name}</a>
                    </div>
                  ))}
                </>
              )}
              {results.files.length > 0 && (
                <>
                  <h3 className={styles.suggestionType}>Files</h3>
                  {results.files.map((file) => (
                    <div key={file.id} className={styles.suggestionItem}>
                      <span
                        onClick={() => {
                          handleItemClick(file)
                        }}
                      >
                        {file.name}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

import React, { useState, useEffect, useRef, useCallback } from 'react'

import type { DriveItem } from '~/components/MDrive/MDrive'

import type { FileItem, FolderItem } from '~/types/types'

import styles from './GlobalSearch.module.css'
import { useDebounce } from '~/lib/utils/useDebounce'

interface SearchResults {
  files: FileItem[]
  folders: FolderItem[]
}

export default function GlobalSearch({ handleItemClick }: { handleItemClick: (item: DriveItem) => void }) {
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<SearchResults>({
    files: [],
    folders: [],
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const resultsRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 300)

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({ files: [], folders: [] })
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (!res.ok) throw new Error('Search failed')

      const data = (await res.json()) as SearchResults
      setResults(data)
    } catch (err) {
      setError('Search failed. Please try again.')
      console.error('Search failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void handleSearch(debouncedQuery)
  }, [debouncedQuery, handleSearch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = results.folders.length + results.files.length

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % totalItems)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems)
        break
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault()
          const isFolder = selectedIndex < results.folders.length
          const item = isFolder ? results.folders[selectedIndex] : results.files[selectedIndex - results.folders.length]
          if (item) {
            isFolder ? (window.location.href = `/m/${item.id}`) : handleItemClick(item)
          }
        }
        break
      case 'Escape':
        setQuery('')
        break
    }
  }

  const renderResults = () => {
    return (
      <>
        {results.folders.length > 0 && (
          <>
            <h3 className={styles.suggestionType}>Folders</h3>
            {results.folders.map((folder, index) => (
              <div
                key={folder.id}
                className={`${styles.suggestionItem} ${selectedIndex === index ? styles.selected : ''}`}
                onMouseEnter={() => setSelectedIndex(index)}
                role="option"
                aria-selected={selectedIndex === index}
              >
                <a href={`/m/${folder.id}`}>{folder.name}</a>
              </div>
            ))}
          </>
        )}
        {results.files.length > 0 && (
          <>
            <h3 className={styles.suggestionType}>Files</h3>
            {results.files.map((file, index) => (
              <div
                key={file.id}
                className={`${styles.suggestionItem} ${selectedIndex === index + results.folders.length ? styles.selected : ''}`}
                onMouseEnter={() => setSelectedIndex(index + results.folders.length)}
                onClick={() => handleItemClick(file)}
                role="option"
                aria-selected={selectedIndex === index + results.folders.length}
              >
                <span>{file.name}</span>
              </div>
            ))}
          </>
        )}
      </>
    )
  }

  return (
    <div role="search">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className={styles.searchInput}
        aria-label="Search files and folders"
        aria-expanded={query.trim() !== ''}
        aria-controls="search-results"
        aria-describedby={error ? 'search-error' : undefined}
      />

      {error && (
        <div id="search-error" className={styles.error} role="alert">
          {error}
        </div>
      )}

      {query.trim() !== '' && (
        <div id="search-results" className={styles.searchSuggestions} ref={resultsRef} role="listbox">
          {loading ? (
            <p className={styles.searchSuggestionsPlaceholder}>Loading...</p>
          ) : results.folders.length === 0 && results.files.length === 0 ? (
            <p className={styles.searchSuggestionsPlaceholder}>No results found.</p>
          ) : (
            renderResults()
          )}
        </div>
      )}
    </div>
  )
}

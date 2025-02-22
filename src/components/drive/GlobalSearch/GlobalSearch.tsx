'use client'

import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from '~/hooks/useDebounce'
import { getPreviewType } from '~/lib/utils/files/getPreviewType'
import { useDriveStore } from '~/store'
import { type FileItem, type FolderItem } from '~/types/drive'
import styles from './GlobalSearch.module.css'

interface SearchResults {
	files: FileItem[]
	folders: FolderItem[]
}

export default function GlobalSearch() {
	const router = useRouter()
	const { handleItemClick } = useDriveStore()

	const [query, setQuery] = useState<string>('')
	const [results, setResults] = useState<SearchResults>({
		files: [],
		folders: [],
	})
	const [loading, setLoading] = useState<boolean>(false)
	const [selectedIndex, setSelectedIndex] = useState<number>(-1)
	const resultsRef = useRef<HTMLDivElement>(null)

	const suggestionsRefs = useRef<(HTMLDivElement | null)[]>([])

	const debouncedQuery = useDebounce(query, 300)

	const handleSearch = useCallback(async (searchQuery: string) => {
		if (!searchQuery.trim()) {
			setResults({ files: [], folders: [] })
			return
		}

		setLoading(true)

		try {
			const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
			if (!res.ok) throw new Error('Search failed')
			const data = (await res.json()) as SearchResults
			setResults(data)
		} catch (err) {
			console.error('Search failed:', err)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		void handleSearch(debouncedQuery)
	}, [debouncedQuery, handleSearch])

	useEffect(() => {
		if (selectedIndex >= 0 && suggestionsRefs.current[selectedIndex]) {
			suggestionsRefs.current[selectedIndex]?.scrollIntoView({
				block: 'nearest',
				behavior: 'smooth',
			})
		}
	}, [selectedIndex])

	const handleEnterKey = () => {
		const totalItems = results.folders.length + results.files.length
		if (selectedIndex < 0 || selectedIndex >= totalItems) {
			return
		}

		if (selectedIndex < results.folders.length) {
			const folder = results.folders[selectedIndex]
			if (folder) {
				router.push(`/m/${folder.id}`)
				setQuery('')
				setResults({ files: [], folders: [] })
			}
		} else {
			const file = results.files[selectedIndex - results.folders.length]
			if (file) {
				handleItemClick(file, getPreviewType)
				setQuery('')
				setResults({ files: [], folders: [] })
				redirect(`/m/${file.parent}`)
			}
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		const totalItems = results.folders.length + results.files.length

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault()
				if (totalItems > 0) setSelectedIndex((prev) => (prev + 1) % totalItems)
				break
			case 'ArrowUp':
				e.preventDefault()
				if (totalItems > 0) setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems)
				break
			case 'Enter':
				if (selectedIndex >= 0) {
					e.preventDefault()
					handleEnterKey()
				}
				break
			case 'Escape':
				setQuery('')
				setResults({ files: [], folders: [] })
				break
		}
	}

	const renderResults = () => {
		suggestionsRefs.current = []
		return (
			<>
				{results.folders.length > 0 && (
					<>
						<h3 className={styles.suggestionType}>Folders</h3>
						{results.folders.map((folder, index) => (
							<div
								key={folder.id}
								ref={(el) => {
									suggestionsRefs.current[index] = el
								}}
								className={`${styles.suggestionItem} ${selectedIndex === index ? styles.selected : ''}`}
								onMouseEnter={() => setSelectedIndex(index)}
								role="option"
								aria-selected={selectedIndex === index}
								onClick={() => {
									setQuery('')
								}}
							>
								<Link href={`/m/${folder.id}`}>
									<span>{folder.name}</span>
								</Link>
							</div>
						))}
					</>
				)}
				{results.files.length > 0 && (
					<>
						<h3 className={styles.suggestionType}>Files</h3>
						{results.files.map((file, index) => {
							const overallIndex = index + results.folders.length
							return (
								<div
									key={file.id}
									ref={(el) => {
										suggestionsRefs.current[overallIndex] = el
									}}
									className={`${styles.suggestionItem} ${selectedIndex === overallIndex ? styles.selected : ''}`}
									onMouseEnter={() => setSelectedIndex(overallIndex)}
									onClick={() => {
										handleItemClick(file, getPreviewType)
										setQuery('')
										setResults({ files: [], folders: [] })
										redirect(`/m/${file.parent}`)
									}}
									role="option"
									aria-selected={selectedIndex === overallIndex}
								>
									<span>{file.name}</span>
								</div>
							)
						})}
					</>
				)}
			</>
		)
	}

	return (
		<div className={styles.searchContainer} role="search">
			<input
				type="text"
				placeholder="Search..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={handleKeyDown}
				className={styles.searchInput}
				aria-label="Search files and folders"
				aria-controls="search-results"
			/>
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

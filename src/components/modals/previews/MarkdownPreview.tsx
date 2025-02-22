import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './Previews.module.css'

interface MarkdownPreviewProps {
	url: string
}

export default function MarkdownPreview({ url }: MarkdownPreviewProps) {
	const [content, setContent] = useState<string>('Loading preview...')

	useEffect(() => {
		const fetchContent = async () => {
			try {
				const response = await fetch(url)
				const text = await response.text()
				setContent(text)
			} catch (error) {
				console.error('Error loading markdown:', error)
				setContent('Error loading preview.')
			}
		}
		void fetchContent()
	}, [url])

	return (
		<div className={styles.markdownPreview}>
			<ReactMarkdown>{content}</ReactMarkdown>
		</div>
	)
}

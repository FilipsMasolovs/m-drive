import React, { useEffect, useState } from 'react'
import styles from './Previews.module.css'

interface JsonPreviewProps {
  url: string
}

export default function JsonPreview({ url }: JsonPreviewProps) {
  const [content, setContent] = useState<string>('Loading preview...')

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(url)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json = await response.json()
        setContent(JSON.stringify(json, null, 2))
      } catch (error) {
        console.error('Error loading JSON:', error)
        setContent('Error loading preview.')
      }
    }
    void fetchContent()
  }, [url])

  return (
    <pre className={styles.jsonPreview}>
      <code>{content}</code>
    </pre>
  )
}

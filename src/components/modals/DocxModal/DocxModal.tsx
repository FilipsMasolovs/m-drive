import React, { useEffect, useState } from 'react'
import mammoth from 'mammoth'

interface DocxModalProps {
  url: string
  name: string
  setIsModalOpen: (open: boolean) => void
}

export default function DocxModal({ url }: DocxModalProps) {
  const [htmlContent, setHtmlContent] = useState<string>('Loading preview...')

  useEffect(() => {
    async function convertDocxToHtml() {
      try {
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        const result = await mammoth.convertToHtml({ arrayBuffer })
        setHtmlContent(result.value || 'No preview available.')
      } catch (error) {
        console.error('Error converting DOCX to HTML:', error)
        setHtmlContent('<p>Error loading preview.</p>')
      }
    }
    void convertDocxToHtml()
  }, [url])

  return <div style={{ width: '100%', height: '100%', backgroundColor: 'white', color: 'black' }} dangerouslySetInnerHTML={{ __html: htmlContent }} />
}

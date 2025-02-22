'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoadingComponent from '~/components/common/LoadingComponent/LoadingComponent'

interface DriveRedirectorProps {
  targetFolderId: number
}

export default function DriveRedirector({ targetFolderId }: DriveRedirectorProps) {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/m/${targetFolderId}`)
    }, 500)
    return () => clearTimeout(timer)
  }, [targetFolderId, router])

  return <LoadingComponent />
}

'use server'

import ACTIONS from '~/server/actions/actions'
import { type DriveItem } from '~/types/types'

export async function handleDeleteItem(item: DriveItem): Promise<void> {
  try {
    const actions = await ACTIONS()

    if (item.type === 'folder') {
      await actions.DELETIONS.deleteFolder(item.id)
    } else {
      await actions.DELETIONS.deleteFile(item.id)
    }
  } catch (error) {
    console.error('Deletion failed:', error)
  }
}

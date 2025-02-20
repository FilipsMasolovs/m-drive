'use server'

import type { DriveItem } from '~/components/MDrive/MDrive'

import ACTIONS from '~/server/actions/actions'

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

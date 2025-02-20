'use server'

import ACTIONS from '~/server/actions/actions'

export async function handleRenameItem(itemId: number, newName: string): Promise<void> {
  console.log("DATA:")
  console.log("itemId:", itemId)
  console.log("newName:", newName)
  console.log("====")

  const actions = await ACTIONS()

  try {
    await actions.MUTATIONS.renameItem(itemId, newName)
  } catch (error) {
    console.error('Rename failed:', error)
  }
}

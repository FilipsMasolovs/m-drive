'use server'

import ACTIONS from '~/server/actions/actions'

export async function handleRenameItem(itemId: number, newName: string): Promise<void> {
	const actions = await ACTIONS()

	try {
		await actions.MUTATIONS.renameItem(itemId, newName)
	} catch (error) {
		throw error
	}
}

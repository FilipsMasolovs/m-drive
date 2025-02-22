import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { QUERIES } from '~/server/db/queries'

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)

	const query = searchParams.get('q') ?? ''

	const session = await auth()

	if (!session.userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const results = await QUERIES.searchFilesAndFolders(session.userId, query)

	return NextResponse.json(results)
}

import 'server-only'

import { int, text, index, singlestoreTableCreator, bigint } from 'drizzle-orm/singlestore-core'

export const createTable = singlestoreTableCreator((name) => `m_drive_${name}`)

export const files_table = createTable(
  'files_table',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    url: text('url').notNull(),
    parent: bigint('parent', { mode: 'number', unsigned: true }).notNull(),
    size: int('size').notNull(),
  },
  (t) => {
    return [index('parent_index').on(t.parent)]
  },
)

export const folders_table = createTable(
  'folders_table',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    parent: bigint('parent', { mode: 'number', unsigned: true }),
  },
  (t) => {
    return [index('parent_index').on(t.parent)]
  },
)

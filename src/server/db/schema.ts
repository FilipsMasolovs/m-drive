import 'server-only'

import { int, text, index, singlestoreTableCreator, bigint, timestamp } from 'drizzle-orm/singlestore-core'

export const createTable = singlestoreTableCreator((name) => `m_drive_${name}`)

export const files_table = createTable(
  'files_table',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
    ownerId: text('owner_id').notNull(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    parent: bigint('parent', { mode: 'number', unsigned: true }).notNull(),
    size: int('size').notNull(),
    url: text('url').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => {
    return [index('parent_index').on(t.parent), index('owner_id_index').on(t.ownerId)]
  },
)

export const folders_table = createTable(
  'folders_table',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
    ownerId: text('owner_id').notNull(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    parent: bigint('parent', { mode: 'number', unsigned: true }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => {
    return [index('parent_index').on(t.parent), index('owner_id_index').on(t.ownerId)]
  },
)

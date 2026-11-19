#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/5651e81deb7fea854107afcc8a2209f7868ca57d8dfa490d58c810e468959977/contract';
import endContract from '../../snapshots/5651e81deb7fea854107afcc8a2209f7868ca57d8dfa490d58c810e468959977/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Chat',
        columns: [
          col('id', 'SERIAL', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('lastAccessedAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('tgId', 'int8', {
            notNull: true,
            codecRef: { codecId: 'pg/int8@1' },
          }),
          col('userId', 'int8', {
            notNull: true,
            codecRef: { codecId: 'pg/int8@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Message',
        columns: [
          col('chatId', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('content', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('id', 'SERIAL', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('lastAccessedAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('tgChatId', 'int8', {
            notNull: true,
            codecRef: { codecId: 'pg/int8@1' },
          }),
          col('tgId', 'int8', {
            notNull: true,
            codecRef: { codecId: 'pg/int8@1' },
          }),
          col('type', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('userId', 'int8', {
            notNull: true,
            codecRef: { codecId: 'pg/int8@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Message_type_check_60f9ea0b',
            sql`"type" IN ('TEXT', 'PHOTO', 'VIDEO', 'DOCUMENT', 'AUDIO', 'VOICE', 'ANIMATION', 'STICKER', 'VIDEO_NOTE', 'UNDEFINED')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('connId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: {
              codecId: 'pg/timestamptz-date@1',
              typeParams: { precision: 3 },
            },
          }),
          col('tgid', 'int8', {
            notNull: true,
            codecRef: { codecId: 'pg/int8@1' },
          }),
        ],
        constraints: [primaryKey(['tgid'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Chat',
        constraint: 'Chat_id_tgId_key',
        columns: ['id', 'tgId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Chat',
        constraint: 'Chat_tgId_userId_key',
        columns: ['tgId', 'userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_connId_key',
        columns: ['connId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Chat',
        index: 'Chat_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Message',
        index: 'Message_chatId_tgChatId_idx_0974307c',
        columns: ['chatId', 'tgChatId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Message',
        index: 'Message_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Chat',
        foreignKey: {
          name: 'Chat_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['tgid'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Message',
        foreignKey: {
          name: 'Message_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['tgid'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Message',
        foreignKey: {
          name: 'Message_chatId_tgChatId_fkey',
          columns: ['chatId', 'tgChatId'],
          references: {
            schema: 'public',
            table: 'Chat',
            columns: ['id', 'tgId'],
          },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, '..', 'data.json');

function toMySQLDateTime(value) {
  if (!value) {
    return null;
  }

  return value
    .replace('T', ' ')
    .replace('Z', '');
}

const data = JSON.parse(
  fs.readFileSync(dataFile, 'utf-8')
);

const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

try {
  console.log('[Migration] 开始迁移 data.json → MySQL');

  const [[userCount]] = await connection.query(
    'SELECT COUNT(*) AS total FROM users'
  );

  const [[exhibitCount]] = await connection.query(
    'SELECT COUNT(*) AS total FROM exhibits'
  );

  const [[likeCount]] = await connection.query(
    'SELECT COUNT(*) AS total FROM like_records'
  );

  if (
    userCount.total > 0 ||
    exhibitCount.total > 0 ||
    likeCount.total > 0
  ) {
    throw new Error(
      'MySQL 数据表不是空的，为避免覆盖已有数据，迁移已停止。'
    );
  }

  await connection.beginTransaction();

  for (const user of data.users) {
    await connection.execute(
      `
      INSERT INTO users (
        id,
        username,
        email,
        password_hash,
        role,
        avatar_url,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user.id,
        user.username,
        user.email,
        user.password_hash,
        user.role,
        user.avatar_url || null,
        toMySQLDateTime(user.created_at),
      ]
    );
  }

  console.log(
    `[Migration] users: ${data.users.length} 条`
  );

  for (const exhibit of data.exhibits) {
    await connection.execute(
      `
      INSERT INTO exhibits (
        id,
        title,
        description,
        creator_id,
        creator_name,
        category,
        tags,
        \`usage\`,
        model_url,
        thumbnail_url,
        status,
        likes,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        exhibit.id,
        exhibit.title,
        exhibit.description || '',
        exhibit.creator_id,
        exhibit.creator_name,
        exhibit.category,
        JSON.stringify(exhibit.tags || []),
        JSON.stringify(exhibit.usage || []),
        exhibit.model_url || '',
        exhibit.thumbnail_url || '',
        exhibit.status || 'pending',
        exhibit.likes || 0,
        toMySQLDateTime(exhibit.created_at),
      ]
    );
  }

  console.log(
    `[Migration] exhibits: ${data.exhibits.length} 条`
  );

  const userIds = new Set(
  data.users.map(user => Number(user.id))
);

const exhibitIds = new Set(
  data.exhibits.map(exhibit => Number(exhibit.id))
);

let migratedLikeCount = 0;
let skippedLikeCount = 0;

for (const record of data.likeRecords ?? []) {
  const userId = Number(record.user_id);
  const exhibitId = Number(record.exhibit_id);

  if (
    !userIds.has(userId) ||
    !exhibitIds.has(exhibitId)
  ) {
    console.warn(
      `[Migration] 跳过无效点赞记录：user_id=${userId}, exhibit_id=${exhibitId}`
    );

    skippedLikeCount++;
    continue;
  }

  await connection.execute(
    `
      INSERT INTO like_records (
        user_id,
        exhibit_id
      )
      VALUES (?, ?)
    `,
    [
      userId,
      exhibitId
    ]
  );

  migratedLikeCount++;
}

console.log(
  `[Migration] 有效点赞记录：${migratedLikeCount} 条`
);

console.log(
  `[Migration] 跳过无效点赞记录：${skippedLikeCount} 条`
);

  console.log(
    `[Migration] like_records: ${(data.likeRecords || []).length} 条`
  );

  await connection.commit();

  console.log('[Migration] 数据迁移成功 ✅');
} catch (error) {
  await connection.rollback();

  console.error('[Migration] 数据迁移失败 ❌');
  console.error(error);

  process.exitCode = 1;
} finally {
  await connection.end();
}

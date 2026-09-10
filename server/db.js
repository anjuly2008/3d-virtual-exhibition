import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'mart_community_3d',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
  charset: 'utf8mb4'
});

function parseJsonField(value, fallback = []) {
  if (Array.isArray(value)) return value;

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  return value ?? fallback;
}

function toIsoDateTime(value) {
  if (!value) return new Date().toISOString();

  if (value instanceof Date) {
    return value.toISOString();
  }

  const text = String(value);

  if (text.includes('T')) {
    return text.endsWith('Z') ? text : `${text}Z`;
  }

  return `${text.replace(' ', 'T')}Z`;
}

function toMySqlDateTime(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);

  const pad = number =>
    String(number).padStart(2, '0');

  return `${date.getUTCFullYear()}-${pad(
    date.getUTCMonth() + 1
  )}-${pad(
    date.getUTCDate()
  )} ${pad(
    date.getUTCHours()
  )}:${pad(
    date.getUTCMinutes()
  )}:${pad(
    date.getUTCSeconds()
  )}.${String(
    date.getUTCMilliseconds()
  ).padStart(3, '0')}`;
}

function normalizeUser(row) {
  if (!row) return null;

  return {
    id: Number(row.id),
    username: row.username,
    email: row.email,
    password_hash: row.password_hash,
    role: row.role,
    avatar_url: row.avatar_url ?? null,
    created_at: toIsoDateTime(row.created_at)
  };
}

function safeUser(row) {
  const user = normalizeUser(row);

  if (!user) return null;

  const {
    password_hash: _,
    ...safe
  } = user;

  return safe;
}

function normalizeExhibit(row) {
  if (!row) return null;

  const exhibit = {
    id: Number(row.id),
    title: row.title,
    description: row.description ?? '',
    creator_id: Number(row.creator_id),
    creator_name: row.creator_name,
    category: row.category,
    tags: parseJsonField(row.tags),
    usage: parseJsonField(row.usage),
    model_url: row.model_url ?? '',
    thumbnail_url: row.thumbnail_url ?? '',
    status: row.status,
    likes: Number(row.likes ?? 0),
    created_at: toIsoDateTime(row.created_at)
  };

  if (
    Object.prototype.hasOwnProperty.call(
      row,
      'creator_avatar'
    )
  ) {
    exhibit.creator_avatar =
      row.creator_avatar ?? null;
  }

  return exhibit;
}

function jsonParam(value) {
  return JSON.stringify(
    Array.isArray(value) ? value : []
  );
}

const db = {
  users: {
    async create({
      username,
      email,
      password_hash,
      role = 'user'
    }) {
      const [result] =
        await pool.execute(
          `
          INSERT INTO users (
            username,
            email,
            password_hash,
            role,
            avatar_url,
            created_at
          )
          VALUES (?, ?, ?, ?, NULL, ?)
          `,
          [
            username,
            email,
            password_hash,
            role,
            toMySqlDateTime()
          ]
        );

      return safeUser(
        await this.findByIdRaw(
          Number(result.insertId)
        )
      );
    },

    async findByEmail(email) {
      const [rows] =
        await pool.execute(
          `
          SELECT
            id,
            username,
            email,
            password_hash,
            role,
            avatar_url,
            created_at
          FROM users
          WHERE email = ?
          LIMIT 1
          `,
          [email]
        );

      return normalizeUser(
        rows[0] || null
      );
    },

    async findById(id) {
      return safeUser(
        await this.findByIdRaw(id)
      );
    },

    async findByIdRaw(id) {
      const [rows] =
        await pool.execute(
          `
          SELECT
            id,
            username,
            email,
            password_hash,
            role,
            avatar_url,
            created_at
          FROM users
          WHERE id = ?
          LIMIT 1
          `,
          [Number(id)]
        );

      return normalizeUser(
        rows[0] || null
      );
    },

    async updateAvatar(
      id,
      avatar_url
    ) {
      const [result] =
        await pool.execute(
          `
          UPDATE users
          SET avatar_url = ?
          WHERE id = ?
          `,
          [
            avatar_url,
            Number(id)
          ]
        );

      if (result.affectedRows === 0) {
        return null;
      }

      return this.findById(id);
    },

    async all() {
      const [rows] =
        await pool.execute(
          `
          SELECT
            id,
            username,
            email,
            role,
            avatar_url,
            created_at
          FROM users
          ORDER BY id ASC
          `
        );

      return rows.map(
        row => safeUser(row)
      );
    },

    async updateRole(
      id,
      role
    ) {
      const [result] =
        await pool.execute(
          `
          UPDATE users
          SET role = ?
          WHERE id = ?
          `,
          [
            role,
            Number(id)
          ]
        );

      return result.affectedRows > 0;
    },

    async count() {
      const [rows] =
        await pool.execute(
          `
          SELECT COUNT(*) AS total
          FROM users
          `
        );

      return Number(
        rows[0]?.total ?? 0
      );
    }
  },

  exhibits: {
    async create({
      title,
      description,
      creator_id,
      creator_name,
      category,
      tags,
      usage,
      model_url,
      thumbnail_url
    }) {
      const [result] =
        await pool.execute(
          `
          INSERT INTO exhibits (
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
          VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            'pending',
            0,
            ?
          )
          `,
          [
            title,
            description || '',
            Number(creator_id),
            creator_name,
            category,
            jsonParam(tags),
            jsonParam(usage),
            model_url || '',
            thumbnail_url || '',
            toMySqlDateTime()
          ]
        );

      return this.findById(
        Number(result.insertId)
      );
    },

    async findApproved(
      category,
      search,
      tags,
      usage
    ) {
      const [rows] =
        await pool.execute(
          `
          SELECT
            e.id,
            e.title,
            e.description,
            e.creator_id,
            e.creator_name,
            e.category,
            e.tags,
            e.\`usage\`,
            e.model_url,
            e.thumbnail_url,
            e.status,
            e.likes,
            e.created_at,
            u.avatar_url AS creator_avatar
          FROM exhibits e
          LEFT JOIN users u
            ON u.id = e.creator_id
          WHERE e.status = 'approved'
          ORDER BY e.created_at DESC
          `
        );

      let list =
        rows.map(
          normalizeExhibit
        );

      if (category) {
        list =
          list.filter(
            exhibit =>
              exhibit.category === category
          );
      }

      if (
        Array.isArray(tags) &&
        tags.length > 0
      ) {
        list =
          list.filter(
            exhibit =>
              tags.every(
                tag =>
                  (exhibit.tags || [])
                    .includes(tag)
              )
          );
      }

      if (
        Array.isArray(usage) &&
        usage.length > 0
      ) {
        list =
          list.filter(
            exhibit =>
              usage.every(
                item =>
                  (exhibit.usage || [])
                    .includes(item)
              )
          );
      }

      if (search) {
        const normalize =
          value =>
            String(value || '')
              .toLowerCase()
              .replace(/\s+/g, '');

        const s =
          normalize(search);

        list =
          list.filter(
            exhibit =>
              normalize(
                exhibit.description
              ).includes(s) ||

              normalize(
                exhibit.category
              ).includes(s) ||

              (exhibit.tags || [])
                .some(tag =>
                  normalize(tag)
                    .includes(s)
                ) ||

              (exhibit.usage || [])
                .some(item =>
                  normalize(item)
                    .includes(s)
                )
          );
      }

      return {
        exhibits: list,
        total: list.length
      };
    },

    async findAllByStatus(
      status,
      page = 1,
      limit = 20
    ) {
      const safeLimit =
        Math.max(
          1,
          Number(limit) || 20
        );

      const safePage =
        Math.max(
          1,
          Number(page) || 1
        );

      const offset =
        (safePage - 1) *
        safeLimit;

      let sql = `
        SELECT
          e.id,
          e.title,
          e.description,
          e.creator_id,
          e.creator_name,
          e.category,
          e.tags,
          e.\`usage\`,
          e.model_url,
          e.thumbnail_url,
          e.status,
          e.likes,
          e.created_at
        FROM exhibits e
      `;

      const params = [];

      if (status) {
        sql += `
          WHERE e.status = ?
        `;

        params.push(status);
      }

      sql += `
        ORDER BY e.created_at DESC
        LIMIT ?
        OFFSET ?
      `;

      params.push(
        safeLimit,
        offset
      );

      const [rows] =
        await pool.execute(
          sql,
          params
        );

      let countSql = `
        SELECT COUNT(*) AS total
        FROM exhibits
      `;

      const countParams = [];

      if (status) {
        countSql += `
          WHERE status = ?
        `;

        countParams.push(
          status
        );
      }

      const [countRows] =
        await pool.execute(
          countSql,
          countParams
        );

      return {
        exhibits:
          rows.map(
            normalizeExhibit
          ),

        total:
          Number(
            countRows[0]?.total ?? 0
          )
      };
    },

    async findByCreatorId(id) {
      const [rows] =
        await pool.execute(
          `
          SELECT
            e.id,
            e.title,
            e.description,
            e.creator_id,
            e.creator_name,
            e.category,
            e.tags,
            e.\`usage\`,
            e.model_url,
            e.thumbnail_url,
            e.status,
            e.likes,
            e.created_at,
            u.avatar_url AS creator_avatar
          FROM exhibits e
          LEFT JOIN users u
            ON u.id = e.creator_id
          WHERE e.creator_id = ?
          ORDER BY e.created_at DESC
          `,
          [Number(id)]
        );

      return rows.map(
        normalizeExhibit
      );
    },

    async findById(id) {
      const [rows] =
        await pool.execute(
          `
          SELECT
            e.id,
            e.title,
            e.description,
            e.creator_id,
            e.creator_name,
            e.category,
            e.tags,
            e.\`usage\`,
            e.model_url,
            e.thumbnail_url,
            e.status,
            e.likes,
            e.created_at,
            u.avatar_url AS creator_avatar
          FROM exhibits e
          LEFT JOIN users u
            ON u.id = e.creator_id
          WHERE e.id = ?
          LIMIT 1
          `,
          [Number(id)]
        );

      return normalizeExhibit(
        rows[0] || null
      );
    },

    async update(
      id,
      updates
    ) {
      const allowedFields = [
        'title',
        'description',
        'creator_name',
        'category',
        'tags',
        'usage',
        'model_url',
        'thumbnail_url',
        'status',
        'likes'
      ];

      const setParts = [];
      const params = [];

      for (
        const field
        of allowedFields
      ) {
        if (
          !Object.prototype.hasOwnProperty.call(
            updates,
            field
          )
        ) {
          continue;
        }

        if (
          field === 'tags' ||
          field === 'usage'
        ) {
          setParts.push(
            `\`${field}\` = ?`
          );

          params.push(
            jsonParam(
              updates[field]
            )
          );
        } else {
          setParts.push(
            `\`${field}\` = ?`
          );

          params.push(
            updates[field]
          );
        }
      }

      if (
        setParts.length === 0
      ) {
        return this.findById(id);
      }

      params.push(
        Number(id)
      );

      const [result] =
        await pool.execute(
          `
          UPDATE exhibits
          SET ${setParts.join(', ')}
          WHERE id = ?
          `,
          params
        );

      if (
        result.affectedRows === 0
      ) {
        return null;
      }

      return this.findById(id);
    },

    async delete(id) {
      const [result] =
        await pool.execute(
          `
          DELETE FROM exhibits
          WHERE id = ?
          `,
          [Number(id)]
        );

      return result.affectedRows > 0;
    },

    async findLikedByUserId(
      userId
    ) {
      const [rows] =
        await pool.execute(
          `
          SELECT
            e.id,
            e.title,
            e.description,
            e.creator_id,
            e.creator_name,
            e.category,
            e.tags,
            e.\`usage\`,
            e.model_url,
            e.thumbnail_url,
            e.status,
            e.likes,
            e.created_at,
            u.avatar_url AS creator_avatar
          FROM like_records lr
          INNER JOIN exhibits e
            ON e.id = lr.exhibit_id
          LEFT JOIN users u
            ON u.id = e.creator_id
          WHERE lr.user_id = ?
          ORDER BY e.created_at DESC
          `,
          [Number(userId)]
        );

      return rows.map(
        normalizeExhibit
      );
    },

    async getLikers(
      exhibitId
    ) {
      const [rows] =
        await pool.execute(
          `
          SELECT
            u.id,
            u.username,
            u.email,
            u.role,
            u.avatar_url,
            u.created_at
          FROM like_records lr
          INNER JOIN users u
            ON u.id = lr.user_id
          WHERE lr.exhibit_id = ?
          ORDER BY u.id ASC
          `,
          [Number(exhibitId)]
        );

      return rows.map(
        row => safeUser(row)
      );
    },

    async hasLiked(
      userId,
      exhibitId
    ) {
      const [rows] =
        await pool.execute(
          `
          SELECT 1
          FROM like_records
          WHERE user_id = ?
            AND exhibit_id = ?
          LIMIT 1
          `,
          [
            Number(userId),
            Number(exhibitId)
          ]
        );

      return rows.length > 0;
    },

    async like(
      userId,
      exhibitId
    ) {
      const connection =
        await pool.getConnection();

      const uid =
        Number(userId);

      const eid =
        Number(exhibitId);

      try {
        await connection.beginTransaction();

        const [exhibitRows] =
          await connection.execute(
            `
            SELECT id
            FROM exhibits
            WHERE id = ?
            FOR UPDATE
            `,
            [eid]
          );

        if (
          exhibitRows.length === 0
        ) {
          await connection.rollback();
          return null;
        }

        const [likeRows] =
          await connection.execute(
            `
            SELECT 1
            FROM like_records
            WHERE user_id = ?
              AND exhibit_id = ?
            LIMIT 1
            `,
            [
              uid,
              eid
            ]
          );

        if (
          likeRows.length > 0
        ) {
          await connection.execute(
            `
            DELETE FROM like_records
            WHERE user_id = ?
              AND exhibit_id = ?
            `,
            [
              uid,
              eid
            ]
          );

          await connection.execute(
            `
            UPDATE exhibits
            SET likes =
              GREATEST(likes - 1, 0)
            WHERE id = ?
            `,
            [eid]
          );

          await connection.commit();

          return {
            exhibit:
              await this.findById(eid),

            liked: false
          };
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
            uid,
            eid
          ]
        );

        await connection.execute(
          `
          UPDATE exhibits
          SET likes = likes + 1
          WHERE id = ?
          `,
          [eid]
        );

        await connection.commit();

        return {
          exhibit:
            await this.findById(eid),

          liked: true
        };
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    },

    async count() {
      const [rows] =
        await pool.execute(
          `
          SELECT COUNT(*) AS total
          FROM exhibits
          `
        );

      return Number(
        rows[0]?.total ?? 0
      );
    },

    async countByStatus(
      status
    ) {
      const [rows] =
        await pool.execute(
          `
          SELECT COUNT(*) AS total
          FROM exhibits
          WHERE status = ?
          `,
          [status]
        );

      return Number(
        rows[0]?.total ?? 0
      );
    }
  }
};

export { pool };

export default db;
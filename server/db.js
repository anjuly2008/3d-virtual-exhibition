import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';


// ============================================================
// 数据库文件路径
// ============================================================

const __dirname =
  path.dirname(fileURLToPath(import.meta.url));

const dbFile =
  path.join(__dirname, '..', 'data.json');


// 当前内存中的数据
let data = {
  users: [],
  exhibits: [],
  likeRecords: []
};


// ============================================================
// 读取 data.json
// ============================================================

function load() {

  try {

    if (fs.existsSync(dbFile)) {

      data = JSON.parse(
        fs.readFileSync(
          dbFile,
          'utf-8'
        )
      );

    }

  } catch {

    data = {
      users: [],
      exhibits: []
    };

  }
}


// ============================================================
// 保存 data.json
// ============================================================

function save() {

  fs.writeFileSync(
    dbFile,
    JSON.stringify(data, null, 2)
  );

}


// ============================================================
// 初始化数据库
// ============================================================

load();
if (!Array.isArray(data.likeRecords)) {
  data.likeRecords = [];
}


// 确保 tags 和 usage 一定是数组
data.exhibits.forEach(exhibit => {

  if (!Array.isArray(exhibit.tags)) {
    exhibit.tags = [];
  }

  if (!Array.isArray(exhibit.usage)) {
    exhibit.usage = [];
  }

});

save();


// ============================================================
// 创建管理员账号
// ============================================================

const existing =
  data.users.find(
    u => u.role === 'admin'
  );


if (!existing) {

  const hash =
    bcrypt.hashSync(
      'admin123',
      10
    );


  data.users.push({

    id: 1,

    username: 'admin',

    email: 'admin@3dshow.com',

    password_hash: hash,

    role: 'admin',

    avatar_url: null,

    created_at:
      new Date().toISOString(),

  });


  save();

  console.log(
    '[DB] Admin account created: admin / admin123'
  );

}


// ============================================================
// 自动生成 ID
// ============================================================

let nextUserId =
  data.users.length > 0
    ? Math.max(...data.users.map(u => u.id)) + 1
    : 1;


let nextExhibitId =
  data.exhibits.length > 0
    ? Math.max(...data.exhibits.map(e => e.id)) + 1
    : 1;


// ============================================================
// 数据库对象
// ============================================================

const db = {

  // ==========================================================
  // 用户模块
  // ==========================================================

  users: {

    // 创建用户
    create({
      username,
      email,
      password_hash,
      role = 'user'
    }) {

      const user = {

        id: nextUserId++,

        username,

        email,

        password_hash,

        role,

        avatar_url: null,

        created_at:
          new Date().toISOString(),

      };


      data.users.push(user);

      save();


      // 不把密码返回给前端
      const {
        password_hash: _,
        ...safe
      } = user;


      return safe;
    },


    // 根据邮箱查找用户
    findByEmail(email) {

      return (
        data.users.find(
          u => u.email === email
        ) || null
      );

    },


    // 根据 ID 查找用户
    findById(id) {

      const u =
        data.users.find(
          u => u.id === id
        );


      if (!u) {
        return null;
      }


      const {
        password_hash: _,
        ...safe
      } = u;


      return safe;
    },


    // 根据 ID 获取原始用户数据
    findByIdRaw(id) {

      return (
        data.users.find(
          u => u.id === id
        ) || null
      );

    },


    // 修改用户头像
    updateAvatar(id, avatar_url) {

      const u =
        data.users.find(
          u => u.id === id
        );

      if (!u) {
        return null;
      }

      u.avatar_url = avatar_url;

      save();

      const {
        password_hash: _,
        ...safe
      } = u;

      return safe;

    },


    // 获取所有用户
    all() {

      return data.users.map(
        ({
          password_hash: _,
          ...safe
        }) => safe
      );

    },

    // 修改用户权限
    updateRole(id, role) {

      const u =
        data.users.find(
          u => u.id === id
        );


      if (u) {

        u.role = role;

        save();

        return true;

      }


      return false;
    },


    // 用户数量
    count() {

      return data.users.length;

    },

  },


  // ==========================================================
  // 作品模块
  // ==========================================================

  exhibits: {

    // --------------------------------------------------------
    // 创建作品
    // --------------------------------------------------------

    create({
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

      const exhibit = {

        id: nextExhibitId++,

        title,

        description:
          description || '',

        creator_id,

        creator_name,

        category,

        tags:
          tags || [],

        usage:
          usage || [],

        model_url:
          model_url || '',

        thumbnail_url:
          thumbnail_url || '',

        status:
          'pending',

        likes:
          0,

        created_at:
          new Date().toISOString(),

      };


      data.exhibits.push(exhibit);

      save();


      return exhibit;

    },


    // --------------------------------------------------------
    // 获取审核通过的作品
    // --------------------------------------------------------

    findApproved(
      category,
      search,
      tags,
      usage
    ) {

      // 先获取所有已审核作品
      let list =
        data.exhibits

          .filter(
            e => e.status === 'approved'
          )

          // 最新作品排在前面
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime()
              -
              new Date(a.created_at).getTime()
          );


      // ------------------------------------------------------
      // 分类筛选
      // ------------------------------------------------------

      if (category) {

        list =
          list.filter(
            e => e.category === category
          );

      }


      // ------------------------------------------------------
      // 标签筛选
      // ------------------------------------------------------

      if (
        tags &&
        tags.length > 0
      ) {

        list =
          list.filter(
            e =>
              tags.every(
                tag =>
                  (e.tags || []).includes(tag)
              )
          );

      }


      // ------------------------------------------------------
      // 用途筛选
      // ------------------------------------------------------

      if (
        usage &&
        usage.length > 0
      ) {

        list =
          list.filter(
            e =>
              usage.every(
                item =>
                  (e.usage || []).includes(item)
              )
          );

      }


      // ------------------------------------------------------
      // 全局搜索
      // 搜索：分类、标签、用途、描述
      // ------------------------------------------------------

      if (search) {

        // 去掉空格 + 转小写
        const normalize =
          (value) =>
            String(value || '')
              .toLowerCase()
              .replace(/\s+/g, '');


        const s =
          normalize(search);


        list =
          list.filter(
            e =>

              // 描述
              normalize(e.description)
                .includes(s)

              ||

              // 分类
              normalize(e.category)
                .includes(s)

              ||

              // 标签
              (e.tags || []).some(
                tag =>
                  normalize(tag)
                    .includes(s)
              )

              ||

              // 用途
              (e.usage || []).some(
                item =>
                  normalize(item)
                    .includes(s)
              )

          );

      }


      // ------------------------------------------------------
      // 给作品补充作者头像
      // ------------------------------------------------------

      const enriched =
        list.map(e => ({

          ...e,

          creator_avatar:
            db.users.findById(
              e.creator_id
            )?.avatar_url || null

        }));


      // ------------------------------------------------------
      // 返回筛选后的全部作品
      // ------------------------------------------------------

      return {

        exhibits:
          enriched,

        total:
          enriched.length

      };

    },


    // --------------------------------------------------------
    // 查看待审核作品
    // 注意：这里保留分页，因为它属于管理员审核列表
    // --------------------------------------------------------

    findAllByStatus(
      status,
      page = 1,
      limit = 20
    ) {

      let list =
        data.exhibits

          .filter(
            e =>
              !status ||
              e.status === status
          )

          .sort(
            (a, b) =>
              new Date(b.created_at).getTime()
              -
              new Date(a.created_at).getTime()
          );


      const total =
        list.length;


      const items =
        list.slice(
          (page - 1) * limit,
          page * limit
        );


      return {
        exhibits: items,
        total
      };

    },

    findByCreatorId(id) {
      return data.exhibits
        .filter(e => e.creator_id === id)
        .map(e => ({
          ...e,
          creator_avatar: db.users.findById(e.creator_id)?.avatar_url || null
        }));
    },

    // --------------------------------------------------------
    // 获取单个作品
    // --------------------------------------------------------

    findById(id) {

      const e =
        data.exhibits.find(
          e => e.id === id
        );


      if (!e) {
        return null;
      }


      return {

        ...e,

        creator_avatar:
          db.users.findById(
            e.creator_id
          )?.avatar_url || null

      };

    },

    
    
    // --------------------------------------------------------
    // 修改作品
    // --------------------------------------------------------

    update(id, updates) {

      const idx =
        data.exhibits.findIndex(
          e => e.id === id
        );


      if (idx === -1) {
        return null;
      }


      Object.assign(
        data.exhibits[idx],
        updates
      );


      save();


      return data.exhibits[idx];

    },


    // --------------------------------------------------------
    // 删除作品
    // --------------------------------------------------------

    delete(id) {

      const idx =
        data.exhibits.findIndex(
          e => e.id === id
        );


      if (idx === -1) {
        return false;
      }


      data.exhibits.splice(
        idx,
        1
      );


      save();


      return true;

    },

    findLikedByUserId(userId) {
      return data.likeRecords
        .filter(record => record.user_id === userId)
        .map(record => {
          const exhibit = data.exhibits.find(e => e.id === record.exhibit_id);

          if (!exhibit) {
            return null;
          }

          return {
            ...exhibit,
            creator_avatar: db.users.findById(exhibit.creator_id)?.avatar_url || null
          };
        })
        .filter(Boolean);
    },

      // 查询当前用户是否已经点赞
        hasLiked(userId, exhibitId) {

            return data.likeRecords.some(
                record =>
                    record.user_id === userId &&
                    record.exhibit_id === exhibitId
            );

        },

   // --------------------------------------------------------
   // 点赞 / 取消点赞
   // --------------------------------------------------------

        like(userId, exhibitId) {

          // 根据作品 ID 找到作品
          const exhibit =
            data.exhibits.find(
              e => e.id === exhibitId
            );

          // 作品不存在
          if (!exhibit) {
            return null;
          }


          // 查找当前用户是否已经给这个作品点过赞
          const likeIndex =
            data.likeRecords.findIndex(
              record =>
                record.user_id === userId &&
                record.exhibit_id === exhibitId
            );


      // ======================================================
      // 已经点过 → 取消点赞
      // ======================================================

      if (likeIndex !== -1) {

        // 删除这条点赞记录
        data.likeRecords.splice(
          likeIndex,
          1
        );

        // 点赞数量 -1
        exhibit.likes = Math.max(
          0,
          exhibit.likes - 1
        );

        // 保存到 data.json
        save();

        return {
          exhibit,
          liked: false
        };
      }


      // ======================================================
      // 没点过 → 添加点赞
      // ======================================================

      data.likeRecords.push({
        user_id: userId,
        exhibit_id: exhibitId
      });

      // 点赞数量 +1
      exhibit.likes++;

      // 保存到 data.json
      save();

      return {
        exhibit,
        liked: true
      };
    },


    // --------------------------------------------------------
    // 作品总数
    // --------------------------------------------------------

    count() {

      return data.exhibits.length;

    },


    // --------------------------------------------------------
    // 根据状态统计作品数量
    // --------------------------------------------------------

    countByStatus(status) {

      return data.exhibits.filter(
        e => e.status === status
      ).length;

    },

  },

};


export default db;
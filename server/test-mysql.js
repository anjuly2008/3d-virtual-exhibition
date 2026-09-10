import 'dotenv/config';
//读取你的 server/.env 文件
import mysql from 'mysql2/promise';
//引入 MySQL 驱动

const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});
//让 Node.js 按照下面的配置连接 MySQL

const [rows] = await connection.query('SELECT 1 AS result');

console.log('[MySQL Test]', rows);

await connection.end();
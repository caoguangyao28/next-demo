import {defineConfig} from "drizzle-kit";
import {config} from 'dotenv';

config({
  path: '.env.local',
});

// 调试输出环境变量
console.log("POSTGRES_URL:", process.env.POSTGRES_URL);

export default defineConfig({
  schema: "./src/server/schema.ts",
  out: "./src/server/migrations", // 确保这是有效的文件夹路径
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});

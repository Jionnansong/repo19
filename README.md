# Member Management System (MemberHub)

A professional, full-stack Member Management System built with Node.js and Vue 3.

## 🛠 技术栈
- **Frontend**: Vue 3 + Vite + Tailwind CSS + Element Plus
- **Backend**: Node.js + Express + Sequelize + SQLite
- **Database**: SQLite (100% real DB, zero mock)
- **Containerization**: Single Dockerfile (No docker-compose required)

## 🚀 启动指南 (How to Run)

1. 确保 Docker Desktop 已启动。
2. 在项目根目录执行以下命令构建镜像：
   ```bash
   docker build -t member-system -f environment/Dockerfile .
   ```
3. 运行容器：
   ```bash
   docker run -d -p 3207:3207 --name member-app member-system
   ```
4. 等待容器启动完成。

## 🔗 服务地址 (Services)
- **Frontend & API**: http://localhost:3207
- **Database**: `environment/repo/data/database.sqlite` (In-container)

## 🧪 测试账号
- **Admin**: admin / admin123

---

## 🐳 Docker 交付说明
- 本项目采用多阶段构建，镜像体积小且环境完全隔离。
- 前后端项目已集成在 `environment/repo` 目录下。
- 数据库自动初始化并填充演示数据。

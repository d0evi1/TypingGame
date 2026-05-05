# 打字星球 (Typing Planet)

一款面向儿童的打字练习工具。单机优先的 React 应用，支持多种游戏模式。

## 功能特性

### 🎮 游戏模式

1. **课程学习** - 逐步学习键盘指法，从基准键位开始
2. **拼图游戏** - 通过打字完成拼图，寓教于乐
3. **僵尸防御** - 类似植物大战僵尸的打字游戏，消灭袭来的僵尸
4. **统计面板** - 查看学习进度和打字数据

### ✨ 核心功能

- 👤 **多用户档案** - 支持创建多个用户，独立记录学习进度
- 💰 **金币系统** - 完成关卡获得随机金币奖励（20-70枚）
- 🔥 **连击系统** - 连续正确输入提升连击数
- 📊 **进度追踪** - 记录打字速度、准确率、最大连击等数据
- 🔊 **音效反馈** - 正确/错误/连击/完成等音效提示
- 💾 **本地存储** - 使用 Zustand + localStorage 持久化数据

## 技术栈

- **前端框架**: React 19 + TypeScript 6
- **构建工具**: Vite 8
- **样式方案**: Tailwind CSS 4
- **状态管理**: Zustand 5（带持久化中间件）
- **动画效果**: Framer Motion 12
- **音效处理**: Howler.js
- **图表展示**: Recharts

## 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd TypingGame
```

### 2. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看应用。

### 4. 构建生产版本

```bash
npm run build
```

### 5. 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/           # React 组件
│   ├── courses/         # 课程相关组件
│   ├── dev/             # 开发者工具
│   ├── game/            # 游戏组件（BattleField、TypingPractice）
│   ├── keyboard/        # 虚拟键盘组件
│   ├── profile/         # 用户档案相关组件
│   └── puzzle/          # 拼图游戏组件
├── data/                # 静态数据
│   ├── courses.ts       # 课程和课时数据
│   └── keyboardLayout.ts # 键盘布局和指法映射
├── hooks/               # 自定义 Hooks
│   ├── useTypingGame.ts # 打字游戏核心逻辑
│   └── useZombieGame.ts # 僵尸模式核心逻辑
├── store/               # Zustand 状态管理
│   └── gameStore.ts     # 全局游戏状态
├── types/               # TypeScript 类型定义
│   ├── index.ts        # 通用类型
│   └── zombie.ts        # 僵尸模式类型
├── utils/               # 工具函数
│   └── sound.ts         # 音效处理
├── App.tsx              # 应用主组件
├── main.tsx             # 应用入口
└── index.css            # 全局样式
```

## 游戏模式说明

### 课程学习

包含 4 个课程：
- **键位指法入门** - 学习基准键位（ASDF JKL;）
- **进阶速度训练** - 提升打字速度
- **Python 关键词** - Python 编程常用词汇
- **JavaScript 关键词** - JavaScript 编程常用词汇

### 拼图游戏

- 正确输入字母完成拼图
- 支持连击奖励
- 完成后获得随机金币奖励

### 僵尸防御

- 僵尸从右侧袭来，通过打字发射炮弹消灭
- 僵尸到达防线则游戏结束
- 连击 ≥5 触发三连击，同时攻击 3 个僵尸
- 僵尸类型：
  - **普通僵尸** - 白色，30px/s
  - **快速僵尸** - 黄色，45px/s，体型较小
  - **强壮僵尸** - 红色，24px/s，体型较大，3 点生命值

### 统计面板

- 查看总打字次数、正确率、平均速度
- 使用 Recharts 展示进度图表

## 开发者工具

点击右上角"开发者工具"按钮可：
- 查看当前用户档案
- 重置金币数量
- 导出/导入用户数据

## 音效文件

音效文件应放置在 `/public/sounds/` 目录：
- `correct.mp3` - 正确输入
- `wrong.mp3` - 错误输入
- `combo.mp3` - 触发连击
- `complete.mp3` - 完成关卡
- `fail.mp3` - 游戏失败
- `click.mp3` - 按钮点击

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 类型检查 + 构建生产版本 |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run preview` | 预览生产构建 |

## 许可证

MIT

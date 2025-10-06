# 黄金投资追踪器 (Gold Price Tracker)

一个现代、简约的黄金投资追踪应用，帮助用户管理黄金投资并实时追踪收益。

## 功能特性

- 📊 实时显示国际黄金价格（美元/盎司）和人民币金价（人民币/克）
- 📉 **金价走势图**：自动记录每次获取的金价数据，并以折线图形式展示价格走势
- 💰 追踪黄金持有量和投资成本
- 📈 自动计算当前价值、总收益和收益率
- 📝 输入克数和每克价格，自动计算总成本
- 🔄 一键使用当前金价作为买入价
- 💾 数据本地存储（LocalStorage），无需后端服务器
- 🎨 现代简约的UI设计
- 📱 响应式设计，支持移动端和桌面端

## 技术栈

- React 19 + TypeScript
- Ant Design - UI组件库
- Recharts - 数据可视化图表库
- Vite - 构建工具
- Axios - HTTP请求
- LocalStorage - 数据持久化

## 项目结构

```
GoldPriceTracker/
├── src/
│   ├── components/              # React组件
│   │   ├── Dashboard.tsx        # 仪表盘（显示金价和收益）
│   │   ├── InvestmentForm.tsx   # 投资记录表单
│   │   ├── InvestmentList.tsx   # 投资记录列表
│   │   └── PriceChart.tsx       # 金价走势图
│   ├── services/                # 服务层
│   │   ├── goldService.ts       # 金价获取服务
│   │   ├── storageService.ts    # LocalStorage 服务
│   │   └── priceHistoryService.ts # 价格历史记录服务
│   ├── App.tsx                  # 主应用组件
│   └── main.tsx                 # 应用入口
└── package.json
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 运行项目

```bash
npm run dev
```

应用将在 http://localhost:5173 运行

### 构建生产版本

```bash
npm run build
```

构建后的文件在 `dist` 目录中，可以部署到任何静态文件服务器。

## 🚀 GitHub Pages 自动部署

本项目已配置 GitHub Actions，推送到 `main` 或 `master` 分支后自动构建并部署到 GitHub Pages。

### 快速部署步骤

1. **创建 GitHub 仓库并推送代码**：
```bash
git init
git add .
git commit -m "Initial commit: Gold Price Tracker"
git remote add origin https://github.com/YOUR_USERNAME/GoldPriceTracker.git
git push -u origin main
```

2. **启用 GitHub Pages**：
   - 进入仓库 Settings → Pages
   - Source 选择 `GitHub Actions`

3. **完成！** 每次推送代码会自动部署

详细说明请查看 [DEPLOY.md](./DEPLOY.md)

### 访问网站

部署后访问：`https://YOUR_USERNAME.github.io/GoldPriceTracker/`

## 使用说明

1. **查看实时金价**：应用会自动显示当前的国际金价和人民币金价
2. **查看金价走势**：仪表盘下方会显示金价走势图，展示历史价格数据（最多保存100条记录）
3. **添加投资记录**：
   - 输入购买的黄金克数
   - 输入买入价格（每克），或点击"使用当前金价"按钮
   - 系统自动计算总成本
   - 点击"添加投资记录"保存
4. **查看收益**：系统会自动计算您的持仓价值、总收益和收益率
5. **管理记录**：在投资记录列表中可以查看所有记录，并可以删除不需要的记录

## 数据存储

- 所有投资记录保存在浏览器的 LocalStorage 中
- 金价历史数据也保存在 LocalStorage 中（最多保存100条记录）
- 数据仅存储在本地，不会上传到服务器
- 清除浏览器数据会删除所有投资记录和价格历史

## 🔄 数据刷新

- 金价每5分钟自动刷新一次
- 每次获取金价时，会自动在走势图上添加一个数据点
- 每次添加或删除投资记录后，收益数据会立即更新

## 数据来源

- 黄金价格：[Gold-API](https://api.gold-api.com)
- 汇率数据：[Open Exchange Rates API](https://open.er-api.com)

## 许可证

ISC

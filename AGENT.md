https://api.gold-api.com/price/XAU

样例输出 
{
  "name": "Gold",
  "price": 3922.699951,
  "symbol": "XAU",
  "updatedAt": "2025-10-06T03:26:39Z",
  "updatedAtReadable": "a few seconds ago"
}
-----

### **黄金投资追踪器：前后端需求和技术报告**

#### **一、 项目概述**

该项目旨在开发一个现代、简约的个人黄金投资追踪应用。用户可以输入他们的黄金持有量和成本信息，应用将通过API实时获取国际金价，并自动计算出持仓的当前价值、总收益和收益率。

#### **二、 前端需求与技术**

##### **1. 功能需求**

  * **首页/仪表盘：**
      * 显示用户当前的黄金持有量（克数）。
      * 实时显示当前的国际黄金价格（美元/盎司）。
      * 实时显示持仓总价值（人民币）。
      * 清晰地展示总收益（人民币）和收益率（百分比），使用不同颜色（例如，收益为正时绿色，为负时红色）突出显示。
  * **输入界面：**
      * 用户可以输入买入的克数和总成本。
      * 可以保存和编辑这些数据，方便日后查看。
  * **历史记录（可选）：**
      * 以图表形式展示历史金价走势。
  * **界面设计：**
      * 采用现代、简约的UI风格。
      * 响应式设计，适配桌面和移动设备。
      * 交互流畅，无复杂动画。

##### **2. 技术栈**

  * **框架：** React 或 Vue (任选其一)。
  * **状态管理：** 如果应用逻辑复杂，可考虑 Redux (React) 或 Vuex (Vue)。对于简单应用，可以不引入。
  * **数据获取：** 使用 **Axios** 或原生 **Fetch API** 来调用后端接口获取数据。
  * **UI 组件库：** 考虑到简约设计，可以选用 **Ant Design**、**Element Plus (Vue)** 或 **Chakra UI (React)**。
  * **构建工具：** Vite。

#### **三、 后端需求与技术**

##### **1. 功能需求**

  * **API 接口：**
      * **金价获取接口：**
          * 端点：`/api/gold/price`
          * 方法：GET
          * 功能：调用第三方国际金价API，获取实时黄金价格（美元/盎司）和美元兑人民币汇率，然后返回给前端。
          * 返回数据示例：
            ```json
            {
              "goldPriceUsdOz": 3920.00,
              "exchangeRate": 7.12
            }
            ```
  * **数据存储接口：**
      * **保存投资数据：**
          * 端点：`/api/investments`
          * 方法：POST
          * 功能：接收前端传入的黄金克数和总成本，并将其保存到数据库中。
      * **获取投资数据：**
          * 端点：`/api/investments`
          * 方法：GET
          * 功能：获取已保存的黄金投资数据。

##### **2. 技术栈**

  * **语言：** **TypeScript (TS)**
  * **运行时：** 不使用额外的运行时，可以直接使用 Node.js。
  * **后端框架：** **Express.js** 或 **Koa.js**，它们都是轻量级且灵活的 Node.js 框架。
  * **数据库：** **SQLite**。这是一个文件型数据库，无需独立服务器，非常适合本项目这种简单应用，可以通过 **`sqlite3`** 或 **`better-sqlite3`** 等 npm 包来访问。
  * **数据库ORM（可选）：** **Prisma** 或 **TypeORM**，它们可以帮助你更方便地使用 TypeScript 操作数据库。
  * **API 调用：** 使用 **Axios** 或原生 Node.js 的 **`https`** 模块来调用外部金价 API。

#### **四、 接口设计（假设）**

  * **黄金价格 API 接口**

      * `GET /api/gold/price`
      * 请求：无
      * 响应：`{ "goldPriceUsdOz": number, "exchangeRate": number }`

  * **投资记录 API 接口**

      * `POST /api/investments`
      * 请求体：`{ "grams": number, "totalCostRmb": number }`
      * 响应：`{ "success": boolean, "message": string }`
      * `GET /api/investments`
      * 请求：无
      * 响应：`[ { "id": number, "grams": number, "totalCostRmb": number, "createdAt": string } ]`
-----
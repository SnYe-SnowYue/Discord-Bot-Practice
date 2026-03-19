
Discord-Bot-Practice/
├── .env                        # 環境變數設定檔 (DISCORD_TOKEN / CLIENT_ID / GUILD_ID)
├── .git/                       # Git 版本控制資料
├── .gitignore                  # Git 忽略設定
├── README.md                   # 專案說明與使用方式
├── PROJECT_STRUCTURE.md        # 專案結構說明文件
├── RoadMap.txt                 # 開發規劃/筆記
├── package.json                # Node.js 專案設定 (scripts、dependencies)
├── package-lock.json           # 依賴版本鎖定
├── node_modules/               # npm 安裝套件
└── src/                        # 原始碼目錄
    ├── index.js                # Bot 主程式 (目前直接載入指令與事件處理邏輯)
    ├── deploy-commands.js      # 部署 slash commands 到指定 Guild
    ├── commands/               # 各 slash command 模組
    │   ├── ping.js             # /ping 指令
    │   └── about.js            # /about 指令
    ├── events/                 # 事件模組目錄 (目前檔案為預留)
    │   ├── interactionCreate.js
    │   └── ready.js
    └── handlers/               # 自動載入/註冊邏輯目錄 (目前檔案為預留)
        ├── commandHandler.js
        └── eventHandler.js

備註：
- `src/events/` 與 `src/handlers/` 目前存在，但檔案內容為空，尚未接入 `src/index.js`。
- 目前互動事件 (`InteractionCreate`) 與 `ready` 邏輯都寫在 `src/index.js`。
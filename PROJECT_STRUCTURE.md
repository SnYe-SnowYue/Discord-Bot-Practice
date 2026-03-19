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
    ├── index.js                # Bot 主程式 (建立 client、載入 handlers、登入)
    ├── deploy-commands.js      # 部署 slash commands 到指定 Guild
    ├── commands/               # 各 slash command 模組
    │   ├── ping.js             # /ping 指令
    │   └── about.js            # /about 指令
    ├── events/                 # Discord 事件模組
    │   ├── interactionCreate.js # 互動事件：分派 slash command 並處理錯誤
    │   └── ready.js             # ready 事件：Bot 上線提示
    └── handlers/               # 載入器：自動註冊 commands 與 events
        ├── commandHandler.js    # 掃描並註冊所有指令到 client.commands
        └── eventHandler.js      # 掃描並綁定所有事件監聽

備註：
- 目前專案已採用「handler + event module」架構：
  `src/index.js` 只負責啟動流程，事件邏輯在 `src/events/`，自動載入邏輯在 `src/handlers/`。
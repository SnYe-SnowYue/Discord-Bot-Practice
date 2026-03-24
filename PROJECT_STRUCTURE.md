# PROJECT_STRUCTURE

Discord-Bot-Practice/
├── .env                         # 本機環境變數（不提交）
├── .env.example                 # 環境變數範本
├── .git/                        # Git 版本控制資料
├── .gitignore                   # Git 忽略設定
├── package-lock.json            # 依賴版本鎖定
├── package.json                 # Node.js 專案設定 (scripts、dependencies)
├── PROJECT_STRUCTURE.md         # 專案結構說明文件
├── README.md                    # 專案說明與使用方式
├── RoadMap.txt                  # 開發規劃/筆記
├── node_modules/                # npm 安裝套件
└── src/                         # 原始碼目錄
  ├── deploy-commands.js       # 部署 slash commands 到指定 Guild
  ├── index.js                 # Bot 主程式 (建立 client、載入 handlers、登入)
  ├── commands/                # 各 slash command 模組
  │   ├── about.js             # /about 指令
  │   ├── config.js            # /config 指令 (管理伺服器設定)
  │   ├── mod.js               # /mod 指令 (管理用途)
  │   └── ping.js              # /ping 指令
  ├── events/                  # Discord 事件模組
  │   ├── interactionCreate.js # 互動事件：分派 slash command 並處理錯誤
  │   └── ready.js             # ready 事件：Bot 上線提示
  ├── handlers/                # 載入器：自動註冊 commands 與 events
  │   ├── commandHandler.js    # 掃描並註冊所有指令到 client.commands
  │   └── eventHandler.js      # 掃描並綁定所有事件監聽
  └── utils/                   # 共用工具模組
    └── configStore.js       # 設定資料讀寫與儲存

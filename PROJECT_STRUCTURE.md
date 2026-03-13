
Discord-Bot-Practice/
├── .env                        # 環境變數設定檔 (Token / CLIENT_ID / GUILD_ID)
├── .gitignore                  # Git 忽略設定
├── README.md                   # 專案說明與使用方式
├── PROJECT_STRUCTURE.md        # 專案結構說明文件
├── RoadMap.txt                 # 開發規劃/筆記
├── message.txt:Zone.Identifier # 下載檔附加資訊 (Windows ADS 匯入痕跡)
├── package.json                # Node.js 專案設定 (腳本、依賴)
├── package-lock.json           # 依賴版本鎖定
├── node_modules/               # npm 安裝套件
└── src/                        # 原始碼目錄
    ├── index.js                # Bot 主程式：載入指令、監聽事件、登入
    ├── deploy-commands.js      # 部署 slash commands 到指定 Guild
    └── commands/               # 各 slash command 模組
        ├── ping.js             # /ping 指令
        └── about.js            # /about 指令
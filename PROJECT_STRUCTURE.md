
discord-bot/
├── .env                      # 環境變數設定檔 (存放敏感資訊如 Token)
├── package.json              # Node.js 專案配置檔 (依賴套件、腳本)
├── package-lock.json         # 鎖定依賴套件的版本
├── node_modules/             # npm 安裝的套件目錄
└── src/                      # 原始碼目錄
    ├── index.js              # 機器人主程式 (啟動和事件監聽)
    ├── deploy-commands.js    # 指令註冊程式 (將指令註冊到 Discord)
    └── commands/             # 指令模組目錄
        └── ping.js           # /ping 指令實作
# Discord Bot Practice

使用 `discord.js v14` 建立的 Discord Slash Commands 練習專案。

## 功能

- 自動載入 `src/commands` 內的指令模組
- 透過 `src/deploy-commands.js` 註冊 Guild Slash Commands
- 目前內建指令：
  - `/ping`：回傳 `Pong!`
  - `/about`：顯示機器人資訊

## 環境需求

- Node.js 18+（建議使用 LTS 版本）
- 一個 Discord Application / Bot
- 已邀請 Bot 進入你的測試伺服器（Guild）

## 安裝

```bash
npm install
```

## 環境變數設定

在專案根目錄建立 `.env`，內容如下：

```env
DISCORD_TOKEN=你的BotToken
CLIENT_ID=你的ApplicationID
GUILD_ID=你的測試伺服器ID
```

參數說明：

- `DISCORD_TOKEN`：Bot token，用於登入與 API 呼叫
- `CLIENT_ID`：Discord Application ID
- `GUILD_ID`：要部署指令的目標伺服器 ID

## 指令部署（首次或指令變更後）

```bash
node src/deploy-commands.js
```

成功時會看到：

- `Started refreshing application (/) commands.`
- `✅ Deployed guild commands`

## 啟動機器人

```bash
npm start
```

成功登入時終端機會顯示：

- `Ready! Logged in as <bot-name>#<tag>`

## 專案結構

詳細結構請參考 `PROJECT_STRUCTURE.md`。

## 新增指令方式

1. 在 `src/commands` 新增一個 `.js` 檔案。
2. 匯出 `data`（`SlashCommandBuilder`）與 `execute`。
3. 重新執行 `node src/deploy-commands.js`。
4. 重新啟動 bot（`npm start`）。

範例骨架：

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Say hello'),
  async execute(interaction) {
    await interaction.reply('Hello!');
  },
};
```

## 常見問題

- 指令沒出現：
  - 確認已執行 `node src/deploy-commands.js`
  - 確認 `.env` 的 `CLIENT_ID` / `GUILD_ID` 正確
- Bot 無法登入：
  - 檢查 `DISCORD_TOKEN` 是否有效
  - 確認 `.env` 檔案存在於專案根目錄

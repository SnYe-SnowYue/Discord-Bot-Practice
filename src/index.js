// === Discord 機器人主程式 =====
// 負責：1) 建立 client 2) 載入 handlers 3) 登入 Discord

// 載入 .env 環境變數
require('dotenv').config();

// 引入 discord.js 核心功能
const { Client, GatewayIntentBits } = require('discord.js');

// 引入 handler 模組
const commandHandler = require('./handlers/commandHandler');
const eventHandler = require('./handlers/eventHandler');

// 建立機器人 client
const client = new Client({
  intents: [GatewayIntentBits.Guilds], // 斜線指令最小需求
});

// 載入所有指令
commandHandler(client);

// 載入所有事件
eventHandler(client);

// 使用 .env 裡的 Token 登入 Discord
client.login(process.env.DISCORD_TOKEN);
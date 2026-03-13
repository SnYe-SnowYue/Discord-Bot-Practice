// 載入 .env 環境變數
require('dotenv').config();

// Node.js 內建模組
const fs = require('node:fs');     // 讀取資料夾與檔案
const path = require('node:path'); // 組合路徑

// discord.js REST 與路由工具
const { REST, Routes } = require('discord.js');

// 用來存放所有要部署的 slash commands
const commands = [];

// 找到 src/commands 資料夾
const commandsPath = path.join(__dirname, 'commands');

// 讀出 commands 資料夾裡所有 .js 指令檔
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// 逐一載入指令並轉成 JSON
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  // 檢查指令格式是否正確
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing "data" or "execute".`);
  }
}

// 建立 REST 客戶端，帶入 Bot Token
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// 立即執行部署
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log('✅ Deployed guild commands');
  } catch (error) {
    console.error(error);
  }
})();

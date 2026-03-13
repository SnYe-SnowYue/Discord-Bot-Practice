// === Discord 機器人主程式 =====
// 負責：1) 建立客戶端 2) 載入指令 3) 監聽事件 4) 登入

// 載入 .env 環境變數檔（包含 DISCORD_TOKEN 等敏感資訊）
require('dotenv').config();

// 引入 discord.js 核心功能
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');     // 讀取檔案/資料夾
const path = require('node:path'); // 組合路徑


// 建立機器人客戶端實例
const client = new Client({
  intents: [GatewayIntentBits.Guilds], // 設定機器人權限：接收伺服器相關事件（斜線指令最小需求）
});

// ===== 載入指令模組 =====
// Collection 是 discord.js 提供的 Map 擴充，用來儲存指令
client.commands = new Collection();

// 自動讀取 commands 資料夾內所有 .js 指令檔
const commandsPath = path.join(__dirname, 'commands'); // 組合出 commands 資料夾路徑
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // 只保留 .js 檔案

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file); // 取得每個指令檔完整路徑
  const command = require(filePath); // 載入指令模組

  // 檢查指令格式是否正確
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command); // 存進 Collection
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing "data" or "execute".`);
  }
}


// ===== 事件監聽：機器人準備就緒 =====
// once() 表示只執行一次（登入成功後觸發）
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// ===== 事件監聽：接收使用者互動 =====
// 當使用者執行斜線指令時，Discord 會發送 InteractionCreate 事件
client.on(Events.InteractionCreate, async (interaction) => {
  // 過濾：只處理斜線指令（排除按鈕、選單等其他互動類型）
  if (!interaction.isChatInputCommand()) return;

  // 從 Collection 中取得對應的指令模組
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return; // 找不到指令就忽略

  // 執行指令並處理錯誤
  try {
    await command.execute(interaction); // 呼叫指令模組的 execute 函式
  } catch (err) {
    console.error(err);

    // 錯誤處理：根據互動狀態選擇回覆方式
    // - 已回覆過 → 用 followUp 追加訊息
    // - 未回覆 → 用 reply 首次回覆
    // ephemeral: true 表示只有執行指令的人看得到此訊息
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '指令執行失敗（請看終端機錯誤）。', ephemeral: true });
    } else {
      await interaction.reply({ content: '指令執行失敗（請看終端機錯誤）。', ephemeral: true });
    }
  }
});

// ===== 登入 Discord =====
// 使用 .env 檔案中的 DISCORD_TOKEN 進行身份驗證
client.login(process.env.DISCORD_TOKEN);

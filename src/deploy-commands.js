// ===== Discord 斜線指令註冊程式 =====
// 作用：將指令資訊上傳到 Discord 伺服器，讓使用者可以看到 /ping 等指令
// 執行時機：新增或修改指令時執行一次即可（執行方式：node src/deploy-commands.js）

require('dotenv').config(); // 載入環境變數

const { REST, Routes } = require('discord.js');

// ===== 收集要註冊的指令 =====
// 將 commands 資料夾中的指令模組載入並轉換成 JSON 格式
const pingCommand = require('./commands/ping');
const commands = [
  pingCommand.data.toJSON(), // 只註冊 data 部分（指令定義），不需要 execute 函式
];

// 建立 REST 客戶端，用於與 Discord API 溝通
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// ===== 執行註冊流程 =====
(async () => {
  try {
    console.log('開始註冊斜線指令...');

    // 使用 PUT 方法將指令上傳到指定的 Discord 伺服器（GUILD）
    // PUT 會覆蓋舊的指令列表（不會累積舊指令）
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }, // 上傳的指令陣列
    );

    console.log('✅ 指令註冊成功！');
  } catch (error) {
    console.error('❌ 註冊失敗：', error);
  }
})();

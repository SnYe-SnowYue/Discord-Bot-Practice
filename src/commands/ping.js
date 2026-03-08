// ===== /ping 指令模組 =====
// 這是一個簡單的測試指令，用來確認機器人是否正常運作

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  // ===== data: 指令定義 =====
  // 這部分會被 deploy-commands.js 讀取並註冊到 Discord
  // 決定指令在 Discord 中的顯示名稱、說明、參數等
  data: new SlashCommandBuilder()
    .setName('ping')                // 指令名稱（使用者輸入：/ping）
    .setDescription('測試機器人回應'), // 指令說明（會顯示在 Discord 介面）

  // ===== execute: 指令執行邏輯 =====
  // 當使用者執行 /ping 時，index.js 會呼叫這個函式
  // interaction 參數包含執行指令的使用者、頻道等資訊
  async execute(interaction) {
    // interaction.reply() 用來回應使用者
    await interaction.reply('Pong!');
  },
};
// src/commands/about.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Shows bot info'),
  async execute(interaction) {
    // 先用最小內容：讓你確認指令可正常運作
    await interaction.reply('Hi! I am a discord.js v14 bot. ✅');
  },
};

// src/commands/ticket.js
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('開啟 Ticket 面板'),

  async execute(interaction) {
    // 建立一顆按鈕，讓使用者手動開始開單流程
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket_start') // 之後在 interactionCreate.js 會用到
        .setLabel('🎫 建立 Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: '請點擊下方按鈕開始建立 Ticket。',
      components: [row],
      ephemeral: true, // 先做成只有自己看到，比較方便測試
    });
  },
};
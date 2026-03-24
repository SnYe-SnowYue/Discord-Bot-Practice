// src/commands/ping.js
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('查看 Bot 延遲'),

  async execute(interaction) {
    // 先回一則訊息，並抓到回覆訊息物件
    const reply = await interaction.reply({
      content: '🏓 正在測量延遲...',
      fetchReply: true, // 這樣 reply 會回傳訊息物件
    });

    // round-trip latency：回覆訊息建立時間 - 互動建立時間
    const roundTrip = reply.createdTimestamp - interaction.createdTimestamp;
    const wsPing = interaction.client.ws.ping;
    const wsText = wsPing < 0 ? '測量中' : `${Math.round(wsPing)}ms`;

    // 建立按鈕
    const button = new ButtonBuilder()
      .setCustomId('ping_recheck')
      .setLabel('🔄 再測一次')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    // 更新原本的回覆內容
    await interaction.editReply({
      content:
        `🏓 Bot 回應延遲：${roundTrip}ms\n` +
        `📡 WebSocket 延遲：${wsText}`,
      components: [row],
    });
  },
};
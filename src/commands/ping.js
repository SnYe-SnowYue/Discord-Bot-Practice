const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('查看 Bot 延遲'),

  async execute(interaction) {
    const latency = Date.now() - interaction.createdTimestamp;

    // 建立一顆按鈕，customId 用來識別哪顆按鈕被按
    const button = new ButtonBuilder()
      .setCustomId('ping_recheck')       // 識別用 ID
      .setLabel('🔄 再測一次')
      .setStyle(ButtonStyle.Primary);    // 藍色按鈕

    // ActionRow 是按鈕/選單的容器（Discord 規定必須裝在 Row 裡）
    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      content: `🏓 延遲：${latency}ms`,
      components: [row],   // 把按鈕排附加到訊息
    });
  },
};
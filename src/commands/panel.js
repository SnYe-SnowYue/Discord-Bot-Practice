// src/commands/panel.js
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('顯示控制面板'),

  async execute(interaction) {
    const enableButton = new ButtonBuilder()
      .setCustomId('panel_enable_feature')
      .setLabel('開啟功能')
      .setStyle(ButtonStyle.Success);

    const disableButton = new ButtonBuilder()
      .setCustomId('panel_disable_feature')
      .setLabel('關閉功能')
      .setStyle(ButtonStyle.Danger);

    const buttonRow = new ActionRowBuilder().addComponents(
      enableButton,
      disableButton
    );

    // 建立下拉選單
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('panel_select_category')
      .setPlaceholder('請選擇一個分類')
      .addOptions(
        {
          label: '一般設定',
          description: '查看一般功能面板',
          value: 'general',
        },
        {
          label: '管理設定',
          description: '查看管理功能面板',
          value: 'moderation',
        },
        {
          label: '娛樂設定',
          description: '查看娛樂功能面板',
          value: 'fun',
        }
      );

    const selectRow = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      content: '這是你的控制面板，請用按鈕或選單操作。',
      components: [buttonRow, selectRow],
    });
  },
};
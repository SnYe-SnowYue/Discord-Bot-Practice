// 匯入 Discord.js 需要用到的建構器
const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require('discord.js');

module.exports = {
  // 定義 Slash Command 資料
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('開啟一張新的問題單'),

  // 當使用者執行 /ticket 時會跑這裡
  async execute(interaction) {
    // 建立 Modal（彈出表單）
    const modal = new ModalBuilder()
      .setCustomId('ticket_modal') // 之後送出時靠這個 ID 辨識
      .setTitle('建立 Ticket');

    // 第一個輸入框：問題標題
    const titleInput = new TextInputBuilder()
      .setCustomId('ticket_title')
      .setLabel('請輸入問題標題')
      .setStyle(TextInputStyle.Short) // 單行輸入
      .setPlaceholder('例如：無法使用某功能')
      .setRequired(true);

    // 第二個輸入框：問題內容
    const descriptionInput = new TextInputBuilder()
      .setCustomId('ticket_description')
      .setLabel('請輸入詳細內容')
      .setStyle(TextInputStyle.Paragraph) // 多行輸入
      .setPlaceholder('請描述你遇到的問題')
      .setRequired(true);

    // Discord 規則：每個 TextInput 都要包在自己的 ActionRow
    const firstRow = new ActionRowBuilder().addComponents(titleInput);
    const secondRow = new ActionRowBuilder().addComponents(descriptionInput);

    // 把輸入框加進 Modal
    modal.addComponents(firstRow, secondRow);

    // 顯示 Modal 給使用者
    await interaction.showModal(modal);
  },
};
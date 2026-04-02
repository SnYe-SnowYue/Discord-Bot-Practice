// src/events/interactionCreate.js

const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require('discord.js');

const TICKET_CATEGORY_ID = '1489073540656267344';
const SUPPORT_ROLE_ID = '854569830673809429';

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // =========================
    // 1. 處理 Slash Command
    // =========================
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: '指令執行失敗！',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: '指令執行失敗！',
            ephemeral: true,
          });
        }
      }

      return;
    }

    // =========================
    // 2. 處理 Button
    // =========================
    if (interaction.isButton()) {
      if (interaction.customId === 'ping_recheck') {
        await interaction.deferReply({ ephemeral: true });

        const reply = await interaction.fetchReply();
        const roundTrip = reply.createdTimestamp - interaction.createdTimestamp;

        const wsPing = interaction.client.ws.ping;
        const wsText = wsPing < 0 ? '測量中' : `${Math.round(wsPing)}ms`;

        await interaction.editReply(
          `🏓 重新測量延遲：${roundTrip}ms\n📡 WebSocket 延遲：${wsText}`
        );
        return;
      }

      if (interaction.customId === 'panel_enable_feature') {
        await interaction.reply({
          content: '✅ 功能已開啟（目前先做示範版）',
          ephemeral: true,
        });
        return;
      }

      if (interaction.customId === 'panel_disable_feature') {
        await interaction.reply({
          content: '🛑 功能已關閉（目前先做示範版）',
          ephemeral: true,
        });
        return;
      }

      return;
    }

    // =========================
    // 3. 處理 String Select Menu
    // =========================
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'panel_select_category') {
        const selectedValue = interaction.values[0];

        const categoryMap = {
          general: '一般設定',
          moderation: '管理設定',
          fun: '娛樂設定',
        };

        const categoryName = categoryMap[selectedValue] || '未知分類';

        await interaction.reply({
          content: `你選擇的是：${categoryName}`,
          ephemeral: true,
        });

        return;
      }
    }

    // =========================
    // 4. 處理 Modal Submit
    // =========================
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'ticket_modal') {
        // 取得使用者填寫的內容
        const title = interaction.fields.getTextInputValue('ticket_title');
        const description = interaction.fields.getTextInputValue('ticket_description');

        // 把使用者名稱整理成安全的頻道名稱
        const safeUserName = interaction.user.username
          .toLowerCase()
          .replace(/[^a-z0-9-_]/g, '-');

        const channelName = `ticket-${safeUserName}`;

        // 建立 ticket 頻道
        const ticketChannel = await interaction.guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          parent: TICKET_CATEGORY_ID, // 放進指定分類
          permissionOverwrites: [
            {
              // 預設所有人都看不到
              id: interaction.guild.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              // 開單的人可以看到並發言
              id: interaction.user.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
              ],
            },
            {
              // 支援人員也能看到
              id: SUPPORT_ROLE_ID,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
              ],
            },
          ],
        });

        // 建立一個比較清楚的開場訊息
        const ticketEmbed = new EmbedBuilder()
          .setTitle('🎫 新的 Ticket')
          .setDescription('請在此頻道協助使用者處理問題。')
          .addFields(
            {
              name: '開單者',
              value: `${interaction.user}`,
              inline: true,
            },
            {
              name: '標題',
              value: title,
              inline: true,
            },
            {
              name: '詳細內容',
              value: description,
            }
          )
          .setColor(0x5865F2)
          .setTimestamp();

        // 在 ticket 頻道送出第一則訊息
        await ticketChannel.send({
          content: `${interaction.user} <@&${SUPPORT_ROLE_ID}>`,
          embeds: [ticketEmbed],
        });

        // 建立成功後，先回覆使用者
        await interaction.reply({
          content: `✅ 你的 Ticket 已建立：${ticketChannel}`,
          ephemeral: true,
        });

        return;
      }
    }
  },
};
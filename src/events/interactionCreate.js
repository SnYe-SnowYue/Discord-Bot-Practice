// src/events/interactionCreate.js

const {
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

const TICKET_CATEGORY_ID = '1489073540656267344';
const SUPPORT_ROLE_ID = '854569830673809429';
const creatingTicketUsers = new Set();

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

      if (interaction.customId === 'ticket_start') {
        const row = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('ticket_category_select') // 之後處理分類選擇
            .setPlaceholder('請選擇 Ticket 分類')
            .addOptions(
              {
                label: '一般問題',
                description: '一般使用問題或協助需求',
                value: 'general',
              },
              {
                label: 'Bug 回報',
                description: '回報功能異常或錯誤',
                value: 'bug',
              },
              {
                label: '功能建議',
                description: '提出新功能想法',
                value: 'suggestion',
              }
            )
        );

        await interaction.reply({
          content: '請先選擇 Ticket 分類。',
          components: [row],
          ephemeral: true,
        });

        return;
      }

      if (interaction.customId === 'ticket_close') {
        await interaction.reply({
          content: '🗑️ 這個 Ticket 將在 3 秒後關閉。',
          ephemeral: true,
        });

        setTimeout(async () => {
          try {
            await interaction.channel.delete();
          } catch (error) {
            console.error('刪除 Ticket 頻道失敗：', error);
          }
        }, 3000);

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

      if (interaction.customId === 'ticket_category_select') {
        // 取得使用者選到的分類
        const category = interaction.values[0];

        // 把分類帶進 modal 的 customId，送出時比較好判斷
        const modal = new ModalBuilder()
          .setCustomId(`ticket_modal_${category}`)
          .setTitle('建立 Ticket');

        const titleInput = new TextInputBuilder()
          .setCustomId('ticket_title')
          .setLabel('請輸入問題標題')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('例如：某功能無法使用')
          .setRequired(true);

        const descriptionInput = new TextInputBuilder()
          .setCustomId('ticket_description')
          .setLabel('請輸入詳細內容')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('請盡量描述清楚發生了什麼事')
          .setRequired(true);

        const firstRow = new ActionRowBuilder().addComponents(titleInput);
        const secondRow = new ActionRowBuilder().addComponents(descriptionInput);

        modal.addComponents(firstRow, secondRow);

        await interaction.showModal(modal);
        return;
      }
    }

    // =========================
    // 4. 處理 Modal Submit
    // =========================
    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith('ticket_modal_')) {
        if (creatingTicketUsers.has(interaction.user.id)) {
          await interaction.reply({
            content: '⏳ 你的 Ticket 正在建立中，請稍候再試。',
            ephemeral: true,
          });
          return;
        }

        creatingTicketUsers.add(interaction.user.id);

        try {
        // 從 customId 拆出分類
        const category = interaction.customId.replace('ticket_modal_', '');

        // 把分類代碼轉成可讀名稱
        const categoryMap = {
          general: '一般問題',
          bug: 'Bug 回報',
          suggestion: '功能建議',
        };

        const categoryName = categoryMap[category] || '未知分類';

        // 取得使用者填寫的內容
        const title = interaction.fields.getTextInputValue('ticket_title');
        const description = interaction.fields.getTextInputValue('ticket_description');

        // 把使用者名稱整理成安全的頻道名稱
        const safeUserName = interaction.user.username
          .toLowerCase()
          .replace(/[^a-z0-9-_]/g, '-');

        const channelName = `ticket-${safeUserName}`;

        // 先同步抓最新頻道狀態，避免 cache 延遲導致重複建立
        await interaction.guild.channels.fetch();

        // 建立頻道前先檢查是否已有同名 ticket
        const existingChannel = interaction.guild.channels.cache.find((channel) => {
          if (channel.type !== ChannelType.GuildText) return false;
          return channel.name === channelName;
        });

        if (existingChannel) {
          await interaction.reply({
            content: `⚠️ 你已經有一張 Ticket：${existingChannel}`,
            ephemeral: true,
          });
          return;
        }

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
              name: '分類',
              value: categoryName,
              inline: true,
            },
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

        const closeRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('ticket_close')
            .setLabel('🔒 關閉 Ticket')
            .setStyle(ButtonStyle.Danger)
        );

        // 在 ticket 頻道送出第一則訊息
        await ticketChannel.send({
          content: `${interaction.user} <@&${SUPPORT_ROLE_ID}>`,
          embeds: [ticketEmbed],
          components: [closeRow],
        });

        // 建立成功後，先回覆使用者
        await interaction.reply({
          content: `✅ 你的 Ticket 已建立：${ticketChannel}`,
          ephemeral: true,
        });

        return;
        } finally {
          creatingTicketUsers.delete(interaction.user.id);
        }
      }
    }
  },
};
// src/events/interactionCreate.js
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

      return; // 做完 slash command 就結束
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

        await interaction.reply({
          content: `你選擇的分類是：${selectedValue}`,
          ephemeral: true,
        });
      }

      return;
    }
  },
};
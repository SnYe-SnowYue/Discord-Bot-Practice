// src/events/interactionCreate.js
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Slash Command
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
    }

    // Button
    if (interaction.isButton()) {
      if (interaction.customId === 'ping_recheck') {
        // 先延後回覆，避免超時
        await interaction.deferReply({ ephemeral: true });

        // 取得這次按鈕互動的回覆訊息
        const reply = await interaction.fetchReply();
        const roundTrip = reply.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(
          `🏓 重新測量延遲：${roundTrip}ms\n📡 WebSocket 延遲：${Math.round(interaction.client.ws.ping)}ms`
        );
      }
    }
  },
};
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    // 原本的 slash command 處理（你已有，保留）
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: '指令執行失敗！', ephemeral: true });
      }
    }

    // 新增：處理按鈕互動
    if (interaction.isButton()) {
      if (interaction.customId === 'ping_recheck') {
        const latency = Date.now() - interaction.createdTimestamp;
        // ephemeral: true = 只有按按鈕的人看得到回覆
        await interaction.reply({
          content: `🏓 重新測量延遲：${latency}ms`,
          ephemeral: true,
        });
      }
    }
  },
};
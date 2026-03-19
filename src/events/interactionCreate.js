module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction, client) {
    // 只處理 slash command 類型的互動
    if (!interaction.isChatInputCommand()) return;

    // 從 client.commands Map 裡找對應指令
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`找不到指令：${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      // 若互動尚未回覆，送出錯誤訊息
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '執行指令時發生錯誤！', ephemeral: true });
      } else {
        await interaction.reply({ content: '執行指令時發生錯誤！', ephemeral: true });
      }
    }
  },
};

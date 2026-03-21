const { SlashCommandBuilder } = require('discord.js');
const configStore = require('../utils/configStore');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('設定或查詢目前伺服器的 Bot 設定')
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('設定一個值')
        .addStringOption(option =>
          option
            .setName('key')
            .setDescription('設定名稱，例如 welcome_channel')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('value')
            .setDescription('要儲存的值')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('get')
        .setDescription('取得一個值')
        .addStringOption(option =>
          option
            .setName('key')
            .setDescription('要查詢的設定名稱')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    // 取得 guild ID，確保設定是以伺服器為單位
    const guildId = interaction.guildId;

    // 取得使用者選擇的子命令
    const subcommand = interaction.options.getSubcommand();

    // /config set
    if (subcommand === 'set') {
      const key = interaction.options.getString('key');
      const value = interaction.options.getString('value');

      // 寫入記憶體
      configStore.setConfig(guildId, key, value);

      await interaction.reply({
        content: `✅ 已設定 \`${key}\` = \`${value}\``,
        ephemeral: true,
      });
      return;
    }

    // /config get
    if (subcommand === 'get') {
      const key = interaction.options.getString('key');
      const value = configStore.getValue(guildId, key);

      if (value === undefined) {
        await interaction.reply({
          content: `⚠️ 找不到設定：\`${key}\``,
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: `📦 目前 \`${key}\` = \`${value}\``,
        ephemeral: true,
      });
    }
  },
};
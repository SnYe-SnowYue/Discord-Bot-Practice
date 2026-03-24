// src/commands/mod.js

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('管理員專用指令')
    // 整個 /mod 指令都需要「管理訊息」權限才能使用
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    
    // 子指令 1：purge（清除訊息）
    .addSubcommand(sub =>
      sub
        .setName('purge')
        .setDescription('批量刪除訊息')
        .addIntegerOption(opt =>
          opt
            .setName('amount')
            .setDescription('要刪除幾則（1～100）')
            .setRequired(true)
            .setMinValue(1)     // 防呆：最少 1 則
            .setMaxValue(100)   // 防呆：最多 100 則
        )
    )
    
    // 子指令 2：timeout（禁言用戶）
    .addSubcommand(sub =>
      sub
        .setName('timeout')
        .setDescription('禁言指定用戶')
        .addUserOption(opt =>
          opt
            .setName('target')
            .setDescription('要禁言的用戶')
            .setRequired(true)
        )
        .addIntegerOption(opt =>
          opt
            .setName('duration')
            .setDescription('禁言幾分鐘（1～60）')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(60)
        )
    ),

  async execute(interaction) {
  const sub = interaction.options.getSubcommand(); // 取得是哪個子指令

  // --- purge 子指令 ---
  if (sub === 'purge') {
    const amount = interaction.options.getInteger('amount');

    // 批量刪除訊息（注意：只能刪 14 天內的訊息）
    const deleted = await interaction.channel.bulkDelete(amount, true);
    // true = 自動過濾超過 14 天的訊息，避免 API 報錯

    await interaction.reply({
      content: `✅ 已刪除 ${deleted.size} 則訊息`,
      ephemeral: true, // 只有執行者看得到這個確認訊息
    });
  }

  // --- timeout 子指令 ---
  if (sub === 'timeout') {
    const target = interaction.options.getMember('target'); // 取得 GuildMember 物件
    const duration = interaction.options.getInteger('duration');

    // 防呆：不能禁言自己
    if (target.id === interaction.user.id) {
      return interaction.reply({ content: '❌ 你不能禁言自己！', ephemeral: true });
    }

    // 禁言：duration 單位是毫秒，所以要 * 60 * 1000
    await target.timeout(duration * 60 * 1000, `由 ${interaction.user.tag} 執行禁言`);

    await interaction.reply({
      content: `✅ 已禁言 ${target.user.tag} ${duration} 分鐘`,
      ephemeral: true,
    });
  }
},
};
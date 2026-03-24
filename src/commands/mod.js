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

  // execute 先留空，下一個任務再填入
  async execute(interaction) {
    await interaction.reply({ content: '指令建置中...', ephemeral: true });
  },
};
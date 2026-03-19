module.exports = {
  name: 'ready',       // 事件名稱（對應 Discord.js 事件）
  once: true,          // true = 只觸發一次，false = 每次都觸發
  execute(client) {
    console.log(`🤖 Bot 已上線：${client.user.tag}`);
  },
};

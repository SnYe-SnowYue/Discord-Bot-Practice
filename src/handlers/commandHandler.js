const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  // 建立一個 Map 來儲存所有指令
  client.commands = new Map();

  // 取得 commands 資料夾的路徑
  const commandsPath = path.join(__dirname, '../commands');

  // 讀取資料夾內所有 .js 檔案
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    // 每個指令檔案需要有 data（指令定義）和 execute（執行函式）
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
      console.log(`✅ 已載入指令：${command.data.name}`);
    }
  }
};

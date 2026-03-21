// 使用 Map 暫存每個 guild 的設定資料
// key: guildId
// value: 該 guild 的設定物件
const guildConfigs = new Map();

module.exports = {
  // 取得某個 guild 的完整設定；如果沒有就回傳空物件
  getConfig(guildId) {
    return guildConfigs.get(guildId) || {};
  },

  // 設定某個 guild 的某個 key
  setConfig(guildId, key, value) {
    const currentConfig = guildConfigs.get(guildId) || {};
    currentConfig[key] = value;
    guildConfigs.set(guildId, currentConfig);
  },

  // 取得某個 guild 的單一設定值
  getValue(guildId, key) {
    const currentConfig = guildConfigs.get(guildId) || {};
    return currentConfig[key];
  },
};
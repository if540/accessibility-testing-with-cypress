/**
 * 產生台北時間的時間戳記 (UTC+8)
 * @returns {Object} 包含不同格式的時間戳記物件
 */
function getTaipeiTimestamp() {
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  const hour = parts.find(p => p.type === 'hour').value;
  const minute = parts.find(p => p.type === 'minute').value;
  
  return {
    year,
    month,
    day,
    hour,
    minute,
    // 無分隔符格式：用於檔案名
    compact: `${year}${month}${day}${hour}${minute}`,
    // 有分隔符格式：用於 id
    withSeparator: `${year}-${month}-${day}_${hour}-${minute}`,
    // lastRun 格式
    lastRun: `${year}-${month}-${day} ${hour}:${minute}:00`
  };
}

// CommonJS 導出
module.exports = getTaipeiTimestamp;


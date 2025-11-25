/**
 * 解析 URL 並產生安全的名稱格式
 * @param {string} [url] - 要解析的 URL，如果未提供則使用環境變數或預設值
 * @param {string} [defaultBaseUrl] - 預設的基礎 URL，如果未提供則使用環境變數或 'http://localhost:3000'
 * @returns {Object} 包含解析後的 URL 資訊和安全名稱
 */
function parseUrlToSafeNames(url, defaultBaseUrl = 'http://localhost:3000') {
  const baseUrl = url || process.env.CYPRESS_BASE_URL || defaultBaseUrl;
  const parsedUrl = new URL(baseUrl);
  const hostname = parsedUrl.hostname;
  const safeHostname = hostname.replace(/\./g, '-');
  const safePathname = parsedUrl.pathname.replace(/\//g, '-');
  const safePort = parsedUrl.port ? '--' + parsedUrl.port : '';
  const safeReportFilePathName = `${safeHostname}${safePathname === '-' ? '' : safePathname}${safePort}`;
  
  return {
    baseUrl,
    parsedUrl,
    hostname,
    safeHostname,
    safePathname,
    safeReportFilePathName
  };
}

// CommonJS 導出
module.exports = parseUrlToSafeNames;


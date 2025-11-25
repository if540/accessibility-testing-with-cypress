/**
 * 網站報告數據 API
 */

export const sitesApi = {
  queryKey: ['sites'],
  queryFn: () => {
    return fetch(`${process.env.REACT_APP_REPORT_DATA_API_URL}db.json`).then(res => res.json()).catch(err => {
      console.error('Error fetching sites:', err);
      return [];
    });
  },
};

export const siteReportApi = {
  queryFn: ({ siteName, reportId }) => {
    return fetch(`${process.env.REACT_APP_A11y_REPORTS_API_URL}${siteName}/${reportId}.json`).then(res => res.json()).catch(err => {
      console.error('Error fetching site report:', err);
      return {
        domainName: "",
        lastRun: '',
        pages: [],
      };
    });
  }
};
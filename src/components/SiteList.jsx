import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRightIcon, PersonStandingIcon } from 'lucide-react';

function SiteList({ sites }) {
  return (
    <>
      <section className="col-span-12 h-[33vh] max-h-[700px] mb-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex items-center flex-col">
            <PersonStandingIcon className="w-6 h-6" /> 
            <span className="text-muted-foreground text-xs font-bold">Web Accessibility</span>
          </div>
          <h2 className="text-3xl font-bold text-center flex flex-col items-center">
            <span className="text-primary">網站無障礙檢查站點</span>
          </h2>
          <p className="text-sm text-center text-muted-foreground">
            以下為網站無障礙 Web Accessibility 檢查列表，您可以點擊網域名稱前往詳細頁面查看檢查結果。
          </p>
        </div>
      </section>
      <section className="col-span-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites?.map(site => (
          <Card key={site.reportFilePath} className='items-start gap-2 text-card-foreground justify-between'>
            <CardHeader className='flex justify-between w-full'>
              <CardTitle className='flex flex-col items-start gap-1'>
                {/* <span className="text-xs text-muted-foreground">網址名稱</span> */}
                <Link to={`${site.siteUrl}`} target="_blank" title="前往站點(另開新視窗)" aria-label="前往站點(另開新視窗)" className='flex items-center gap-1'>
                  {site.reportFilePath}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className='flex justify-between items-end w-full'>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1 items-center">
                  <span className="text-xs text-muted-foreground">關鍵</span> <Badge variant="secondary" className={site.critical > 0 ? "text-red-400" : "text-gray-400"}>{site.critical}</Badge>
                  <span className="text-xs text-muted-foreground">嚴重</span> <Badge variant="secondary" className={site.serious > 0 ? "text-yellow-500" : "text-gray-400"}>{site.serious}</Badge>
                  <span className="text-xs text-muted-foreground">中等</span> <Badge variant="secondary" className={site.moderate > 0 ? "text-gray-300" : "text-gray-400"}>{site.moderate}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">執行時間: {site.lastRun}</span>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <Link to={`/site/${site.reportFilePath}`}>
                  <Button variant="default" size="sm" title={`前往 ${site.reportFilePath} 詳細頁面`} aria-label={`前往 ${site.reportFilePath} 詳細頁面`}><ArrowRightIcon className='w-4 h-4' /></Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

    </>
  );
}

export default SiteList;
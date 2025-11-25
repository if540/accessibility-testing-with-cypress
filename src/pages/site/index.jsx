import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { sitesApi } from "../../api";
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from '@/components/ui/item';
import { EarthIcon, ExternalLinkIcon, ArrowRightIcon, ArrowLeftIcon, ArrowUpDownIcon, InfoIcon, ChevronsUpIcon, ChevronsDownIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
import { Table, TableCaption, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationEllipsis, PaginationLink } from '@/components/ui/pagination';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

function SiteIndex() {
  const { siteName } = useParams();
  const { data: site, isLoading, error } = useQuery({
    queryKey: sitesApi.queryKey,
    queryFn: sitesApi.queryFn,
    staleTime: Infinity,
    select: (data) => data.find((item) => item.reportFilePath === siteName),
  });

  const [sortBy, setSortBy] = useState('desc');
  const sorted = useMemo(() => {
    if (!site?.reports || site.reports.length === 0) return [];
    return [...site.reports].sort((a, b) => {
      if (sortBy === 'asc') {
        return new Date(a.lastRun) - new Date(b.lastRun);
      }
      if (sortBy === 'desc') {
        return new Date(b.lastRun) - new Date(a.lastRun);
      }
    });
  }, [site?.reports, sortBy]);

  if (isLoading || error) {
    return (
      <div className="col-span-12">
        {isLoading ? <div>Loading...</div> : <div>Error: {error.message}</div>}
      </div>
    )
  }

  if (!site) {
    return (
      <div className="col-span-12">
        <div>找不到站點：{siteName}</div>
        <Button variant="secondary" size="sm" asChild className="mt-4">
          <Link to="/">
            <ArrowLeftIcon className='w-4 h-4' /> 回到站點列表
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <header className="col-span-12 mb-4 flex justify-center">
        <Item variant="muted" className="w-full">
          <ItemMedia variant="icon">
            <EarthIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              {site.reportFilePath}
              <Button variant="ghost" size="sm" title="前往站點(另開新視窗)" aria-label="前往站點(另開新視窗)" asChild>
                <Link to={`${site.siteUrl}`} target="_blank">
                  <ExternalLinkIcon />
                </Link>
              </Button>
            </ItemTitle>
          </ItemContent>
        </Item>
      </header>

      <div className="col-span-12 space-y-4">
      
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link to="/">
              <ArrowLeftIcon className='w-4 h-4' /> 回到站點列表
            </Link>
          </Button>
        </div>
        <div>
          <Table>
            <TableCaption>All Reports List</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">序號</TableHead>
                <TableHead>報告編號</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <span>關鍵</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon size={16} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>critical</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <span>嚴重</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon size={16} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>serious</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <span>中等</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon size={16} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>moderate</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <span>次要</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon size={16} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>minor</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" title="排序" aria-label="排序" onClick={() => setSortBy(sortBy === 'asc' ? 'desc' : 'asc')}>
                    執行時間 <ArrowUpDownIcon />
                  </Button>
                </TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((report, index) => {
                // 根據排序方式決定比較對象（總是與較舊的報告比較）
                // desc: 當前（較新）與下一筆（較舊）比較
                // asc: 當前（較新）與前一筆（較舊）比較
                const compareReport = sortBy === 'desc' 
                  ? (index < sorted.length - 1 ? sorted[index + 1] : null)  // desc: 取下一筆（較舊的）
                  : (index > 0 ? sorted[index - 1] : null);                 // asc: 取前一筆（較舊的）
                
                // 比較函數：根據變化返回對應的圖標
                const getChangeIcon = (current, compare, type) => {
                  // 檢查是否有可比較的資料（需要明確檢查 null 和 undefined，因為 0 也是有效值）
                  if (compare === null || compare === undefined) return null;
                  
                  // 確保 current 和 compare 都是數字
                  const currentNum = Number(current) || 0;
                  const compareNum = Number(compare) || 0;
                  
                  // 相減方式：根據排序方式決定
                  // desc: 當前（較新）- 下一筆（較舊），正值表示問題增加
                  // asc: 當前（較新）- 前一筆（較舊），正值表示問題增加
                  const diff = currentNum - compareNum;
                  const absDiff = Math.abs(diff);
                  
                  if (diff > 0) {
                    // 差距 3 以上使用複數圖標，差距 2 以下使用單數圖標
                    return absDiff >= 3 
                      ? <ChevronsUpIcon size={16} className="text-red-400" />
                      : <ChevronUpIcon size={16} className="text-red-400" />;
                  } else if (diff < 0) {
                    // 差距 3 以上使用複數圖標，差距 2 以下使用單數圖標
                    return absDiff >= 3
                      ? <ChevronsDownIcon size={16} className="text-green-500" />
                      : <ChevronDownIcon size={16} className="text-green-500" />;
                  }
                  return null; // 沒有變化不顯示圖標
                };

                return (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary">{report.critical}</Badge>
                        {getChangeIcon(report.critical, compareReport?.critical, 'critical')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary">{report.serious}</Badge>
                        {getChangeIcon(report.serious, compareReport?.serious, 'serious')}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary">{report.moderate}</Badge>
                        {getChangeIcon(report.moderate, compareReport?.moderate, 'moderate')}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary">{report.minor}</Badge>
                        {getChangeIcon(report.minor, compareReport?.minor, 'minor')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{report.lastRun}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="default" size="icon-sm" title={`前往 ${site.domainName} 報告ID ${report.id} 詳細頁面`} aria-label={`前往 ${site.domainName} 報告ID ${report.id} 詳細頁面`} asChild>
                          <Link to={`/site/${site.reportFilePath}/${report.id}`}>
                              <ArrowRightIcon />
                          </Link>
                        </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
      </div>
    </>
  );
}

export default SiteIndex;

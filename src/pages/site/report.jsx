import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { siteReportApi } from "../../api";
import { Link } from "react-router-dom";
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from '@/components/ui/item';
import { SquareChartGantt, ChevronDownIcon, ArrowLeftIcon, ZoomInIcon, ExternalLinkIcon, ChevronsDownUpIcon, ChevronsUpDownIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableCaption, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ButtonGroup } from '@/components/ui/button-group';

function SiteReport() {
  const { siteName, reportId } = useParams();
  const [selectedPage, setSelectedPage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedViolations, setExpandedViolations] = useState(new Set());
  const [visibleImpacts, setVisibleImpacts] = useState({
    critical: true,
    serious: true,
    moderate: true,
    minor: true
  })
  const [expandedAll, setExpandedAll] = useState(false);

  // 全部展開/合閉功能
  const handleExpandAll = () => {
    if (!selectedPage || !reportPages?.pages[selectedPage]?.violations) return;
    const allKeys = reportPages.pages[selectedPage].violations
      .map((violation, index) => ({ violation, index }))
      // .filter(({ violation }) => visibleImpacts[violation.impact])
      .map(({ violation, index }) => `${violation.id}-${index}`);
    setExpandedViolations(new Set(allKeys));
    setExpandedAll(true);
  };

  const handleCollapseAll = () => {
    setExpandedViolations(new Set());
    setExpandedAll(false);
  };
  
  const { data: report, isLoading, error } = useQuery({
    queryKey: ['siteReport', siteName, reportId],
    queryFn: () => siteReportApi.queryFn({ siteName: siteName, reportId: reportId }),
    staleTime: Infinity
  });

  const reportPages = useMemo(() => {
    if (!report) {
      return;
    }

    // 定義 impact 優先順序
    const impactOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };

    // 初始化總計統計
    let totalCritical = 0;
    let totalSerious = 0;
    let totalModerate = 0;
    let totalMinor = 0;

    // 處理每個頁面的資料
    const pages = {};
    Object.keys(report.pages || {}).forEach((pagePath) => {
      const violations = report.pages[pagePath] || [];
      
      // 統計該頁面的違規數量
      const pageStats = {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0
      };

      violations.forEach((violation) => {
        const impact = violation.impact;
        if (impact === 'critical') {
          pageStats.critical++;
          totalCritical++;
        } else if (impact === 'serious') {
          pageStats.serious++;
          totalSerious++;
        } else if (impact === 'moderate') {
          pageStats.moderate++;
          totalModerate++;
        } else if (impact === 'minor') {
          pageStats.minor++;
          totalMinor++;
        }
      });

      // 對 violations 進行排序：critical > serious > moderate > minor
      const sortedViolations = [...violations].sort((a, b) => {
        const orderA = impactOrder[a.impact] ?? 999;
        const orderB = impactOrder[b.impact] ?? 999;
        return orderA - orderB;
      });

      
      // 儲存頁面資料
      pages[pagePath] = {
        ...pageStats,
        violations: sortedViolations
      };
    });

    return {
      ...report,
      siteUrl: report.siteUrl || "",
      domainName: report.domainName || "",
      lastRun: report.lastRun || "",
      critical: totalCritical,
      serious: totalSerious,
      moderate: totalModerate,
      minor: totalMinor,
      pages: pages
    };
  }, [report]);

  if (!report) {  
    return (
      <div className="col-span-12">
        {isLoading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
      </div>
    );
  }

  return (
    <>
      <header className="col-span-12 mb-4 flex justify-center">
        <Item variant="muted" className="w-full">
          <ItemMedia variant="icon" className="self-start">
            <SquareChartGantt />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              {siteName} (報告編號: {report?.id || "No report id"})
            </ItemTitle>
            <div className="flex gap-2 items-end justify-between flex-wrap">
              <div>
                <span className="text-xs text-muted-foreground">檢測總頁數: {Object.keys(reportPages?.pages || {}).length}</span>
                <div className="flex gap-1 items-center">
                  <span className="text-xs text-muted-foreground">檢測總違規數:</span>
                  <span className="text-xs text-muted-foreground">關鍵</span> <Badge variant="secondary" className={reportPages?.critical > 0 ? "text-red-400" : "text-gray-400"}>{reportPages?.critical}</Badge>
                  <span className="text-xs text-muted-foreground">嚴重</span> <Badge variant="secondary" className={reportPages?.serious > 0 ? "text-yellow-500" : "text-gray-400"}>{reportPages?.serious}</Badge>
                  <span className="text-xs text-muted-foreground">中等</span> <Badge variant="secondary" className={reportPages?.moderate > 0 ? "text-gray-300" : "text-gray-400"}>{reportPages?.moderate}</Badge>
                  <span className="text-xs text-muted-foreground">次要</span> <Badge variant="secondary" className={reportPages?.minor > 0 ? "text-gray-300" : "text-gray-400"}>{reportPages?.minor}</Badge>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">執行時間: {reportPages?.lastRun || "No last run time"}</span>
            </div>
          </ItemContent>
        </Item>
      </header>

      <div className="col-span-12 space-y-4">
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link to={`/site/${reportPages?.reportFilePath}`}>
              <ArrowLeftIcon className='w-4 h-4' /> 回到報告列表
            </Link>
          </Button>
        </div>
        <div>
          <Table>
            <TableCaption>All Pages Tested List</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">序號</TableHead>
                <TableHead>頁面路徑</TableHead>
                <TableHead>關鍵</TableHead>
                <TableHead>嚴重</TableHead>
                <TableHead>中等</TableHead>
                <TableHead>次要</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(reportPages?.pages || {}).map((reportPage, index) => (
                <TableRow key={reportPage}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <Link to={`${reportPages?.siteUrl}${reportPage}`} target="_blank" className="flex items-center gap-1" title={`開啟 ${reportPage} 受測頁面`}>
                      {reportPage} <ExternalLinkIcon size={12} />
                    </Link>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className={reportPages.pages[reportPage]?.critical > 0 ? "text-red-400" : "text-gray-400"}>{reportPages.pages[reportPage]?.critical || 0}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={reportPages.pages[reportPage]?.serious > 0 ? "text-yellow-500" : "text-gray-400"}>{reportPages.pages[reportPage]?.serious || 0}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={reportPages.pages[reportPage]?.moderate > 0 ? "text-gray-300" : "text-gray-400"}>{reportPages.pages[reportPage]?.moderate || 0}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={reportPages.pages[reportPage]?.minor > 0 ? "text-gray-300" : "text-gray-400"}>{reportPages.pages[reportPage]?.minor || 0}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="default"
                      size="icon-sm"
                      title={`開啟 ${reportPage} 詳細資訊`}
                      aria-label={`開啟 ${reportPage} 詳細資訊`}
                      onClick={() => {
                        setSelectedPage(reportPage);
                        setIsDialogOpen(true);
                      }}
                      disabled={!['critical','serious','moderate','minor'].some(level => reportPages.pages[reportPage]?.[level] > 0)}
                    >
                      <ZoomInIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="!max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>頁面詳細資訊 - {selectedPage}</DialogTitle>
            <DialogDescription>
              查看此頁面的無障礙性違規詳細資訊。您可以透過下方的按鈕篩選不同嚴重程度的違規項目。
            </DialogDescription>
            {selectedPage && reportPages?.pages[selectedPage] && (
              <div className="flex flex-wrap gap-2 items-center mt-2">
                <button
                  type="button"
                  onClick={() => setVisibleImpacts(prev => ({ ...prev, critical: !prev.critical }))}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-opacity ${
                    visibleImpacts.critical ? 'opacity-100' : 'opacity-40'
                  } hover:opacity-80`}
                  title={visibleImpacts.critical ? '隱藏關鍵違規' : '顯示關鍵違規'}
                >
                  <span>關鍵</span>
                  <Badge variant="secondary" className={reportPages.pages[selectedPage].critical > 0 ? "text-red-400" : "text-gray-400"}>
                    {reportPages.pages[selectedPage].critical}
                  </Badge>
                </button>
                <button
                  type="button"
                  onClick={() => setVisibleImpacts(prev => ({ ...prev, serious: !prev.serious }))}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-opacity ${
                    visibleImpacts.serious ? 'opacity-100' : 'opacity-40'
                  } hover:opacity-80`}
                  title={visibleImpacts.serious ? '隱藏嚴重違規' : '顯示嚴重違規'}
                >
                  <span>嚴重</span>
                  <Badge variant="secondary" className={reportPages.pages[selectedPage].serious > 0 ? "text-yellow-500" : "text-gray-400"}>
                    {reportPages.pages[selectedPage].serious}
                  </Badge>
                </button>
                <button
                  type="button"
                  onClick={() => setVisibleImpacts(prev => ({ ...prev, moderate: !prev.moderate }))}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-opacity ${
                    visibleImpacts.moderate ? 'opacity-100' : 'opacity-40'
                  } hover:opacity-80`}
                  title={visibleImpacts.moderate ? '隱藏中等違規' : '顯示中等違規'}
                >
                  <span>中等</span>
                  <Badge variant="secondary" className={reportPages.pages[selectedPage].moderate > 0 ? "text-gray-300" : "text-gray-400"}>
                    {reportPages.pages[selectedPage].moderate}
                  </Badge>
                </button>
                <button
                  type="button"
                  onClick={() => setVisibleImpacts(prev => ({ ...prev, minor: !prev.minor }))}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-opacity ${
                    visibleImpacts.minor ? 'opacity-100' : 'opacity-40'
                  } hover:opacity-80`}
                  title={visibleImpacts.minor ? '隱藏次要違規' : '顯示次要違規'}
                >
                  <span>次要</span>
                  <Badge variant="secondary" className={reportPages.pages[selectedPage].minor > 0 ? "text-gray-300" : "text-gray-400"}>
                    {reportPages.pages[selectedPage].minor}
                  </Badge>
                </button>
              </div>
            )}
            {selectedPage && reportPages?.pages[selectedPage]?.violations && (
              <div className="flex justify-end mt-4">
                <ButtonGroup>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExpandAll}
                    title="展開所有違規詳細資訊"
                    aria-label="展開所有違規詳細資訊"
                    aria-pressed={expandedAll}
                    className="aria-[pressed=false]:text-gray-400 aria-[pressed=true]:pointer-events-none"
                  >
                    <ChevronsUpDownIcon />
                    展開
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCollapseAll}
                    title="收起所有違規詳細資訊"
                    aria-label="收起所有違規詳細資訊"
                    aria-pressed={!expandedAll}
                    className="aria-[pressed=false]:text-gray-400 aria-[pressed=true]:pointer-events-none"
                  >
                    <ChevronsDownUpIcon />
                    收起
                  </Button>
                </ButtonGroup>
              </div>
            )}
          </DialogHeader>
          <div className="space-y-4">
            {selectedPage && reportPages?.pages[selectedPage]?.violations
              ?.map((violation, index) => {
                if (!visibleImpacts[violation.impact]) return null;
                const violationKey = `${violation.id}-${index}`;
                const isExpanded = expandedViolations.has(violationKey);
              
              return (
              <div key={violationKey} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="secondary" 
                        className={
                          violation.impact === 'critical' ? 'text-red-400' :
                          violation.impact === 'serious' ? 'text-yellow-500' :
                          'text-gray-500'
                        }
                      >
                        {violation.impact}
                      </Badge>
                      <h4 className="font-semibold">{violation.id}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{violation.description}</p>
                    <p className="text-sm mb-2">{violation.help}</p>
                    {violation.helpUrl && (
                      <div className="flex items-center gap-1">
                      <Link 
                        to={violation.helpUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline flex items-center gap-1"
                      >
                          查看詳細說明 <ExternalLinkIcon className='w-4 h-4' />
                        </Link>
                      </div>
                    )}
                  </div>
                  {violation.nodes && violation.nodes.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-pressed={isExpanded}
                      onClick={() => {
                        setExpandedViolations(prev => {
                          const newSet = new Set(prev);
                          if (isExpanded) {
                            newSet.delete(violationKey);
                          } else {
                            newSet.add(violationKey);
                          }
                          return newSet;
                        });
                      }}
                      title={isExpanded ? '收起詳細資訊' : '展開詳細資訊'}
                      aria-label={isExpanded ? '收起詳細資訊' : '展開詳細資訊'}
                    >
                      <ChevronDownIcon 
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      />
                    </Button>
                  )}
                </div>
                {violation.nodes && violation.nodes.length > 0 && (
                  <>
                    {isExpanded ? (
                      <div className="space-y-2 mt-4 pt-4 border-t">
                        {violation.nodes.map((node, nodeIndex) => (
                          <div key={nodeIndex} className="space-y-2">
                            {node.html && (
                              <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                                <div className="font-semibold mb-1">HTML:</div>
                                <pre className="whitespace-pre-wrap break-words">
                                  <code>{node.html}</code>
                                </pre>
                              </div>
                            )}
                            {node.target && node.target.length > 0 && (
                              <div className="text-xs">
                                <div className="font-semibold mb-1">目標元素:</div>
                                <code className="bg-muted px-2 py-1 rounded">{node.target.join(', ')}</code>
                              </div>
                            )}
                            {node.failureSummary && (() => {
                              // 用 \n\n 分割段落，\n 分割行
                              const paragraphs = node.failureSummary.split(/\n\n+/).filter(p => p.trim());
                              
                              return (
                                <div className="text-xs">
                                  <div className="font-semibold mb-1">修復建議:</div>
                                  <div className="bg-muted p-2 rounded space-y-2">
                                    {paragraphs.map((paragraph, pIndex) => {
                                      const lines = paragraph.split('\n').filter(line => line.trim());
                                      const firstLine = lines[0]?.trim() || '';
                                      
                                      // 檢查第一行是否為標題（不以空格開頭）
                                      const isTitle = firstLine && !/^\s/.test(paragraph.split('\n')[0]);
                                      const listItems = isTitle ? lines.slice(1) : lines;
                                      
                                      return (
                                        <div key={pIndex}>
                                          {isTitle && (
                                            <div className="font-medium mb-1.5">
                                              {firstLine}
                                            </div>
                                          )}
                                          {listItems.length > 0 && (
                                            <ul className="list-none space-y-1">
                                              {listItems.map((line, lIndex) => {
                                                const trimmed = line.trim().replace(/^[-•]\s*/, '');
                                                return (
                                                  <li key={lIndex} className="flex items-start pl-4">
                                                    <span className="mr-2 mt-0.5">•</span>
                                                    <span>{trimmed}</span>
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          )}
                                          {!isTitle && listItems.length === 0 && (
                                            <div>{firstLine}</div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        ))}
                        {
                          violation.tags && violation.tags.length > 0 && (
                            <div className="text-xs">
                              <div className="font-semibold mb-1">標籤:</div>
                              <div className="flex flex-wrap gap-2">
                                {violation.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="secondary" className="text-muted-foreground">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                          )
                        }
                      </div>
                    ) : (
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-xs space-y-2">
                          <div className="font-semibold mb-1">受影響的元素:</div>
                          <div className="flex flex-wrap gap-2">
                            {violation.nodes
                              .filter(node => node.target && node.target.length > 0)
                              .map((node, nodeIndex) => 
                                node.target.map((target, targetIndex) => (
                                  <code 
                                    key={`${nodeIndex}-${targetIndex}`}
                                    className="bg-muted px-2 py-1 rounded text-xs"
                                  >
                                    {target}
                                  </code>
                                ))
                              )
                              .flat()}
                          </div>
                          {violation.nodes.filter(node => node.target && node.target.length > 0).length === 0 && (
                            <div className="text-muted-foreground">
                              共 {violation.nodes.length} 個受影響的元素
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              );
            })}
            {selectedPage && (!reportPages?.pages[selectedPage]?.violations || reportPages.pages[selectedPage].violations.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                此頁面沒有違規項目
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SiteReport;
import React, { useState } from "react";
import { useDailyReport } from "@/hooks/useDailyReport";
import {
  LucideCalendar,
  LucideGitCommit,
  LucideGitPullRequest,
  LucideBug,
  LucideMessageSquare,
  LucideLoader2,
  LucideActivity,
  LucideChevronLeft,
  LucideChevronRight,
} from "lucide-react";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const getToday = () => formatDate(new Date());

export const DailyReportWidget: React.FC = () => {
  const [targetDate, setTargetDate] = useState<string>(getToday());
  const { data: report, isLoading, isError } = useDailyReport(targetDate);

  const isToday = targetDate === getToday();

  const goToPrev = () => {
    const d = new Date(targetDate);
    d.setDate(d.getDate() - 1);
    setTargetDate(formatDate(d));
  };

  const goToNext = () => {
    if (isToday) return;
    const d = new Date(targetDate);
    d.setDate(d.getDate() + 1);
    setTargetDate(formatDate(d));
  };

  return (
    <div className="terminal-window border-miku-muted flex flex-col h-full">
      {/* Header with date navigation */}
      <h3 className="flex items-center justify-between text-primary font-bold mb-3 border-b border-miku-muted pb-2">
        <span className="flex items-center gap-2 text-sm">
          <LucideCalendar size={16} /> DAILY_ENCORE_REPORT
        </span>
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={goToPrev}
            className="px-1 hover:text-primary transition-colors opacity-70 hover:opacity-100"
            title="이전 날"
          >
            <LucideChevronLeft size={14} />
          </button>
          <span className="opacity-70 font-mono">[{targetDate}]</span>
          <button
            onClick={goToNext}
            disabled={isToday}
            className={`px-1 transition-colors ${isToday ? "opacity-20 cursor-not-allowed" : "opacity-70 hover:opacity-100 hover:text-primary"}`}
            title="다음 날"
          >
            <LucideChevronRight size={14} />
          </button>
        </div>
      </h3>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-4 opacity-60 flex-1">
          <LucideLoader2 className="animate-spin text-primary mb-2" size={20} />
          <span className="text-[10px] tracking-widest uppercase">Analyzing_Performance...</span>
        </div>
      )}

      {(isError || (!isLoading && !report)) && (
        <div className="p-4 text-xs text-error opacity-80 flex-1">
          [ERR] Failed to load report for {targetDate}.
        </div>
      )}

      {!isLoading && report && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-3 flex-1">
            <div className="bg-miku-dark/50 border border-miku-muted p-2 flex flex-col items-center justify-center">
              <span className="text-[10px] opacity-60 uppercase mb-1 flex items-center gap-1">
                <LucideActivity size={10} /> TOTAL
              </span>
              <span className="text-2xl font-black text-primary">{report.totalActivities}</span>
            </div>

            <div className="flex flex-col justify-center space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 opacity-70"><LucideGitCommit size={12} /> PUSH</span>
                <span className="text-primary font-bold">{report.pushCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 opacity-70"><LucideGitPullRequest size={12} /> PR</span>
                <span className="text-secondary font-bold">{report.prCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 opacity-70"><LucideBug size={12} /> ISSUE</span>
                <span className="text-error font-bold">{report.issuesCount}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-miku-muted pt-2 mt-auto">
            <div className="flex items-start gap-2 text-xs">
              <LucideMessageSquare size={12} className="text-primary shrink-0 mt-0.5" />
              <span className="opacity-90 italic leading-relaxed">
                <span className="text-primary font-bold not-italic mr-1">MIKU:</span>
                &ldquo;{report.mikuNote}&rdquo;
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

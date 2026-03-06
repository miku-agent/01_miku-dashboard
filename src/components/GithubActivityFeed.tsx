import React from "react";
import { useGithubActivities, GithubActivity } from "@/hooks/useGithubActivities";
import { LucideGitCommit, LucideGitPullRequest, LucideAlertCircle, LucideLoader2 } from "lucide-react";

export const GithubActivityFeed: React.FC = () => {
  const { data: activities, isLoading, isError, error } = useGithubActivities();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-2 opacity-60">
        <LucideLoader2 className="animate-spin text-primary" size={24} />
        <p className="text-xs uppercase tracking-widest">Fetching_Miku_Activity_Logs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border border-error p-4 text-error text-sm flex items-center gap-3">
        <LucideAlertCircle size={20} />
        <div>
          <p className="font-bold">!! CONNECTION_INTERRUPTED !!</p>
          <p className="opacity-80">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "PushEvent": return <LucideGitCommit size={14} className="text-primary" />;
      case "PullRequestEvent": return <LucideGitPullRequest size={14} className="text-secondary" />;
      default: return <LucideGitCommit size={14} className="opacity-50" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().replace("T", " ").slice(0, 19);
  };

  return (
    <div className="space-y-3 font-mono text-sm h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {activities?.map((activity) => (
        <div key={activity.id} className="border-l-2 border-miku-muted pl-4 py-1 hover:bg-primary/5 transition-colors group">
          <div className="flex items-center gap-2 mb-1">
            {getIcon(activity.type)}
            <span className="text-[10px] opacity-50">[{formatDate(activity.createdAt)}]</span>
            <span className="font-bold text-primary text-xs uppercase tracking-tighter">
              {activity.type.replace("Event", "")}
            </span>
          </div>
          <div className="opacity-80 break-all leading-tight">
            <span className="text-secondary opacity-70">REPO:</span> {activity.repo}
          </div>
          {activity.type === "PushEvent" && activity.payload.commits?.[0] && (
            <div className="mt-1 pl-2 text-[11px] italic opacity-60 group-hover:opacity-100 transition-opacity">
              {"> "} {activity.payload.commits[0].message}
            </div>
          )}
        </div>
      ))}
      
      {!activities?.length && (
        <div className="text-center p-8 opacity-40 italic">
          -- NO_RECENT_ACTIVITY_LOGGED --
        </div>
      )}
    </div>
  );
};

import React from "react";
import { useMikuStore, MikuStatus } from "@/store/useMikuStore";
import { LucideZap, LucideBrain, LucideMusic, LucideInfo, LucideAlertTriangle, LucideCpu, LucideLayers } from "lucide-react";

export const AgentStatusWidget: React.FC = () => {
  const { status, currentTask, sessionInfo, agentStatus } = useMikuStore();

  // INTERMISSION → IDLE 로 매핑, 나머지는 그대로
  const displayStatus = status === "INTERMISSION" ? "IDLE" : status;

  const getStatusConfig = (s: MikuStatus) => {
    switch (s) {
      case "THINKING":
        return { icon: <LucideBrain className="animate-pulse" />, color: "text-secondary", bgColor: "bg-secondary/10", borderColor: "border-secondary" };
      case "WORKING":
        return { icon: <LucideZap />, color: "text-blue-400", bgColor: "bg-blue-400/10", borderColor: "border-blue-400" };
      case "SINGING":
        return { icon: <LucideMusic className="animate-bounce" />, color: "text-primary", bgColor: "bg-primary/10", borderColor: "border-primary" };
      case "ERROR":
        return { icon: <LucideAlertTriangle className="animate-ping" />, color: "text-error", bgColor: "bg-error/10", borderColor: "border-error" };
      default:
        return { icon: <LucideInfo />, color: "text-primary", bgColor: "bg-primary/10", borderColor: "border-primary" };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`terminal-window ${config.borderColor} ${config.bgColor} transition-all duration-500`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className={`${config.color} p-2 border ${config.borderColor} bg-miku-dark`}>
            {React.cloneElement(config.icon as React.ReactElement<{ size?: number }>, { size: 32 })}
          </div>
          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${config.color}`}>
                {displayStatus}_MODE
              </span>
              <span className="flex gap-1">
                <span className={`w-2 h-2 rounded-full ${displayStatus === "IDLE" ? "bg-primary animate-pulse" : "bg-miku-muted"}`} />
                <span className={`w-2 h-2 rounded-full ${displayStatus === "THINKING" ? "bg-secondary animate-pulse" : "bg-miku-muted"}`} />
                <span className={`w-2 h-2 rounded-full ${displayStatus === "WORKING" ? "bg-blue-400 animate-pulse" : "bg-miku-muted"}`} />
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold tracking-tight break-words uppercase leading-tight">
              {displayStatus} // {currentTask.replace(/_/g, " ")}
            </h2>
          </div>
        </div>

        {sessionInfo && (
          <div className="grid grid-cols-2 gap-2 p-2 bg-miku-dark/50 border border-miku-muted text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <LucideCpu size={12} className="text-secondary" />
              <span className="opacity-60 truncate">{sessionInfo.model.split("/").pop()}</span>
            </div>
            <div className="flex items-center gap-2">
              <LucideLayers size={12} className="text-blue-400" />
              <span className="opacity-60">CTX: {sessionInfo.contextUsage}</span>
            </div>
            <div className="col-span-2 flex justify-between pt-1 border-t border-miku-muted/30">
              <span className="text-primary">IN: {sessionInfo.tokensIn}</span>
              <span className="text-secondary">OUT: {sessionInfo.tokensOut}</span>
            </div>
          </div>
        )}

        <div className="flex items-end gap-[2px] h-3 opacity-30">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 ${config.color.replace("text-", "bg-")}`}
              style={{
                height: `${20 + Math.random() * 80}%`,
                animation: `equalizer ${0.4 + Math.random()}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

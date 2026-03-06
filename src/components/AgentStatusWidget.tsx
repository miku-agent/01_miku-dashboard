import React from "react";
import { useMikuStore, MikuStatus } from "@/store/useMikuStore";
import { LucideZap, LucideBrain, LucideMusic, LucideInfo, LucideAlertTriangle, LucideCpu, LucideLayers } from "lucide-react";

export const AgentStatusWidget: React.FC = () => {
  const { status, currentTask, sessionInfo } = useMikuStore();

  const getStatusConfig = (status: MikuStatus) => {
    switch (status) {
      case "THINKING":
        return {
          icon: <LucideBrain className="animate-pulse" />,
          label: "COGNITIVE_PROCESSING",
          color: "text-secondary",
          bgColor: "bg-secondary/10",
          borderColor: "border-secondary",
        };
      case "WORKING":
        return {
          icon: <LucideZap className="animate-spin-slow" />,
          label: "SYSTEM_EXECUTION",
          color: "text-blue-400",
          bgColor: "bg-blue-400/10",
          borderColor: "border-blue-400",
        };
      case "SINGING":
        return {
          icon: <LucideMusic className="animate-bounce" />,
          label: "VOCAL_PERFORMANCE",
          color: "text-primary",
          bgColor: "bg-primary/10",
          borderColor: "border-primary",
        };
      case "ERROR":
        return {
          icon: <LucideAlertTriangle className="animate-ping" />,
          label: "CRITICAL_HALT",
          color: "text-error",
          bgColor: "bg-error/10",
          borderColor: "border-error",
        };
      default:
        return {
          icon: <LucideInfo />,
          label: "STANDBY_MODE",
          color: "text-primary",
          bgColor: "bg-primary/10",
          borderColor: "border-primary",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`terminal-window ${config.borderColor} ${config.bgColor} transition-all duration-500`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className={`${config.color} p-2 border ${config.borderColor} bg-miku-dark`}>
            {React.cloneElement(config.icon as React.ReactElement<any>, { size: 32 })}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${config.color}`}>
                {config.label}
              </span>
              <span className="flex gap-1">
                <span className={`w-2 h-2 rounded-full ${status === 'IDLE' ? 'bg-primary animate-pulse' : 'bg-miku-muted'}`} />
                <span className={`w-2 h-2 rounded-full ${status === 'THINKING' ? 'bg-secondary animate-pulse' : 'bg-miku-muted'}`} />
                <span className={`w-2 h-2 rounded-full ${status === 'WORKING' ? 'bg-blue-400 animate-pulse' : 'bg-miku-muted'}`} />
              </span>
            </div>
            <h2 className="text-lg font-black tracking-tighter truncate uppercase">
              {status} // {currentTask.replace(/_/g, " ")}
            </h2>
          </div>
        </div>

        {sessionInfo && (
          <div className="grid grid-cols-2 gap-2 p-2 bg-miku-dark/50 border border-miku-muted text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <LucideCpu size={12} className="text-secondary" />
              <span className="opacity-60 truncate">{sessionInfo.model.split('/').pop()}</span>
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
              className={`flex-1 ${config.color.replace('text-', 'bg-')}`} 
              style={{ 
                height: `${20 + Math.random() * 80}%`,
                animation: `equalizer ${0.4 + Math.random()}s ease-in-out infinite alternate`
              }} 
            />
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes equalizer {
          from { height: 10%; }
          to { height: 100%; }
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

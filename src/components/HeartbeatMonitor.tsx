import React, { useEffect } from "react";
import { useHeartbeat } from "@/hooks/useHeartbeat";
import { useMikuStore } from "@/store/useMikuStore";
import type { AgentStatus } from "@/pages/api/heartbeat";
import { LucideActivity, LucideShield, LucideWifi, LucideGauge, LucideAlertCircle } from "lucide-react";

const STATUS_CONFIG: Record<AgentStatus, { icon: string; label: string; color: string; borderColor: string }> = {
  LIVE: { icon: "🟢", label: "LIVE", color: "text-green-400", borderColor: "border-green-400" },
  TUNING: { icon: "🟡", label: "TUNING", color: "text-yellow-400", borderColor: "border-yellow-400" },
  INTERMISSION: { icon: "🔵", label: "INTERMISSION", color: "text-blue-400", borderColor: "border-blue-400" },
  ENCORE: { icon: "🟠", label: "ENCORE", color: "text-orange-400", borderColor: "border-orange-400" },
  OFF_STAGE: { icon: "🔴", label: "OFF_STAGE", color: "text-red-500", borderColor: "border-red-500" },
  EMERGENCY: { icon: "⚫", label: "EMERGENCY", color: "text-red-700", borderColor: "border-red-700" },
};

const CHECK_ICONS: Record<string, React.ReactNode> = {
  auth_valid: <LucideShield size={14} />,
  github_connection: <LucideWifi size={14} />,
  rate_limit: <LucideGauge size={14} />,
};

const CHECK_STATUS_COLOR: Record<string, string> = {
  ok: "text-green-400",
  warning: "text-yellow-400",
  critical: "text-orange-400",
  error: "text-red-500",
};

export const HeartbeatMonitor: React.FC = () => {
  const { data: heartbeat, isLoading, isError } = useHeartbeat();
  const setAgentStatus = useMikuStore((s) => s.setAgentStatus);

  useEffect(() => {
    if (heartbeat) {
      setAgentStatus(heartbeat.agentStatus);
    }
  }, [heartbeat, setAgentStatus]);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  if (isLoading) {
    return (
      <div className="terminal-window border-miku-muted animate-pulse">
        <h3 className="flex items-center gap-2 text-primary font-bold mb-4">
          <LucideActivity size={18} /> AGENT_HEARTBEAT
        </h3>
        <div className="text-xs opacity-50">CHECKING PULSE...</div>
      </div>
    );
  }

  if (isError || !heartbeat) {
    return (
      <div className="terminal-window border-red-500">
        <h3 className="flex items-center gap-2 text-red-500 font-bold mb-4">
          <LucideAlertCircle size={18} /> AGENT_HEARTBEAT
        </h3>
        <div className="text-xs text-red-400">HEARTBEAT LOST - NO RESPONSE FROM AGENT</div>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[heartbeat.agentStatus];

  return (
    <div className={`terminal-window ${cfg.borderColor} transition-all duration-500`}>
      <h3 className="flex items-center gap-2 text-primary font-bold mb-4">
        <LucideActivity size={18} className={heartbeat.agentStatus === "LIVE" ? "animate-pulse" : ""} />
        AGENT_HEARTBEAT
      </h3>

      {/* Status Report Box */}
      <div className="font-mono text-xs space-y-1 mb-4">
        <div className="border border-miku-muted p-3 space-y-1">
          <div className="flex justify-between">
            <span className="opacity-60">Status</span>
            <span className={cfg.color}>{cfg.icon} {cfg.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">Uptime</span>
            <span>{formatUptime(heartbeat.uptime)}</span>
          </div>
          {heartbeat.rateLimit && (
            <div className="flex justify-between">
              <span className="opacity-60">Rate Limit</span>
              <span>{heartbeat.rateLimit.remaining.toLocaleString()} / {heartbeat.rateLimit.limit.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="opacity-60">Last Check</span>
            <span>{new Date(heartbeat.lastCheckedAt).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Health Checks */}
      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Health Checks</div>
        {heartbeat.checks.map((check) => (
          <div key={check.name} className="flex items-center gap-2 text-xs">
            <span className={CHECK_STATUS_COLOR[check.status]}>
              {CHECK_ICONS[check.name] || <LucideActivity size={14} />}
            </span>
            <span className="opacity-70 flex-1 truncate">{check.name}</span>
            <span className={`${CHECK_STATUS_COLOR[check.status]} uppercase text-[10px] font-bold`}>
              {check.status}
            </span>
          </div>
        ))}
      </div>

      {/* Pulse animation bar */}
      <div className="mt-4 h-1 w-full bg-miku-muted overflow-hidden">
        <div
          className={`h-full ${cfg.color.replace("text-", "bg-")} transition-all`}
          style={{
            animation: heartbeat.agentStatus === "LIVE"
              ? "pulse-bar 2s ease-in-out infinite"
              : heartbeat.agentStatus === "OFF_STAGE" || heartbeat.agentStatus === "EMERGENCY"
                ? "none"
                : "pulse-bar 4s ease-in-out infinite",
            width: heartbeat.agentStatus === "OFF_STAGE" || heartbeat.agentStatus === "EMERGENCY" ? "0%" : "100%",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes pulse-bar {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

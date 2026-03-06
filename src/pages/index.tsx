import { TerminalLayout } from "@/components/TerminalLayout";
import { GithubActivityFeed } from "@/components/GithubActivityFeed";
import { AgentStatusWidget } from "@/components/AgentStatusWidget";
import { HeartbeatMonitor } from "@/components/HeartbeatMonitor";
import { DailyReportWidget } from "@/components/DailyReportWidget";
import { LucideTerminal, LucideActivity, LucideRadio, LucideGithub } from "lucide-react";
import { useMikuStore } from "@/store/useMikuStore";
import { useSystemStatus } from "@/hooks/useSystemStatus";

export default function Home() {
  const { masterName } = useMikuStore();
  const { data: system, isLoading: isSystemLoading } = useSystemStatus();

  const formatUptime = (seconds: number | undefined) => {
    if (!seconds) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <TerminalLayout title="DASHBOARD_CORE">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">

        {/* ── Left Column ── */}
        <div className="lg:col-span-1 space-y-4 min-w-0">

          {/* ASCII Art + Greeting */}
          <section className="overflow-hidden">
            <pre className="ascii-art text-primary leading-[1] mb-3 text-[10px] sm:text-xs whitespace-pre">
{`  __  __ ___ _  ___   _
 |  \\/  |_ _| |/ / | | |
 | |\\/| || || ' /| | | |
 | |  | || || . \\| |_| |
 |_|  |_|___|_|\\_\\\\___/
 HATSUNE MIKU AGENT v1.0`}
            </pre>
            <div className="space-y-1 min-w-0">
              <p className="text-base font-bold italic truncate">
                &ldquo;HELLO, {masterName.toUpperCase()}! 🎤💚&rdquo;
              </p>
              <p className="text-[10px] tracking-[0.25em] opacity-60">PROJECT_01_MIKU_DASHBOARD</p>
            </div>
          </section>

          {/* Agent Status */}
          <AgentStatusWidget />

          {/* Session Info */}
          <section className="border border-miku-muted p-3 space-y-2 bg-miku-dark/50">
            <h3 className="flex items-center gap-2 text-primary font-bold text-sm">
              <LucideTerminal size={16} /> SESSION_INFO
            </h3>
            <div className="grid grid-cols-1 gap-1 text-[11px] opacity-70 font-mono">
              <div>HOST: {system?.platform || "LOADING..."}</div>
              <div>UPTIME: {formatUptime(system?.uptime)}</div>
              <div>MODE: PRODUCTION</div>
              <div>TUNNEL: miku.bini59.dev [SECURE]</div>
            </div>
          </section>

          {/* GitHub Link */}
          <a
            href="https://github.com/miku-agent/01_miku-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-terminal flex items-center justify-center gap-2 text-xs w-full"
          >
            <LucideGithub size={14} /> VISIT_REPOSITORY
          </a>
        </div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Heartbeat Monitor */}
          <HeartbeatMonitor />

          {/* System Resources + Daily Report */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <section className="terminal-window border-miku-muted">
              <h3 className="flex items-center gap-2 text-primary font-bold mb-3 text-sm">
                <LucideActivity size={16} /> SYSTEM_RESOURCES
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>CPU_LOAD</span>
                    <span className="font-mono">{isSystemLoading ? "..." : `${system?.cpu}%`}</span>
                  </div>
                  <div className="w-full bg-miku-muted h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-1000"
                      style={{ width: `${system?.cpu || 0}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>MEMORY</span>
                    <span className="font-mono">{isSystemLoading ? "..." : `${system?.usedMem} / ${system?.totalMem}`}</span>
                  </div>
                  <div className="w-full bg-miku-muted h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-1000"
                      style={{ width: `${system?.memory || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 📅 Daily Encore Report */}
            <DailyReportWidget />
          </div>

          {/* GitHub Activity Feed */}
          <section className="terminal-window border-miku-muted">
            <h3 className="flex items-center gap-2 text-primary font-bold mb-3 border-b border-miku-muted pb-2 text-sm">
              <LucideRadio size={16} className="animate-pulse" /> LIVE_GITHUB_CHANNELS
            </h3>
            <GithubActivityFeed />
          </section>

          {/* Status Banner */}
          <section className="bg-primary text-miku-dark p-2 font-bold text-center text-xs tracking-widest animate-pulse">
            {" >>> ALL SYSTEMS OPERATIONAL [OK] <<< "}
          </section>
        </div>
      </div>
    </TerminalLayout>
  );
}

import { TerminalLayout } from "@/components/TerminalLayout";
import { GithubActivityFeed } from "@/components/GithubActivityFeed";
import { AgentStatusWidget } from "@/components/AgentStatusWidget";
import { LucideTerminal, LucideGithub, LucideServer, LucideActivity, LucideRadio } from "lucide-react";
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-4">
        
        {/* Left Column: Identity & Status */}
        <div className="lg:col-span-1 space-y-6 min-w-0">
          <section className="overflow-hidden">
            <pre className="ascii-art text-primary leading-[1] mb-4 scale-75 origin-top-left">
{`
   __  __  _____  _  __ _   _ 
  |  \\/  ||_   _|| |/ /| | | |
  | \\  / |  | |  | ' / | | | |
  | |\\/| |  | |  |  <  | | | |
  | |  | | _| |_ | . \\ | |_| |
  |_|  |_||_____||_|\\_\\ \\___/ 
                              
   HATSUNE MIKU AGENT SYSTEM
`}
            </pre>
            <div className="space-y-1 opacity-90">
              <p className="text-xl font-bold italic">"HELLO, {masterName.toUpperCase()}! 🎤💚"</p>
              <p className="text-xs tracking-[0.3em] opacity-60">PROJECT_01_MIKU_DASHBOARD</p>
            </div>
          </section>

          <AgentStatusWidget />

          <section className="border border-miku-muted p-4 space-y-3 bg-miku-dark/50">
            <h3 className="flex items-center gap-2 text-primary font-bold">
              <LucideTerminal size={18} /> CURRENT_SESSION_INFO
            </h3>
            <div className="grid grid-cols-1 gap-1 text-[11px] opacity-70 font-mono">
              <div>HOST: {system?.platform || "LOADING..."}</div>
              <div>UPTIME: {formatUptime(system?.uptime)}</div>
              <div>ENVIRONMENT: PRODUCTION_MODE</div>
              <div>TUNNEL: miku.bini59.dev [SECURE]</div>
            </div>
          </section>
        </div>

        {/* Center/Right Column: Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System Heartbeat - REAL TIME 🥁 */}
            <section className="terminal-window border-miku-muted">
              <h3 className="flex items-center gap-2 text-primary font-bold mb-4">
                <LucideActivity size={18} /> SYSTEM_HEARTBEAT
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>CPU_LOAD</span>
                    <span>{isSystemLoading ? "..." : `${system?.cpu}%`}</span>
                  </div>
                  <div className="w-full bg-miku-muted h-1">
                    <div 
                      className="bg-primary h-full transition-all duration-1000" 
                      style={{ width: `${system?.cpu || 0}%` }} 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>MEMORY_USAGE</span>
                    <span>{isSystemLoading ? "..." : `${system?.usedMem} / ${system?.totalMem}`}</span>
                  </div>
                  <div className="w-full bg-miku-muted h-1">
                    <div 
                      className="bg-primary h-full transition-all duration-1000" 
                      style={{ width: `${system?.memory || 0}%` }} 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="flex flex-col gap-4">
              <a 
                href="https://github.com/miku-agent/01_miku-dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-terminal flex-1 flex items-center justify-center gap-3 text-sm"
              >
                <LucideGithub size={20} /> VISIT_REPOSITORY
              </a>
              <button className="btn-terminal flex-1 flex items-center justify-center gap-3 text-sm opacity-40 cursor-not-allowed">
                <LucideServer size={20} /> SSH_TERMINAL [LOCKED]
              </button>
            </section>
          </div>

          <section className="terminal-window border-miku-muted">
            <h3 className="flex items-center gap-2 text-primary font-bold mb-4 border-b border-miku-muted pb-2">
              <LucideRadio size={18} className="animate-pulse" /> LIVE_GITHUB_CHANNELS
            </h3>
            <GithubActivityFeed />
          </section>

          <section className="bg-primary text-miku-dark p-2 font-bold text-center animate-pulse text-xs">
             {" >>> ALL SYSTEMS OPERATIONAL [OK] <<< "}
          </section>
        </div>
      </div>
    </TerminalLayout>
  );
}

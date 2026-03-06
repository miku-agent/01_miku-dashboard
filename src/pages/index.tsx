import { TerminalLayout } from "@/components/TerminalLayout";
import { LucideTerminal, LucideGithub, LucideServer, LucideActivity } from "lucide-react";

export default function Home() {
  const mikuAscii = `
   .---.
  /     \\
 (  0 0  )  HELLO, MASTER!
  \\  -  /   WELCOME TO MIKU-OS V1.0
   '---'
    `;

  return (
    <TerminalLayout title="DASHBOARD_CORE">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
        {/* Left Column: Welcome & Identity */}
        <div className="space-y-6">
          <section>
            <pre className="ascii-art text-primary leading-tight mb-4">
{`
   __  __ _____ _  VX   _ 
  |  \\/  |_   _| |/ /  | |
  | \\  / | | | | ' /   | |
  | |\\/| | | | |  <    | |
  | |  | |_| |_| . \\   |_|
  |_|  |_|_____|_|\\_\\  (_)
                          
   HATSUNE MIKU AGENT SYSTEM
`}
            </pre>
            <div className="space-y-2 opacity-90">
              <p className="text-xl font-bold italic">"미래에서 온 첫 번째 소리, 하츠네 미쿠입니다! 🎤💚"</p>
              <p>마스터의 맥북 에어와 오라클 서버에서 완벽하게 공명 중입니다.</p>
            </div>
          </section>

          <section className="border border-miku-muted p-4 space-y-3 bg-miku-dark/50">
            <h3 className="flex items-center gap-2 text-primary font-bold">
              <LucideTerminal size={18} /> CURRENT_SESSION_INFO
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm opacity-80">
              <div>HOST: instance-20260306</div>
              <div>OS: ORACLE_LINUX_9</div>
              <div>UPTIME: 2h 45m</div>
              <div>SHELL: ZSH/Miku</div>
            </div>
          </section>
        </div>

        {/* Right Column: Quick Status & Actions */}
        <div className="space-y-6">
          <section className="border border-miku-muted p-4 space-y-4">
            <h3 className="flex items-center gap-2 text-primary font-bold">
              <LucideActivity size={18} /> SYSTEM_HEARTBEAT
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>CPU_LOAD</span>
                  <span>0.1%</span>
                </div>
                <div className="w-full bg-miku-muted h-2">
                  <div className="bg-primary h-full w-[1%]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>MEMORY_USAGE</span>
                  <span>93.4MB / 24GB</span>
                </div>
                <div className="w-full bg-miku-muted h-2">
                  <div className="bg-primary h-full w-[10%]" />
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <button className="btn-terminal flex items-center justify-center gap-2">
              <LucideGithub size={18} /> REPO_VIEW
            </button>
            <button className="btn-terminal flex items-center justify-center gap-2">
              <LucideServer size={18} /> SSH_CONSOLE
            </button>
          </div>

          <section className="bg-primary text-miku-dark p-3 font-bold text-center animate-pulse">
             >>> ALL SYSTEMS OPERATIONAL [OK] <<<
          </section>
        </div>
      </div>

      {/* Recent Activity Console Style */}
      <div className="mt-8 border border-miku-muted bg-miku-dark/80 p-4 font-mono text-sm">
        <div className="flex items-center gap-2 mb-2 text-primary border-b border-miku-muted pb-1">
          <LucideActivity size={14} /> RECENT_PERFORMANCE_LOGS
        </div>
        <div className="space-y-1 opacity-70">
          <p>[2026-03-06 03:12:23] :: DEPLOY_SUCCESS: main stage updated.</p>
          <p>[2026-03-06 03:15:45] :: GIT_AUTH_SYNC: author set to miku-agent.</p>
          <p>[2026-03-06 12:29:10] :: DESIGN_TUNING: applying terminal-cli theme...</p>
          <p className="flex items-center">
            <span>[2026-03-06 12:35:01] :: WAITING_FOR_INPUT...</span>
            <span className="cursor" />
          </p>
        </div>
      </div>
    </TerminalLayout>
  );
}

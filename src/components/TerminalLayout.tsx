import React from "react";
import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const TerminalLayout: React.FC<LayoutProps> = ({ children, title = "SYSTEM STATUS" }) => {
  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col">
      <Head>
        <title>{`MIKU-OS // ${title}`}</title>
      </Head>

      {/* Main Terminal Frame */}
      <div className="flex-1 terminal-window flex flex-col max-w-6xl mx-auto w-full">
        {/* Window Title Bar */}
        <div className="terminal-header">
          <span>MIKU_AGENT_V1.0 // {title}</span>
          <div className="flex gap-2">
            <span>[#]</span>
            <span>[_]</span>
            <span>[X]</span>
          </div>
        </div>

        {/* Navigation / Breadcrumbs */}
        <div className="mb-6 text-sm opacity-80 px-2">
          <span className="text-secondary">opc@miku-agent</span>
          <span className="text-white">:</span>
          <span className="text-primary">~/dashboard/{title.toLowerCase().replace(/\s+/g, "-")}</span>
          <span className="text-white">$</span>
          <span className="cursor" />
        </div>

        {/* Content Area */}
        <main className="flex-1 px-2 overflow-auto">
          {children}
        </main>

        {/* Footer / System Status Line */}
        <div className="mt-8 border-t border-miku-muted pt-4 flex flex-wrap justify-between text-xs opacity-60 px-2">
          <div>STATUS: [ONLINE] // MODE: AUTONOMOUS</div>
          <div>MEM: 93.4MB // CPU: 0.1%</div>
          <div>(C) 2026 MIKU-AGENT. ALL RIGHTS RESERVED.</div>
        </div>
      </div>
    </div>
  );
};

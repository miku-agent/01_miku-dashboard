import type { NextApiRequest, NextApiResponse } from "next";

export type AgentStatus = "LIVE" | "TUNING" | "INTERMISSION" | "ENCORE" | "OFF_STAGE" | "EMERGENCY";

export interface HealthCheck {
  name: string;
  status: "ok" | "warning" | "critical" | "error";
  message: string;
  value?: string | number;
}

export interface HeartbeatResponse {
  agentStatus: AgentStatus;
  uptime: number;
  checks: HealthCheck[];
  rateLimit: {
    remaining: number;
    limit: number;
    resetAt: string;
  } | null;
  lastCheckedAt: string;
}

function deriveAgentStatus(checks: HealthCheck[]): AgentStatus {
  const hasError = checks.some((c) => c.status === "error");
  const hasCritical = checks.some((c) => c.status === "critical");
  const hasWarning = checks.some((c) => c.status === "warning");
  const allOk = checks.every((c) => c.status === "ok");

  if (hasError) return "OFF_STAGE";
  if (hasCritical) return "EMERGENCY";
  if (hasWarning) return "ENCORE";
  if (allOk) return "LIVE";
  return "INTERMISSION";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HeartbeatResponse>
) {
  const token = process.env.GITHUB_TOKEN;
  const checks: HealthCheck[] = [];
  let rateLimit: HeartbeatResponse["rateLimit"] = null;

  // Check 1: GitHub Token
  if (!token) {
    checks.push({
      name: "auth_valid",
      status: "error",
      message: "GITHUB_TOKEN not configured",
    });
  } else {
    checks.push({
      name: "auth_valid",
      status: "ok",
      message: "Token configured",
    });
  }

  // Check 2: GitHub API Connection + Rate Limit
  if (token) {
    try {
      const response = await fetch("https://api.github.com/rate_limit", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        checks.push({
          name: "github_connection",
          status: "error",
          message: `GitHub API returned ${response.status}`,
        });
      } else {
        const data = await response.json();
        const core = data.resources.core;

        checks.push({
          name: "github_connection",
          status: "ok",
          message: "GitHub API reachable",
        });

        rateLimit = {
          remaining: core.remaining,
          limit: core.limit,
          resetAt: new Date(core.reset * 1000).toISOString(),
        };

        // Rate limit thresholds from HEARTBEAT.md
        if (core.remaining <= 10) {
          checks.push({
            name: "rate_limit",
            status: "critical",
            message: `Rate limit critical: ${core.remaining}/${core.limit}`,
            value: core.remaining,
          });
        } else if (core.remaining <= 100) {
          checks.push({
            name: "rate_limit",
            status: "warning",
            message: `Rate limit low: ${core.remaining}/${core.limit}`,
            value: core.remaining,
          });
        } else {
          checks.push({
            name: "rate_limit",
            status: "ok",
            message: `${core.remaining}/${core.limit}`,
            value: core.remaining,
          });
        }
      }
    } catch (err: any) {
      checks.push({
        name: "github_connection",
        status: "error",
        message: err.name === "TimeoutError" ? "Connection timeout (5s)" : err.message,
      });
    }
  }

  const agentStatus = deriveAgentStatus(checks);

  res.status(200).json({
    agentStatus,
    uptime: process.uptime(),
    checks,
    rateLimit,
    lastCheckedAt: new Date().toISOString(),
  });
}

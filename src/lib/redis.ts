import { createClient } from "redis";

// redis v5 타입이 프로젝트 TS 설정과 충돌하는 케이스가 있어,
// 여기서는 연결 안정성 우선으로 최소 타입(any)만 사용해요.
let client: any = null;
let connecting: Promise<any> | null = null;

export async function getRedis(): Promise<any> {
  const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";

  if (client?.isOpen) return client;
  if (connecting) return connecting;

  const next: any = createClient({ url });

  connecting = (async () => {
    next.on("error", (err: any) => {
      // eslint-disable-next-line no-console
      console.error("[redis]", err);
    });
    await next.connect();
    client = next;
    return next;
  })();

  return connecting;
}

START
Feather Helper – API Playbook
Rumble Boxing • Music-Driven Combo Generator

What is Feather?

A tiny wrapper every coder-agent must use instead of fetch/axios.
Stub path: packages/shared-types/feather-stub.ts

Interface (TypeScript): export interface FeatherCallOptions { url: string; // e.g. /api/v1/songs method: 'GET' | 'POST'; data?: any; // JSON or FormData headers?: Record<string,string>; } export interface FeatherCallResponse<T = any> { status: number; data: T; headers: Record<string,string>; } export async function call<T = any>( opts: FeatherCallOptions ): Promise<FeatherCallResponse<T>>;

• Non-2xx throws FeatherError { status, data }.
• Prod SDK repo: https://github.com/kingbootoshi/feather

Backend endpoints (prefix /api/v1)

POST /songs – upload MP3
GET /songs/{songId}/analysis – poll analysis
GET /songs/{songId}/combos – fetch combos
POST /songs/{songId}/combos/regenerate – regenerate combos

JSON contracts live in PRD §5.

Minimal happy path (pseudo-code)

const fd = new FormData(); fd.append('file', blob, 'track.mp3'); const up = await call({ url:'/api/v1/songs', method:'POST', data:fd }); const songId = up.data.songId;

for (let i=0;i<6;i++){ await wait(2**i*1000); const res = await call({ url:/api/v1/songs/${songId}/analysis, method:'GET' }); if (res.data.status==='completed') break; if (res.data.status==='failed') throw new Error(res.data.errorMessage); }

const combos = await call({ url:/api/v1/songs/${songId}/combos, method:'GET' });

await call({ url:/api/v1/songs/${songId}/combos/regenerate, method:'POST', data:{ excludeComboIds:[combos.data.combos[0].comboId], count:1 } });

Rules & limits

• Upload = multipart/form-data, field name "file", .mp3, ≤ 15 MB.
• Rate-limit: 20 uploads per user per hour (burst 5).
• Retry 429 or 5xx with back-off 2s→4s→8s→16s→32s (max 5).
• Flag variableBpm:true may appear; ignore for MVP.

Error table

400/413 – bad payload → fix & retry
404 – invalid songId → stop polling
429 – rate-limited → follow back-off
5xx – transient server → back-off retry (≤5)


OPENROUTER_API_KEY=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
OPENPIPE_API_KEY=opk_eabb040c844dccf34b5275c7f0c7ce604b064b090f
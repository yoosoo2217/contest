import { NextResponse } from "next/server";

const SAFE182_ENDPOINT = "https://www.safe182.go.kr/api/lcm/findChildList.do";
const ROW_SIZE = 6;

interface Safe182RawRecord {
  rnum?: number;
  occrde?: number | string;
  alldressingDscd?: string;
  ageNow?: number;
  age?: number;
  writngTrgetDscd?: string;
  sexdstnDscd?: string;
  etcSpfeatr?: string;
  occrAdres?: string;
  nm?: string;
  msspsnIdntfccd?: string | number;
  tknphotolength?: number;
  tknphotoFile?: string;
}

interface Safe182Response {
  result: string;
  msg?: string;
  totalCount?: number;
  list?: Safe182RawRecord[];
}

export interface MissingPersonRecord {
  id: string;
  name: string | null;
  ageThen: number | null;
  ageNow: number | null;
  gender: string | null;
  occurredOn: string | null;
  location: string | null;
  clothing: string | null;
  photoDataUrl: string | null;
}

function formatDate(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value);
  if (/^\d{8}$/.test(s)) {
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  }
  return s || null;
}

export async function GET() {
  const esntlId = process.env.SAFE182_ESNTL_ID;
  const authKey = process.env.SAFE182_AUTH_KEY;

  if (!esntlId || !authKey) {
    // Never log the values themselves — only that they're missing.
    console.error(
      "[missing-persons] SAFE182_ESNTL_ID / SAFE182_AUTH_KEY are not configured."
    );
    return NextResponse.json({ error: "SERVER_CONFIG_ERROR" }, { status: 500 });
  }

  const body = new URLSearchParams({
    esntlId,
    authKey,
    rowSize: String(ROW_SIZE),
  });

  let upstream: Response;
  try {
    upstream = await fetch(SAFE182_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      // Short-lived cache so repeated page loads don't hammer the upstream API.
      next: { revalidate: 300 },
    });
  } catch (err) {
    console.error(
      "[missing-persons] Failed to reach Safe182:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json({ error: "UPSTREAM_UNREACHABLE" }, { status: 502 });
  }

  let data: Safe182Response;
  try {
    data = (await upstream.json()) as Safe182Response;
  } catch {
    console.error("[missing-persons] Safe182 response was not valid JSON.");
    return NextResponse.json({ error: "UPSTREAM_INVALID_RESPONSE" }, { status: 502 });
  }

  if (data.result === "80") {
    return NextResponse.json(
      { error: "RATE_LIMITED", message: data.msg ?? null },
      { status: 429 }
    );
  }

  if (data.result === "99") {
    console.error(
      "[missing-persons] Safe182 rejected the request (result 99 — missing required field). Check SAFE182_ESNTL_ID / SAFE182_AUTH_KEY / rowSize are being sent."
    );
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 500 });
  }

  if (data.result !== "00") {
    console.error(
      "[missing-persons] Safe182 returned an unexpected result code:",
      data.result,
      data.msg
    );
    return NextResponse.json({ error: "UPSTREAM_ERROR" }, { status: 502 });
  }

  const list = Array.isArray(data.list) ? data.list : [];
  const records: MissingPersonRecord[] = list.slice(0, ROW_SIZE).map((item) => ({
    id: String(item.msspsnIdntfccd ?? item.rnum ?? item.nm ?? Math.random()),
    name: item.nm ?? null,
    ageThen: typeof item.age === "number" ? item.age : null,
    ageNow: typeof item.ageNow === "number" ? item.ageNow : null,
    gender: item.sexdstnDscd ?? null,
    occurredOn: formatDate(item.occrde),
    location: item.occrAdres ?? null,
    clothing: item.alldressingDscd ?? null,
    // tknphotoFile is the only field the live API actually returns for photo
    // data — a base64-encoded JPEG. tknphotolength is just its byte length,
    // not a URL. There is no documented photo URL or detail-page endpoint,
    // so we never construct one.
    photoDataUrl: item.tknphotoFile
      ? `data:image/jpeg;base64,${item.tknphotoFile}`
      : null,
  }));

  return NextResponse.json({ records, totalCount: data.totalCount ?? null });
}

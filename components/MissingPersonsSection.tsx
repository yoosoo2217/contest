"use client";

import { useCallback, useEffect, useState } from "react";

interface MissingPersonRecord {
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

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; records: MissingPersonRecord[] };

const SAFE182_LIST_URL = "https://www.safe182.go.kr/home/lcm/lcmMssList.do";

function field(value: string | number | null | undefined, suffix = "") {
  if (value === null || value === undefined || value === "") return "정보 없음";
  return `${value}${suffix}`;
}

export default function MissingPersonsSection() {
  const [state, setState] = useState<FetchState>({ status: "loading" });

  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch("/api/missing-persons");
      const body = await res.json();
      if (!res.ok) {
        throw new Error(typeof body?.error === "string" ? body.error : "REQUEST_FAILED");
      }
      setState({ status: "ready", records: body.records as MissingPersonRecord[] });
    } catch (err) {
      const message =
        err instanceof Error && err.message === "RATE_LIMITED"
          ? "현재 실종자 정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요."
          : "실종자 정보를 불러오지 못했습니다.";
      setState({ status: "error", message });
    }
  }, []);

  const load = useCallback(() => {
    setState({ status: "loading" });
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    // Kicks off the initial data fetch; state updates happen inside
    // fetchRecords' async callbacks, not synchronously in this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecords();
  }, [fetchRecords]);

  return (
    <section className="mt-16 rounded bg-[#FAFAFA] text-neutral-900 px-4 sm:px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="text-[11px] tracking-[0.3em] uppercase text-neutral-500">
            공공 정보 // 실제 데이터
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-wide text-neutral-900">
            실제 실종자 정보
          </h2>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
            아래 정보는 게임 속 이야기와 무관한 실제 실종자 정보이며, 경찰청 안전Dream이 제공하는
            공개 데이터를 실시간으로 가져온 것입니다.
          </p>
        </div>

        {state.status === "loading" && (
          <div className="py-16 text-center text-neutral-500 text-sm">
            실종자 정보를 불러오는 중...
          </div>
        )}

        {state.status === "error" && (
          <div className="py-16 text-center space-y-4">
            <div className="text-neutral-700 text-sm">[ {state.message} ]</div>
            <button
              onClick={load}
              className="px-5 py-2 border border-neutral-300 text-neutral-700 text-sm tracking-wide hover:bg-neutral-100 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {state.status === "ready" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {state.records.map((r) => (
                <MissingPersonCard key={r.id} record={r} />
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-500 border-t border-neutral-200 pt-5">
              <span>자료 출처: 경찰청 안전Dream</span>
              <a
                href={SAFE182_LIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 underline underline-offset-2 hover:text-neutral-900"
              >
                SafetyDream에서 확인 →
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function MissingPersonCard({ record }: { record: MissingPersonRecord }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = record.photoDataUrl && !imgFailed;

  return (
    <div className="border border-neutral-200 bg-white overflow-hidden">
      <div className="aspect-[3/4] bg-neutral-100 flex items-center justify-center">
        {showPhoto ? (
          // Photo comes from the API as inline base64 (data: URL), not a
          // remote domain, so a plain <img> is used rather than next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={record.photoDataUrl!}
            alt={`${record.name ?? "실종자"} 사진`}
            className="w-full h-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="text-neutral-400 text-xs tracking-wide">
            [ 실종자 사진 없음 ]
          </span>
        )}
      </div>
      <div className="p-4 space-y-1.5 text-sm">
        <div className="text-base font-semibold text-neutral-900 mb-1">
          {field(record.name)}
        </div>
        <Row label="실종 당시 나이" value={field(record.ageThen, "세")} />
        <Row label="현재 나이" value={field(record.ageNow, "세")} />
        <Row label="성별" value={field(record.gender)} />
        <Row label="실종일" value={field(record.occurredOn)} />
        <Row label="발생 장소" value={field(record.location)} />
        <Row label="착의사항" value={field(record.clothing)} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-neutral-500 shrink-0 whitespace-nowrap">{label}</span>
      <span className="text-neutral-800 text-right min-w-0">{value}</span>
    </div>
  );
}

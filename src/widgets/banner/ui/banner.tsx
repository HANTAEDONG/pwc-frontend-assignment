"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

export function Banner() {
  const pathname = usePathname();
  const isGeneralTask = pathname === "/";
  const title = isGeneralTask ? "관심기업 관리 서비스" : "기업 재무제표 조회";

  return (
    <section
      aria-label="배너 영역"
      className="relative w-full h-[240px] flex items-center justify-center overflow-hidden"
    >
      <Image
        src="/assets/banner_bg.png"
        alt=""
        fill
        priority
        fetchPriority="high"
        className="object-cover"
        sizes="100vw"
      />
      <div className="relative z-10 h-[80px] flex flex-col gap-[10px] items-center justify-center">
        <p className="font-semibold text-base leading-[26px] text-center tabular-nums lining-nums">
          PwC 삼일 Acceleration Center
        </p>
        <h1 className="font-bold text-[36px] leading-[44px] text-center tabular-nums lining-nums">
          {title}
        </h1>
      </div>
    </section>
  );
}

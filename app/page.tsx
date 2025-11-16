"use client";

import { useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  FavoriteSection,
  type FavoriteSectionRef,
} from "@/widgets/favorite-section";
import { FavoriteActions } from "@/widgets/favorite-section";
import { favoriteQueryKeys } from "@/entities/favorite/queries";
import { getFavoriteCompanies } from "@/entities/favorite/api";

const DEFAULT_EMAIL = "htd0913@gmail.com";

export default function Page() {
  const sectionRef = useRef<FavoriteSectionRef>(null);
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const page = parseInt(searchParams?.get("page") || "1", 10);
    const prefetchData = async () => {
      await queryClient.prefetchQuery({
        queryKey: favoriteQueryKeys.list(DEFAULT_EMAIL, page),
        queryFn: () => getFavoriteCompanies({ email: DEFAULT_EMAIL, page }),
        staleTime: 5 * 60 * 1000,
      });
    };
    prefetchData();
  }, [queryClient, searchParams]);

  return (
    <div className="flex min-h-[780px] flex-col gap-6 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:h-[59px] w-full justify-between gap-4 sm:gap-0">
        <div className="flex flex-col gap-1 sm:h-[59px] sm:w-[273px]">
          <h2 className="text-xl sm:text-[28px] font-semibold leading-tight sm:leading-[38px] tabular-nums lining-nums font-sans">
            관심기업 관리 서비스
          </h2>
          <p className="text-xs sm:text-sm leading-[100%] text-[#7F7F82] font-sans">
            관심 기업을 등록하고 삭제하며 관리하세요.
          </p>
        </div>
        <FavoriteActions sectionRef={sectionRef} />
      </div>

      <div className="w-full overflow-x-auto">
        <FavoriteSection ref={sectionRef} />
      </div>
    </div>
  );
}

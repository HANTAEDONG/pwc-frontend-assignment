"use client";

import { Suspense, useRef, forwardRef, useImperativeHandle } from "react";

import {
  FavoriteTable,
  type FavoriteTableRef,
} from "@/features/favorite-table";

import { FavoriteTableSkeleton } from "./favorite-table-skeleton";

export interface FavoriteSectionRef {
  getTableRef: () => FavoriteTableRef | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FavoriteSectionProps {}

export const FavoriteSection = forwardRef<
  FavoriteSectionRef,
  FavoriteSectionProps
>(function FavoriteSection(_, ref) {
  const tableRef = useRef<FavoriteTableRef>(null);

  useImperativeHandle(ref, () => ({
    getTableRef: () => tableRef.current,
  }));

  return (
    <section className="w-full">
      <Suspense fallback={<FavoriteTableSkeleton />}>
        <FavoriteTable ref={tableRef} />
      </Suspense>
    </section>
  );
});

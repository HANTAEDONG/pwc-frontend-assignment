"use client";

import { useState } from "react";
import { FavoriteForm } from "@/features/favorite-form";
import { FavoriteTable } from "@/features/favorite-table";
import { useFavorite } from "@/entities/favorite";

export function FavoriteSection() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const { data: favorite } = useFavorite(editingId || "", {
    enabled: !!editingId,
  });

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSuccess = () => {
    setEditingId(null);
  };

  return (
    <section>
      <h2>관심 기업 관리</h2>
      <article>
        <h3>{editingId ? "관심 기업 수정" : "관심 기업 등록"}</h3>
        <FavoriteForm
          favoriteId={editingId || undefined}
          initialData={
            favorite
              ? {
                  companyId: favorite.companyId,
                  companyName: favorite.companyName,
                }
              : undefined
          }
          onSuccess={handleSuccess}
        />
      </article>
      <article>
        <FavoriteTable onEdit={handleEdit} />
      </article>
    </section>
  );
}

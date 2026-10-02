// features/point/components/PointPackageList.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePoints } from "@/features/point/hooks/usePoints";
import { PointCard } from "@/features/point/components/PointCard";
import { PointPackage } from "@/features/point/types/pointTypes";

export const PointPackageList = () => {
  const router = useRouter();
  const { packages, isLoading, error } = usePoints();
  const [selectedPackage, setSelectedPackage] = useState<PointPackage | null>(
    null,
  );

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse space-y-3"
          >
            <div className="h-5 bg-slate-100 rounded w-1/3" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-rose-50/50 rounded-2xl border border-rose-100 p-6 max-w-2xl mx-auto">
        <p className="text-sm font-semibold text-rose-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        {packages.map((item) => (
          <PointCard
            key={item.id}
            item={item}
            isSelected={selectedPackage?.id === item.id}
            onSelectPackage={(pkg) => setSelectedPackage(pkg)}
          />
        ))}
      </div>

      {/* Action Footer */}
      {selectedPackage && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-lg shadow-slate-100 flex items-center justify-between gap-4 sticky bottom-6">
          <div>
            <p className="text-xs text-slate-400">Paket Terpilih</p>
            <p className="text-sm font-extrabold text-slate-900">
              {selectedPackage.name}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              router.push(`/points/checkout?point_id=${selectedPackage.id}`);
            }}
            className="px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-slate-900/10 active:scale-[0.98]"
          >
            Lanjut Pembayaran →
          </button>
        </div>
      )}
    </div>
  );
};

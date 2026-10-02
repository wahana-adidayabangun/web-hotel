// features/point/components/PointCard.tsx
"use client";

import { PointPackage } from "@/features/point/types/pointTypes";

interface PointCardProps {
  item: PointPackage;
  onSelectPackage: (item: PointPackage) => void;
  isSelected?: boolean;
}

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const PointCard = ({
  item,
  onSelectPackage,
  isSelected = false,
}: PointCardProps) => {
  const finalPrice = item.price - item.discount;

  return (
    <div
      onClick={() => onSelectPackage(item)}
      className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-200 border bg-white ${
        isSelected
          ? "border-blue-600 ring-2 ring-blue-600/20 shadow-lg shadow-blue-500/10"
          : "border-slate-100 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      {/* Badge Diskon jika ada */}
      {item.discount > 0 && (
        <span className="absolute -top-3 right-4 bg-rose-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Hemat {formatRupiah(item.discount)}
        </span>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl border border-amber-100">
            P
          </div>

          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
            <p className="text-xs text-slate-500">{item.description}</p>
            <p className="text-xs font-semibold text-blue-600 pt-1">
              + {item.amount.toLocaleString("id-ID")} Poin
            </p>
          </div>
        </div>

        <div className="text-right">
          {item.discount > 0 && (
            <p className="text-xs text-slate-400 line-through">
              {formatRupiah(item.price)}
            </p>
          )}
          <p className="text-lg font-black text-slate-900">
            {formatRupiah(finalPrice)}
          </p>
        </div>
      </div>
    </div>
  );
};

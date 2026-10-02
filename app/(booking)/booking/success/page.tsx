"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookingSuccessCard } from "@/features/booking/components/BookingSuccessCard";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  const successData = {
    booking_id: Number(bookingId) || 1,
    booking_code: "BK-LC1YPIDA",
    total_price: 25000,
    payment_url: null,
    redirect_type: "internal_transfer",
  };

  return <BookingSuccessCard data={successData} />;
}

export default function BookingSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}

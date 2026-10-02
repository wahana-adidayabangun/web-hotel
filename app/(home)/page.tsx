// app/(home)/page.tsx
"use client";

import { Hero } from "@/features/home/components/Hero";
import { HotelSearchForm } from "@/components/HotelSearchForm";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (values: {
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    rooms: number;
    city_id: number | null;
  }) => {
    const params = new URLSearchParams();
    if (values.check_in) params.set("check_in", values.check_in);
    if (values.check_out) params.set("check_out", values.check_out);
    if (values.city_id) params.set("city_id", String(values.city_id));
    params.set("adults", String(values.adults));
    params.set("children", String(values.children));
    params.set("rooms", String(values.rooms));

    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <>
      {/* Hero */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hotel Search */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cari Hotel</h2>
          <HotelSearchForm onSearch={handleSearch} />
        </section>
      </div>
    </>
  );
}

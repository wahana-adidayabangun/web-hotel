// app/(history)/history/[id]/page.tsx

import { HistoryDetailView } from "@/features/history/components/HistoryDetailView";

export const metadata = {
  title: "Detail Booking - App",
  description: "Detail e-tiket dan informasi perjalanan shuttle.",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HistoryDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <HistoryDetailView id={id} />;
}

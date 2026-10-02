// app/(transaction)/transaction/page.tsx

import { TransactionListView } from "@/features/transaction/components/TransactionListView";

export const metadata = {
  title: "Riwayat Transaksi - App",
  description: "Lihat daftar riwayat transaksi pembelian poin Anda.",
};

export default function TransactionPage() {
  return <TransactionListView />;
}

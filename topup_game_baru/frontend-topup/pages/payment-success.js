import { useRouter } from "next/router";
import { parseCookies } from "nookies";

export async function getServerSideProps(context) {
  const { paymentInfo } = parseCookies(context);
  let transactionDetails = null;

  if (paymentInfo) {
    try {
      transactionDetails = JSON.parse(paymentInfo);
      console.log("✅ Transaksi Diterima:", transactionDetails);
    } catch (error) {
      // Handle kesalahan parsing JSON di sini
      console.error("❌ Gagal mengurai cookie paymentInfo:", error);
      transactionDetails = null;
    }
  }

  return {
    props: {
      transactionDetails,
    },
  };
}

export default function PaymentSuccess({ transactionDetails }) {
  const router = useRouter();
  const { orderId } = router.query;

  if (!transactionDetails) {
    return <p className="text-center mt-5">Transaksi tidak ditemukan!</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Transaksi Berhasil!
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Detail Pesanan</h3>
          <p>Nomor Transaksi: {transactionDetails.orderId}</p>
          <p>Waktu Transaksi: {transactionDetails.transactionTime}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Detail Pembayaran</h3>
          <p>Status Pembayaran: Selesai</p>
          <p>Metode Pembayaran: {transactionDetails.paymentType}</p>
          <p>
            Total Transaksi: Rp{" "}
            {transactionDetails.grossAmount.toLocaleString()}
          </p>
        </div>
      </div>
      {/* Tambahkan Detail Produk jika tersedia*/}
    </div>
  );
}

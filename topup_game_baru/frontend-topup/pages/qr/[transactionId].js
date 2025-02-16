import { useRouter } from "next/router";
import { QRCodeCanvas } from "qrcode.react";

export default function QRPage() {
  const router = useRouter();
  const { transactionId, qrValue } = router.query;

  if (!qrValue) {
    return <p className="text-red-500 text-center">QR Code tidak ditemukan!</p>;
  }

  return (
    <div className="text-center mt-5">
      <h2>Scan QR untuk Membayar</h2>
      <p>Transaction ID: {transactionId}</p>
      <QRCodeCanvas value={decodeURIComponent(qrValue)} size={256} level={"H"} />
    </div>
  );
}

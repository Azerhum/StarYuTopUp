import { useRouter } from "next/router";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect } from "react";

export default function QRPage() {
  const router = useRouter();
  const { transactionId, qrValue } = router.query;

  // useEffect(() => {
  //   if (qrValue) {
  //     // Redirect to Midtrans Snap page using the token
  //     window.location.href = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${qrValue}`;
  //   }
  // }, [qrValue]);

  if (!qrValue) {
    return <p className="text-red-500 text-center">QR Code tidak ditemukan!</p>;
  }

  return (
    <div className="text-center mt-5">
      <h2>Scan QR untuk Membayar</h2>
      <p>Transaction ID: {transactionId}</p>
      {/* MODIFIED: Render QR Code */}
      <QRCodeCanvas
        value={`https://app.sandbox.midtrans.com/snap/v2/vtweb/${qrValue}`}
        size={256}
        level={"H"}
      />
      {/* {qrValue && ( //MODIFIED
        <a href={`https://app.sandbox.midtrans.com/snap/v2/vtweb/${qrValue}`} target="_blank" rel="noopener noreferrer">
          Bayar dengan Midtrans
        </a>
      )} */}
    </div>
  );
}

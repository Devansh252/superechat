"use client";

import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TransactionPage() {
  useEffect(() => {
    const showTokenNotifications = () => {
      // Sample token notifications
      const tokens = [
        { amount: "0.05 ETH", from: "0x1234...5678" },
        { amount: "100 USDT", from: "0xabcd...efgh" },
        { amount: "50 MATIC", from: "0x9876...dcba" },
      ];

      tokens.forEach((token, index) => {
        setTimeout(() => {
          toast.success(`🎉 Received ${token.amount} from ${token.from}`, {
            position: "top-right",
            autoClose: 5000,
          });
        }, index * 2000); // Show each notification 2 seconds apart
      });
    };

    showTokenNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-transparent p-4">
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TransactionPage() {
  useEffect(() => {
    const tokens = [
      { symbol: "ETH", minAmount: 0.001, maxAmount: 0.1, decimals: 4, color: "#627EEA" },
      { symbol: "USDT", minAmount: 10, maxAmount: 1000, decimals: 2, color: "#26A17B" },
      { symbol: "MATIC", minAmount: 10, maxAmount: 500, decimals: 2, color: "#8247E5" },
      { symbol: "SOL", minAmount: 1, maxAmount: 100, decimals: 2, color: "#14F195" },
    ];

    const generateRandomAmount = (min: number, max: number, decimals: number) => {
      return (Math.random() * (max - min) + min).toFixed(decimals);
    };

    const generateRandomAddress = () => {
      return '0x' + Array(40).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
    };

    const showRandomTransaction = () => {
      const token = tokens[Math.floor(Math.random() * tokens.length)];
      const amount = generateRandomAmount(token.minAmount, token.maxAmount, token.decimals);
      const address = generateRandomAddress();
      const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

      toast(
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
               style={{ backgroundColor: `${token.color}20` }}>
            <span className="text-lg">💎</span>
          </div>
          <div>
            <div className="font-bold text-lg" style={{ color: token.color }}>
              {amount} {token.symbol}
            </div>
            <div className="text-gray-400 text-sm">
              from {shortAddress}
            </div>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            background: "linear-gradient(to right, #1a1a1a, #2d2d2d)",
            borderLeft: `4px solid ${token.color}`,
            borderRadius: "12px",
          },
        }
      );
    };

    // Show initial notifications
    for (let i = 0; i < 3; i++) {
      setTimeout(() => showRandomTransaction(), i * 1000);
    }

    // Set multiple intervals with different timings for more random feeling
    const intervals = [
      setInterval(showRandomTransaction, 3000),
      setInterval(showRandomTransaction, 5000),
      setInterval(showRandomTransaction, 7000)
    ];

    // Cleanup intervals on unmount
    return () => intervals.forEach(interval => clearInterval(interval));
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={4000}
        limit={5}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
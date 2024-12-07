"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("default");
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  // Add new state for tracking the last checked block
  const [lastCheckedBlock, setLastCheckedBlock] = useState<number>(0);

  // Connect wallet function
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWallet(accounts[0]);
        setProvider(provider);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      toast.error("Please install MetaMask!");
    }
  };

  // Function to check for new transactions
  const checkNewTransactions = async () => {
    if (!provider || !wallet) return;

    try {
      const currentBlock = await provider.getBlockNumber();

      // Only check new blocks
      if (currentBlock > lastCheckedBlock) {
        // Check last 10 blocks if it's the first time
        const startBlock =
          lastCheckedBlock === 0 ? currentBlock - 10 : lastCheckedBlock + 1;

        for (let i = startBlock; i <= currentBlock; i++) {
          const block = await provider.getBlock(i, true);
          if (block && block.transactions) {
            block.transactions.forEach((tx) => {
              if (tx.to?.toLowerCase() === wallet.toLowerCase()) {
                const amount = ethers.formatEther(tx.value);
                setRecentTransactions((prev) =>
                  [
                    {
                      hash: tx.hash,
                      amount,
                      timestamp: new Date().toLocaleString(),
                    },
                    ...prev,
                  ].slice(0, 5)
                );

                // Show toast based on selected template
                switch (selectedTemplate) {
                  case "minimal":
                    toast.success(
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-sm">💰</span>
                        </div>
                        <span className="font-medium">{amount} ETH</span>
                      </div>,
                      {
                        style: {
                          background:
                            "linear-gradient(to right, #2d3748, #1a202c)",
                          borderRadius: "8px",
                          padding: "12px",
                          color: "#fff",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        },
                      }
                    );
                    break;
                  case "detailed":
                    toast.success(
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-sm">💰</span>
                          </div>
                          <div>
                            <p className="font-bold text-sm">
                              New Transaction!
                            </p>
                            <p className="text-gray-300 text-sm">
                              {amount} ETH
                            </p>
                            <p className="text-gray-400 text-xs">
                              From: {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                            </p>
                          </div>
                        </div>
                      </div>,
                      {
                        style: {
                          background:
                            "linear-gradient(to right, #2d3748, #1a202c)",
                          borderRadius: "8px",
                          padding: "12px",
                          color: "#fff",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        },
                      }
                    );
                    break;
                  default:
                    toast.success(
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-sm">💰</span>
                        </div>
                        <div>
                          <p className="font-medium">{amount} ETH</p>
                          <p className="text-gray-300 text-sm">
                            New transaction received!
                          </p>
                        </div>
                      </div>,
                      {
                        style: {
                          background:
                            "linear-gradient(to right, #2d3748, #1a202c)",
                          borderRadius: "8px",
                          padding: "12px",
                          color: "#fff",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        },
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                      }
                    );
                }
              }
            });
          }
        }
        setLastCheckedBlock(currentBlock);
      }
    } catch (error) {
      console.error("Error checking transactions:", error);
    }
  };

  // Add function to simulate transactions
  const simulateDummyTransaction = () => {
    const randomAmount = (Math.random() * 1).toFixed(4);
    const randomAddress =
      "0x" +
      Array(40)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");

    const customToastStyle = {
      background: "linear-gradient(to right, #2d3748, #1a202c)",
      borderRadius: "8px",
      padding: "12px",
      color: "#fff",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    };

    switch (selectedTemplate) {
      case "minimal":
        toast.success(
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm">💰</span>
            </div>
            <span className="font-medium">{randomAmount} ETH</span>
          </div>,
          { style: customToastStyle }
        );
        break;
      case "detailed":
        toast.success(
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm">💰</span>
              </div>
              <div>
                <p className="font-bold text-sm">New Transaction!</p>
                <p className="text-gray-300 text-sm">{randomAmount} ETH</p>
                <p className="text-gray-400 text-xs">
                  From: {randomAddress.slice(0, 6)}...{randomAddress.slice(-4)}
                </p>
              </div>
            </div>
          </div>,
          { style: customToastStyle }
        );
        break;
      default:
        toast.success(
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm">💰</span>
            </div>
            <div>
              <p className="font-medium">{randomAmount} ETH</p>
              <p className="text-gray-300 text-sm">New transaction received!</p>
            </div>
          </div>,
          {
            style: customToastStyle,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
    }
  };

  // Modify the useEffect to include dummy messages
  useEffect(() => {
    if (provider && wallet) {
      // Initial check
      checkNewTransactions();

      // Set up polling interval (every 15 seconds)
      const interval = setInterval(checkNewTransactions, 15000);

      // Also keep the block listener for real-time updates
      provider.on("block", async (blockNumber) => {
        setLastCheckedBlock(blockNumber - 1); // Trigger polling check
      });
    }

    return () => {
      if (provider) {
        provider.removeAllListeners();
      }
    };
  }, [provider, wallet, selectedTemplate]);

  return (
    <div className="min-h-screen bg-transparent p-4 flex items-center justify-center">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
            <img 
              src="/Superr.png" 
              alt="Superr Chat Logo" 
              className="w-24 h-24 rounded-full relative z-10 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-gray-800" 
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-8 text-center">
          Superr Chat
        </h1>
        {!wallet ? (
          <button
            onClick={connectWallet}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/25 transform hover:scale-[1.02]"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-5">
            <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700">
              <p className="text-gray-400 mb-2 text-sm font-medium">Connected Wallet</p>
              <p className="text-white font-semibold tracking-wide">
                {wallet.slice(0, 6)}...{wallet.slice(-4)}
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700">
              <p className="text-gray-400 mb-3 text-sm font-medium">Select Toast Template</p>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full bg-gray-900/90 text-white p-3 rounded-lg mb-4 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
              >
                <option value="default">Default</option>
                <option value="minimal">Minimal</option>
                <option value="detailed">Detailed</option>
              </select>

              <button
                onClick={simulateDummyTransaction}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/25 transform hover:scale-[1.02]"
              >
                Simulate Transaction
              </button>
            </div>
          </div>
        )}
      </div>
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

import { useParams } from "react-router-dom";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { createTransferTransaction } from "../lib/solana";
import { WalletConnectButton } from "../components/WalletButton";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function Pay() {
  const { address } = useParams();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handlePay = async () => {
    if (!publicKey || !address || !amount) return;
    
    try {
      setStatus("loading");
      setError("");
      
      const receiverPubkey = new PublicKey(address);
      const transaction = await createTransferTransaction(
        publicKey,
        receiverPubkey,
        parseFloat(amount)
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");

      // Save to backend
      await fetch("/api/tx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: publicKey.toBase58(),
          receiver: address,
          amount: parseFloat(amount),
          signature
        }),
      });

      setStatus("success");
    } catch (e: any) {
      console.error(e);
      setStatus("error");
      setError(e.message || "Transaction failed");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card max-w-md w-full text-center py-12"
        >
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Sent!</h2>
          <p className="text-gray-400 mb-8">Successfully sent {amount} SOL to receiver.</p>
          <button 
            onClick={() => { setStatus("idle"); setAmount(""); }}
            className="btn-primary"
          >
            Send Another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0A0A0A]">
      <div className="max-w-md w-full py-12">
        <div className="text-center mb-12">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#9945FF] to-[#14F195] rounded-xl mx-auto mb-6"></div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-4">Payment Terminal</h1>
          <div className="inline-block px-3 py-1.5 bg-[#161616] border border-[#262626] rounded-full">
            <p className="text-[10px] text-neutral-400 font-mono break-all">{address?.slice(0, 12)}...{address?.slice(-12)}</p>
          </div>
        </div>

        <div className="glass-card space-y-10">
          {!publicKey ? (
            <div className="text-center py-6">
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-10 leading-relaxed">
                Connect your identity to initiate settlement
              </p>
              <div className="flex justify-center">
                <WalletConnectButton />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="label-secondary">Amount (SOL)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-field w-full pr-16 text-3xl h-20 text-center"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-600 font-bold text-xs uppercase tracking-widest">SOL</span>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0A0A0A] border border-[#262626] rounded-xl">
                    <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest mb-1">Receiver Settlement</p>
                    <p className="text-sm font-mono text-white">{(parseFloat(amount || "0") * 0.99).toFixed(4)} <span className="text-[10px] text-neutral-500">SOL</span></p>
                  </div>
                  <div className="p-4 bg-[#0A0A0A] border border-[#262626] rounded-xl">
                    <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest mb-1">Protocol Fee</p>
                    <p className="text-sm font-mono text-white">{(parseFloat(amount || "0") * 0.01).toFixed(4)} <span className="text-[10px] text-neutral-500">SOL</span></p>
                  </div>
                </div>
              </div>

              {status === "error" && (
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-3 text-red-400 text-[11px] font-medium uppercase tracking-widest">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button 
                onClick={handlePay}
                disabled={status === "loading" || !amount || parseFloat(amount) <= 0}
                className="btn-primary w-full h-16 text-xs flex items-center justify-center gap-3 disabled:bg-[#161616] disabled:text-neutral-700 disabled:border-[#262626]"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> BROADCASTING...
                  </>
                ) : (
                  <>
                    <Send size={16} /> CONFIRM SETTLEMENT
                  </>
                )}
              </button>
            </>
          )}
        </div>
        
        <div className="mt-12 flex justify-between items-center text-[#262626]">
          <p className="text-[9px] uppercase font-bold tracking-[0.2em]">Secured by Solana</p>
          <p className="text-[9px] uppercase font-bold tracking-[0.2em]">Link V1.0</p>
        </div>
      </div>
    </div>
  );
}

import { useWallet } from "@solana/wallet-adapter-react";
import { Copy, ExternalLink, Zap } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { WalletConnectButton } from "../components/WalletButton";

export default function Home() {
  const { publicKey } = useWallet();
  const [copied, setCopied] = useState(false);

  const payLink = publicKey ? `${window.location.origin}/pay/${publicKey.toBase58()}` : "";

  const copyLink = () => {
    if (!payLink) return;
    navigator.clipboard.writeText(payLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#262626] text-[#14F195] text-[10px] font-bold uppercase tracking-widest mb-6">
          <div className="w-1.5 h-1.5 bg-[#14F195] rounded-full"></div>
          Solana Devnet
        </span>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
          DECENTRALIZED <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">PAYMENTS.</span>
        </h1>
        <p className="text-lg text-neutral-500 max-w-xl mx-auto font-medium">
          Generate high-conversion payment links connected directly to your Phantom wallet.
        </p>
      </motion.div>

      <div className="glass-card max-w-xl mx-auto">
        {!publicKey ? (
          <div className="text-center py-12">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-8">Connect wallet to issue links</h3>
            <div className="flex justify-center">
              <WalletConnectButton />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <label className="label-secondary">Your Link ID</label>
              <div className="relative">
                <input 
                  type="text" 
                  readOnly 
                  value={payLink}
                  className="input-field w-full pr-16"
                />
                <button 
                  onClick={copyLink}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black text-[10px] font-bold py-1.5 px-3 rounded-lg hover:bg-neutral-200 transition-colors uppercase tracking-wider"
                >
                  {copied ? "COPIED" : "COPY"}
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#0A0A0A] border border-[#262626] rounded-xl flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#9945FF] to-[#14F195] flex items-center justify-center shrink-0">
                <Zap size={16} className="text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Treasury Protocol</h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  1% protocol fee is routed to the treasury. 99% is settled instantly to your address.
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <a 
                href={payLink} 
                target="_blank" 
                rel="noreferrer"
                className="btn-primary w-full flex justify-center items-center gap-2"
              >
                OPEN PAYMENT TERMINAL <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

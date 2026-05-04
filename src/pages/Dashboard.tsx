import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState, Fragment } from "react";
import { ArrowUpRight, ArrowDownLeft, Clock, Wallet, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "motion/react";

export default function Dashboard() {
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) {
      fetch(`/api/tx?address=${publicKey.toBase58()}`)
        .then(res => res.json())
        .then(data => {
          setTransactions(data);
          setLoading(false);
        });
    }
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <Wallet size={48} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Wallet Disconnected</h2>
          <p className="text-gray-400">Please connect your Phantom wallet to view your history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-[#262626]">
        <div>
          <h1 className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-4">Identity Terminal</h1>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#161616] border border-[#262626] rounded-xl flex items-center justify-center text-white">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-white tracking-tight">
                {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-[#14F195] rounded-full animate-pulse"></div>
                <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Authenticated</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#161616] border border-[#262626] rounded-2xl p-4 flex items-center gap-6">
          <div className="p-2 bg-white rounded-lg">
            <QRCodeSVG value={publicKey.toBase58()} size={60} bgColor="#ffffff" fgColor="#000000" />
          </div>
          <div className="pr-4 border-r border-[#262626]">
            <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest mb-1">Status</p>
            <p className="text-[11px] font-mono text-[#14F195] bg-[#14F19510] px-1.5 py-0.5 rounded">DEVNET ACTIVE</p>
          </div>
          <div>
            <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest mb-1">Volume</p>
            <p className="text-lg font-bold font-mono">0.00 <span className="text-xs font-normal text-neutral-600">SOL</span></p>
          </div>
        </div>
      </header>

      <section className="bg-[#161616] border border-[#262626] rounded-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#262626] flex justify-between items-center bg-[#1c1c1c]">
          <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-[0.2em] flex items-center gap-2">
            <Clock size={14} className="text-[#14F195]" /> Recent Activity
          </h2>
          <span className="text-[10px] font-mono text-neutral-500">REAL-TIME SYNC</span>
        </div>
        
        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-neutral-600 animate-pulse text-xs uppercase tracking-widest font-bold">Scanning Blockchain...</div>
          ) : transactions.length === 0 ? (
            <div className="py-20 text-center text-neutral-600 text-xs uppercase tracking-widest font-bold">No Records Identified</div>
          ) : (
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase text-neutral-600 font-bold border-b border-[#262626] bg-[#121212]">
                <tr>
                  <th className="py-4 px-6 tracking-widest">Event</th>
                  <th className="py-4 px-6 tracking-widest">Settlement</th>
                  <th className="py-4 px-6 tracking-widest">Counterparty</th>
                  <th className="py-4 px-6 tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626] font-mono text-[11px]">
                {transactions.map((tx) => (
                  <Fragment key={tx.id}>
                    <tr 
                      onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
                      className="hover:bg-[#1c1c1c] transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6 text-neutral-300">
                        <div className="flex items-center gap-3">
                          {expandedId === tx.id ? <ChevronUp size={12} className="text-[#14F195]" /> : <ChevronDown size={12} className="text-neutral-600 group-hover:text-neutral-400" />}
                          {tx.receiver === publicKey.toBase58() ? "INCOMING" : "OUTGOING"}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-white uppercase">
                        {tx.amount} SOL
                      </td>
                      <td className="py-4 px-6 text-neutral-500 text-[10px]">
                        {tx.receiver === publicKey.toBase58() ? tx.sender : tx.receiver}
                      </td>
                      <td className="py-4 px-6">
                        <span className="badge-success">SUCCESS</span>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedId === tx.id && (
                        <tr>
                          <td colSpan={4} className="p-0 border-none">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-[#121212]"
                            >
                              <div className="p-6 grid grid-cols-2 gap-8 border-t border-[#262626]/50">
                                <div>
                                  <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest mb-2">Transaction Signature</p>
                                  <div className="flex items-center gap-2">
                                    <p className="text-[10px] text-neutral-400 break-all">{tx.signature}</p>
                                    <a 
                                      href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="text-neutral-600 hover:text-white shrink-0"
                                    >
                                      <ExternalLink size={12} />
                                    </a>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest mb-2">Timestamp</p>
                                  <p className="text-[10px] text-neutral-400">{new Date(tx.timestamp).toLocaleString()}</p>
                                  <p className="text-[9px] text-neutral-700 mt-1 uppercase font-bold tracking-widest">Network: Devnet</p>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="p-4 bg-[#0A0A0A] border-t border-[#262626] flex justify-between items-center">
          <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest">Global Ledger V1.0</p>
          <button className="text-[9px] text-white hover:underline uppercase font-bold tracking-widest">Sync Metrics</button>
        </div>
      </section>
    </div>
  );
}

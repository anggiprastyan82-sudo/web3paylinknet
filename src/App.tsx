import React, { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { motion, AnimatePresence } from "motion/react";
import { SidebarItem } from "./components/Sidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Pay from "./pages/Pay";
import { WalletConnectButton } from "./components/WalletButton";
import { LayoutDashboard, Link as LinkIcon, Send } from "lucide-react";

import "@solana/wallet-adapter-react-ui/styles.css";

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - only show if not on public pay page */}
      {!location.pathname.startsWith("/pay/") && (
        <aside className="w-64 border-r border-[#262626] p-6 flex flex-col gap-6 hidden md:flex bg-[#0A0A0A]">
          <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#9945FF] to-[#14F195] rounded-lg"></div>
            SOLPAY
          </div>
          <nav className="flex flex-col gap-1">
            <Link to="/">
              <SidebarItem icon={<LinkIcon size={18} />} label="Link Creator" active={location.pathname === "/"} />
            </Link>
            <Link to="/dashboard">
              <SidebarItem icon={<LayoutDashboard size={18} />} label="Activity" active={location.pathname === "/dashboard"} />
            </Link>
          </nav>
          <div className="mt-auto border-t border-[#262626] pt-6">
            <WalletConnectButton />
          </div>
        </aside>
      )}

      <main className="flex-1 flex flex-col overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pay/:address" element={<Pay />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <AppContent />
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

export function WalletConnectButton() {
  return (
    <div className="wallet-adapter-button-trigger">
      <WalletMultiButton className="!bg-[#161616] !border !border-[#262626] !text-white !rounded-full !py-1.5 !px-4 !text-xs !font-medium !uppercase !tracking-wider !transition-colors !hover:!border-neutral-400" />
    </div>
  );
}

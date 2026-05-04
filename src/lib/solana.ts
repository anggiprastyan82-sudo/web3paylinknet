import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

const NETWORK = "devnet";
const PLATFORM_WALLET = (import.meta as any).env.VITE_PLATFORM_WALLET || "8vNm3q9zR9y3zR9y3zR9y3zR9y3zR9y3zR9y3zR9y3zR";

export const getSolanaConnection = () => {
  return new Connection(`https://api.${NETWORK}.solana.com`, "confirmed");
};

export async function createTransferTransaction(
  senderPubkey: PublicKey,
  receiverPubkey: PublicKey,
  amountSol: number
) {
  const connection = getSolanaConnection();
  
  // Calculate fee (1%)
  const fee = amountSol * 0.01;
  const receiverAmount = amountSol - fee;

  const transaction = new Transaction().add(
    // 99% to receiver
    SystemProgram.transfer({
      fromPubkey: senderPubkey,
      toPubkey: receiverPubkey,
      lamports: Math.floor(receiverAmount * LAMPORTS_PER_SOL),
    }),
    // 1% to platform
    SystemProgram.transfer({
      fromPubkey: senderPubkey,
      toPubkey: new PublicKey(PLATFORM_WALLET),
      lamports: Math.floor(fee * LAMPORTS_PER_SOL),
    })
  );

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = senderPubkey;

  return transaction;
}

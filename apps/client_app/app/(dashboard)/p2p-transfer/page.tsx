import { getServerSession } from "next-auth";
import { P2pTransactions } from "../../../components/P2pTransactions";
import { SendCard } from "../../../components/SendCard";
import db from "@repo/db/client";
import { authOptions } from "../../lib/auth";
import { BalanceCard } from "../../../components/BalanceCard";
import { redirect } from "next/navigation";

async function getp2pTransactions() {
  const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin");

  const txns = await db.p2pTransfer.findMany({
    where: {
      toUserId: Number(session?.user?.id),
    },
  });
  return txns.map((t) => ({
    time: t.timestamp,
    amount: t.amount,
  }));
}

async function getBalance() {
  const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin");

  const balance = await db.balance.findFirst({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

export default async function () {

    const balance = await getBalance();
    const transactions = await getp2pTransactions();
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <SendCard />
        </div>
        <div>
          <BalanceCard amount={balance.amount} locked={balance.locked} />
          <div className="pt-4">
            <P2pTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}

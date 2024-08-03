import { Button } from "@repo/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import db from "@repo/db/client";
import Link from "next/link";
import { formatRupee } from "../../utils/formatRupee";
import Transactions from "../../../components/Transactions";

const getTransactions = async () => {
  const session = await getServerSession(authOptions);
  const txns = await db.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  return txns.map((t) => ({
    date: t.startTime.toDateString(),
    amount: t.amount,
    status: t.status,
    id: t.id,
  }));
};

async function getBalance() {
  const session = await getServerSession(authOptions);
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

export default async function dashboard() {

  const session = await getServerSession(authOptions);
  const balance = await getBalance();
  const transactions = await getTransactions();

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="bg-card text-card-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center">
            <WalletIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <p className="text-2xl font-bold">
              {formatRupee(balance.amount/100)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="grid gap-0.5 leading-none">
              
              <div className="text-sm text-muted-foreground">
                Account ID: {session?.user?.id}
              </div>
            </div>
          </div>
          <Link href={"/p2p-transfer"}>
            <Button>Send</Button>
          </Link>
          <Link href={"/transfer"}>
            <Button>Transfer</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        {!transactions.length ? (
          <div className="text-center pb-8 pt-8">No Recent transactions</div>
        ) : (
          <div className="bg-card rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full  border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Date</th>
                    <th className="px-4 py-2 border-b">Amount</th>
                    <th className="px-4 py-2 border-b">Type</th>
                    <th className="px-4 py-2 border-b">Status</th>
                  </tr>
                </thead>
                {transactions.map((transaction) => (
                  <Transactions
                    key={transaction.id}
                    date={transaction.date}
                    amount={transaction.amount}
                    type={"Add Money"}
                    status={transaction.status}
                  />
                ))}
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function WalletIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

function XIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

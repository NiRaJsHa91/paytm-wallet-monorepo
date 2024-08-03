import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import db from "@repo/db/client";
import Transactions from "../../../components/Transactions";
import { redirect } from "next/navigation";

const getTransactions = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");
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

const getP2PTransactions = async () => {
  const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin");

  const txns = await db.p2pTransfer.findMany({
    where: {
      toUserId: Number(session?.user?.id),
    },
  });
  return txns.map((t) => ({
    date: t.timestamp.toDateString(),
    amount: t.amount,
    type: "Received",
    status: "Success",
    id: t.id,
  }));
};


export default async function Component() {
  const transactions = await getTransactions();
  const p2pTransactions = await getP2PTransactions();
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-1 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Add Money Transactions
            </h2>
            <div className="bg-card rounded-lg overflow-hidden">
              {!transactions.length ? (
                <div className="text-center pb-8 pt-8">
                  No Recent transactions
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  {transactions.map((t) => (
                    <Transactions key={t.id} {...t} />
                  ))}
                </table>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">P2P Transactions</h2>
            <div className="bg-card rounded-lg overflow-hidden">
              {!p2pTransactions.length ? (
                <div className="text-center pb-8 pt-8">
                  No Recent transactions
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  {p2pTransactions.map((t) => (
                    <Transactions key={t.id} {...t} />
                  ))}
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function WalletIcon(props: any) {
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

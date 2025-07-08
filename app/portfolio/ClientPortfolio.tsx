"use client";
import { DonutChart } from "@/ui/DonutChart";
import { Decimal } from "@prisma/client/runtime/library";

interface Investment {
  id: string;
  amount: Decimal;
  startup?: { name: string } | null;
  token?: { symbol: string; name: string } | null;
  vesting: Array<{ 
    id: string;
    createdAt: Date;
    investmentId: string;
    cliffDate: Date;
    unlockDate: Date;
    percentage: Decimal;
  }>;
}

interface Notification {
  id: string;
  userId: string;
  createdAt: Date;
  type: string;
  message: string;
  read: boolean;
}

interface ClientPortfolioProps {
  investments: Investment[];
  notifications: Notification[];
}

export default function ClientPortfolio({ investments, notifications }: ClientPortfolioProps) {
  const data = investments.map((inv) => ({
    name: inv.startup?.name ?? inv.token?.symbol,
    value: Number(inv.amount),
  }));

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-semibold">Your Portfolio</h1>

      <section className="grid md:grid-cols-2 gap-8">
        {/* Donut */}
        <div className="p-6 bg-gray-50 shadow rounded-xl">
          <DonutChart data={data} category="name" value="value" />
          <p className="mt-4 text-center text-sm text-gray-600">
            Total invested (demo): ${total.toLocaleString()}
          </p>
        </div>

        {/* Table */}
        <div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Asset</th>
                <th>Amount</th>
                <th>Vesting (%)</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv) => {
                const vestedPct =
                  inv.vesting.length > 0
                    ? ((Date.now() - inv.vesting[0].cliffDate.getTime()) /
                        (inv.vesting[0].unlockDate.getTime() -
                          inv.vesting[0].cliffDate.getTime())) *
                      100
                    : 100;
                return (
                  <tr key={inv.id}>
                    <td>{inv.startup?.name ?? inv.token?.symbol}</td>
                    <td>${inv.amount.toLocaleString()}</td>
                    <td>{vestedPct.toFixed(0)} %</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-2">Recent Activity</h2>
        <ul className="space-y-2">
            {notifications.map((n) => (
                <li key={n.id} className="text-sm">
                    {n.message} • <span className="opacity-60">{new Date(n.createdAt).toLocaleString()}</span>
                </li>
            ))}
        </ul>
      </section>
    </div>
  );
}

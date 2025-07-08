import Link from "next/link";
import { Badge } from "@/ui/Badge";
import { ProgressBar } from "@/ui/ProgressBar";
import type { Startup, Token } from "@/generated/prisma";

type Entity = (Startup & { investments: { amount: number }[] }) | (Token & { investments: { amount: number }[] });

export default function Card({ data }: { data: Entity }) {
  const raised = data.investments.reduce((sum: number, i: { amount: number }) => sum + Number(i.amount), 0);
  const pct = Math.min(100, (raised / Number(data.fundingGoal)) * 100);
  const isStartup = 'industry' in data;

  return (
    <Link
      href={`/marketplace/${"symbol" in data ? "token" : "startup"}/${data.id}`}
      className="block p-4 rounded-2xl bg-grey-50 shadow-sm hover:shadow-md transition"
    >
      <header className="flex justify-between items-center mb-3">
        <h3 className="font-semibold truncate">{data.name}</h3>
        <Badge color={pct > 75 ? "green" : pct > 40 ? "yellow" : "grey"}>
          {pct.toFixed(0)}%
        </Badge>
      </header>
      <p className="text-sm text-gray-500 line-clamp-2">{data.description}</p>

      <div className="mt-4 space-y-2">
        <ProgressBar value={pct} />
        <div className="text-xs text-gray-600">
          ${raised.toLocaleString()} / $
          {Number(data.fundingGoal).toLocaleString()}
        </div>
      </div>

      <footer className="mt-3 flex gap-2 text-xs">
        {isStartup && <Badge color="blue">{data.industry}</Badge>}
        {isStartup && <Badge>{data.stage}</Badge>}
        {"symbol" in data && <Badge color="blue">{data.symbol}</Badge>}
      </footer>
    </Link>
  );
}

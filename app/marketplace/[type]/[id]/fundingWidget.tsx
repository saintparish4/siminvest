"use client";
import useSWR from "swr";
import { ProgressBar } from "@/ui/ProgressBar";
import fetcher from "@/lib/fetcher";

export default function FundingWidget({
  id,
  goal,
  initialRaised,
}: {
  id: string;
  goal: number;
  initialRaised: number;
}) {
  const { data } = useSWR<{ amountRaised: number }>(
    `/api/funding/${id}`,
    fetcher,
    { refreshInterval: 4000, fallbackData: { amountRaised: initialRaised } }
  );
  const pct = Math.min(100, (data!.amountRaised / goal) * 100);

  return (
    <div className="my-4">
      <ProgressBar value={pct} />
      <p className="text-sm text-gray-600 mt-1">
        ${data!.amountRaised.toLocaleString()} raised • ${pct.toFixed(1)} % of $
        {goal.toLocaleString()}
      </p>
    </div>
  );
}

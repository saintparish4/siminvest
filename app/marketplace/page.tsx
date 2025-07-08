import prisma from "@/lib/prisma";
import { $Enums } from "@/generated/prisma";
import Filters from "./components/filters";
import Card from "./components/card";

export const revalidate = 3600; // ISR cache for 1 hour

interface PageProps {
  params: Promise<Record<string, never>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Marketplace({
  searchParams,
}: PageProps) {
  const resolvedParams = await searchParams;
  const industry = resolvedParams.industry as string | undefined;
  const stage = resolvedParams.stage as string | undefined;
  const search = resolvedParams.search as string | undefined;

  //Dynamic Filter Query
  const where: {
    isApproved: boolean;
    industry?: string;
    stage?: $Enums.FundingStage;
    name?: { contains: string; mode: "insensitive" };
  } = { isApproved: true };
  if (industry) where.industry = industry;
  if (stage) where.stage = stage as $Enums.FundingStage;
  if (search) where.name = { contains: search, mode: "insensitive" };

  const startups = await prisma.startup.findMany({
    where,
    include: { investments: true },
    orderBy: { createdAt: "desc" },
  });

  // Transform the data to match the expected types
  const transformedStartups = startups.map(startup => ({
    ...startup,
    investments: startup.investments.map(investment => ({
      amount: Number(investment.amount)
    }))
  }));

  console.log('Fetched startups:', startups); // Debug log

  return (
    <section className="px-6 py-4 space-y-6">
      <Filters current={{ industry, stage, search }} />
      <div className="grid gap-6 mid:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {startups.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No startups found</p>
        ) : (
          transformedStartups.map((item) => (
            <Card key={item.id} data={item} />
          ))
        )}
      </div>
    </section>
  );
}

import prisma from "@/lib/prisma";
import { getUser } from "@/lib/getUser";
import ClientPortfolio from "./ClientPortfolio"; // a small client wrapper 

export default async function PortfolioPage() {
  const user = await getUser();
  if (!user)
    return <div className="p-6">Please sign in to view your portfolio</div>;

  const investments = await prisma.investment.findMany({
    where: { userId: user.id },
    include: {
      startup: { select: { name: true } },
      token: { select: { name: true, symbol: true } },
      vesting: true,
    },
  });

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <ClientPortfolio investments={investments} notifications={notifications} />
  );
}

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import FundingWidget from "./fundingWidget";
import { Startup, Token, Document, DueDiligenceReport, Investment } from "@/generated/prisma";

type EntityWithRelations = (Startup | Token) & {
  documents: Document[];
  dueDiligenceReports: DueDiligenceReport[];
  investments: Investment[];
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }>}) {
  const { id } = await params;
  const entity =
    (await prisma.token.findUnique({ where: { id } })) ??
    (await prisma.startup.findUnique({ where: { id } }));

  return {
    title: `${entity?.name} • Hex`,
    description: entity?.description.slice(0, 140),
    openGraph: {
      images: [`/api/og/${entity?.id}`], // Optional OG image route
    },
  };
}

export default async function EntityPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;

  // Fetch entity data based on type
  const entity = await (type === "startup"
    ? prisma.startup.findUnique({
        where: { id },
        include: {
          documents: true,
          dueDiligenceReports: true,
          investments: true,
        },
      })
    : prisma.token.findUnique({
        where: { id },
        include: {
          documents: true,
          dueDiligenceReports: true,
          investments: true,
        },
      })) as EntityWithRelations | null;

  if (!entity) {
    notFound();
  }

  const raised = entity.investments.reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {entity.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{entity.description}</p>

            <FundingWidget
              id={entity.id}
              goal={Number(entity.fundingGoal)}
              initialRaised={raised}
            />

            {/* Documents Section */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">Documents</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {entity.documents.map((doc) => {
                  if (!doc.url || !doc.title) return null;
                  return (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400"
                    >
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-gray-400 group-hover:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="focus:outline-none">
                          <p className="text-sm font-medium text-gray-900">
                            {doc.title}
                          </p>
                          <p className="truncate text-sm text-gray-500">
                            {doc.type}
                          </p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Due Diligence Reports Section */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">
                Due Diligence Reports
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {entity.dueDiligenceReports.map((report) => (
                  <div
                    key={report.id}
                    className="group relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm"
                  >
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="focus:outline-none">
                        <p className="text-sm font-medium text-gray-900">
                          Due Diligence Report
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {report.summary}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Risk Score: {report.riskScore}/100
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

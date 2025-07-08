"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function Filters({
  current,
}: {
  current: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  
  const [industry, setIndustry] = useState(current.industry ?? "");
  const [stage, setStage] = useState(current.stage ?? "");
  const [search, setSearch] = useState(current.search ?? "");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setIndustry(current.industry ?? "");
      setStage(current.stage ?? "");
      setSearch(current.search ?? "");
    }
  }, [current, isMounted]);

  const update = (key: string, value?: string) => {
    const newParams = new URLSearchParams(params);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    router.push(pathname + "?" + newParams.toString());
  };

  if (!isMounted) {
    return (
      <div className="fkex flex-col md:flex-row md:items-end gap-3">
        <div className="select h-10 w-full md:w-48 bg-gray-100 animate-pulse rounded-md" />
        <div className="select h-10 w-full md:w-48 bg-gray-100 animate-pulse rounded-md" />
        <div className="relative w-full md:w-72">
          <div className="absolute left-2.5 top-2.5 h-4 w-4 bg-gray-200 rounded-full" />
          <div className="input pl-8 h-10 w-full bg-gray-100 animate-pulse rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="fkex flex-col md:flex-row md:items-end gap-3">
      {/*Industry*/}
      <select
        className="select"
        value={industry}
        onChange={(e) => {
          const value = e.target.value || undefined;
          setIndustry(e.target.value);
          update("industry", value);
        }}
      >
        <option value="">All Industries</option>
        <option value="AI">AI</option>
        <option value="FinTech">FinTech</option>
        <option value="HealthTech">HealthTech</option>
      </select>

      {/*Stage*/}
      <select
        className="select"
        value={stage}
        onChange={(e) => {
          const value = e.target.value || undefined;
          setStage(e.target.value);
          update("stage", value);
        }}
      >
        <option value="">All Stages</option>
        <option value="Seed">Seed</option>
        <option value="Series A">Series A</option>
        <option value="Series B">Series B</option>
        <option value="Series C">Series C</option>
      </select>

      {/*Search*/}
      <label className="relative w-full md:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-grey-400" />
        <input
          value={search}
          placeholder="Search Startups"
          className="input pl-8"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && update("search", search || undefined)
          }
        />
      </label>
    </div>
  );
}

import React, { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import OrgProfileCard from "@/components/clarity/org/OrgProfileCard";
import AiStorageCard from "@/components/clarity/org/AiStorageCard";
import AiUsageLogCard from "@/components/clarity/org/AiUsageLogCard";

export default function OrganisationPage() {
  const [org, setOrg] = useState(null);
  const [logs, setLogs] = useState([]);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const [orgs, ls] = await Promise.all([
      base44.entities.Organisation.list("-created_date", 1),
      base44.entities.AiUsageLog.list("-created_date", 200),
    ]);
    setOrg(orgs[0] || null);
    setLogs(ls);
    setReady(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!ready) return <p className="text-[12px] text-[#6B7280]">Loading organisation</p>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">Organisation</h1>
        <p className="text-[12px] text-[#6B7280]">Your company details, what the AI has saved and every AI run.</p>
      </div>

      <OrgProfileCard key={org?.id || "new"} org={org} onSaved={setOrg} />

      <div className="grid gap-4 lg:grid-cols-2">
        <AiStorageCard logs={logs} />
        <AiUsageLogCard logs={logs} />
      </div>
    </div>
  );
}
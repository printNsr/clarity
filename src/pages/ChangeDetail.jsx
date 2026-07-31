import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UrgencyDot from "@/components/common/UrgencyDot";
import Pill from "@/components/common/Pill";
import WhatChangedTab from "@/components/change/WhatChangedTab";
import NumbersTab from "@/components/change/NumbersTab";
import ConflictTab from "@/components/change/ConflictTab";
import DecisionTab from "@/components/change/DecisionTab";
import TeamViewTab from "@/components/change/TeamViewTab";
import SourcesTab from "@/components/change/SourcesTab";

export default function ChangeDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    const [change, impacts, assumptions, conflicts, sources, entries] = await Promise.all([
      base44.entities.Change.get(id),
      base44.entities.DisciplineImpact.filter({ change_id: id }),
      base44.entities.Assumption.filter({ change_id: id }),
      base44.entities.Conflict.filter({ change_id: id }),
      base44.entities.SourceRef.filter({ change_id: id }),
      base44.entities.DecisionEntry.filter({ change_id: id }, "-decision_date"),
    ]);
    setData({ change, impacts, assumptions, conflicts, sources, entry: entries[0] });
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!data) return <p className="text-sm text-muted-foreground">Loading change</p>;
  const { change, impacts, assumptions, conflicts, sources, entry } = data;

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to inbox
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <UrgencyDot level={change.urgency} />
          <Pill tone={change.status}>{change.status}</Pill>
        </div>
        <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-tight">{change.title}</h1>
      </div>

      <Tabs defaultValue="what">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-full bg-muted p-1">
          <TabsTrigger value="what" className="rounded-full">What Changed</TabsTrigger>
          <TabsTrigger value="numbers" className="rounded-full">The Numbers</TabsTrigger>
          <TabsTrigger value="conflict" className="rounded-full">Conflict Check</TabsTrigger>
          <TabsTrigger value="decision" className="rounded-full">Decision</TabsTrigger>
          <TabsTrigger value="team" className="rounded-full">View by Team</TabsTrigger>
          <TabsTrigger value="sources" className="rounded-full">Sources</TabsTrigger>
        </TabsList>

        <div className="pt-8">
          <TabsContent value="what"><WhatChangedTab change={change} impacts={impacts} /></TabsContent>
          <TabsContent value="numbers"><NumbersTab impacts={impacts} /></TabsContent>
          <TabsContent value="conflict"><ConflictTab assumptions={assumptions} conflicts={conflicts} /></TabsContent>
          <TabsContent value="decision">
            <DecisionTab change={change} conflicts={conflicts} impacts={impacts} entry={entry} onSaved={load} />
          </TabsContent>
          <TabsContent value="team"><TeamViewTab impacts={impacts} change={change} /></TabsContent>
          <TabsContent value="sources"><SourcesTab sources={sources} /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
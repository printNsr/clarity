import React, { useCallback, useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import ChannelList from "@/components/portal/ChannelList";
import MessageItem from "@/components/portal/MessageItem";
import MeetingPanel from "@/components/portal/MeetingPanel";

export default function TeamPortal() {
  const [changes, setChanges] = useState([]);
  const [messages, setMessages] = useState([]);
  const [active, setActive] = useState("#general");
  const [draft, setDraft] = useState("");

  const load = useCallback(async () => {
    const [c, m] = await Promise.all([
      base44.entities.Change.list("-created_date"),
      base44.entities.Message.list("created_date", 200),
    ]);
    setChanges(c);
    setMessages(m);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const channels = useMemo(
    () => [
      { name: "#general" },
      ...changes.filter((c) => c.status !== "resolved").map((c) => ({ name: `#${c.title.toLowerCase().split(" ").slice(0, 3).join("-")}`, change_id: c.id })),
    ],
    [changes]
  );

  const counts = useMemo(() => {
    const out = {};
    messages.forEach((m) => {
      if (m.flagged) out[m.channel] = (out[m.channel] || 0) + 1;
    });
    return out;
  }, [messages]);

  const channelMessages = messages.filter((m) => m.channel === active && !m.parent_id);
  const activeChangeId = channels.find((c) => c.name === active)?.change_id;

  const send = async () => {
    if (!draft.trim()) return;
    await base44.entities.Message.create({
      channel: active,
      change_id: activeChangeId || "",
      author: "You",
      text: draft,
    });
    setDraft("");
    load();
  };

  const flag = async (m) => {
    await base44.entities.Message.update(m.id, { flagged: !m.flagged });
    load();
  };

  const react = async (m) => {
    const reactions = m.reactions?.length ? [{ emoji: "👍", count: (m.reactions[0].count || 0) + 1 }] : [{ emoji: "👍", count: 1 }];
    await base44.entities.Message.update(m.id, { reactions });
    load();
  };

  const reply = async (parentId, text) => {
    await base44.entities.Message.create({ channel: active, parent_id: parentId, author: "You", text });
    load();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Team Portal</h1>
        <p className="mt-1 text-sm text-muted-foreground">Talk it through, then keep the key points.</p>
      </div>

      <div className="flex flex-col gap-8 sm:flex-row">
        <ChannelList channels={channels} active={active} onSelect={setActive} counts={counts} />

        <div className="min-w-0 flex-1 space-y-5">
          <MeetingPanel changes={changes} activeChangeId={activeChangeId} onCreated={load} />

          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={`New message in ${active}, press enter to send`}
          />

          <div className="space-y-3">
            {channelMessages.map((m) => (
              <MessageItem
                key={m.id}
                message={m}
                replies={messages.filter((r) => r.parent_id === m.id)}
                onFlag={flag}
                onReact={react}
                onReply={reply}
              />
            ))}
            {channelMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages here yet.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
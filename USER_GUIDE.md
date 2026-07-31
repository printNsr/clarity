# Clarity — How It All Works

A guide to what Clarity does, how the pieces connect, and how to use it day to day.

---

## 1. What Clarity is for

Clarity is a hub for construction project teams. It captures every design change, checks it
for clashes with other trades, holds the discussion in one place, records the decision, raises
an RFI when someone outside the team has to answer, and tracks the drawing update through to
verification. Nothing is lost in email threads or site chats.

---

## 2. The building blocks

| Thing | What it is |
|---|---|
| **Project** | The job, for example Horizon Tower. Everything else hangs off a project. |
| **Change Issue** | One design change, site condition or question. The centre of the app. |
| **Discussion Message** | A note or voice message from a trade on a change issue. |
| **Evidence Fact** | A single statement from a discipline: stated, inferred, confirmed, contradicted or missing. |
| **Collision Analysis** | The clash check on a change: what overlaps, how bad it is, the exact question to answer. |
| **Decision** | The agreed resolution, who made it and why. |
| **RFI** | A formal question sent out when the team cannot answer it themselves. |
| **Drawing** and **Drawing Update** | The sheets, and the task to revise a sheet after a decision or RFI answer. |
| **Verification Run** | The check that the change is actually resolved on the current drawings. |
| **Trade Update** | A post from a trade on site: progress, delay, site condition, question, sign off. |
| **Workflow Event** | The audit trail. Every step above writes an entry here. |

---

## 3. How they connect

```
Project
  └── Change Issue  ─────────────────────────────┐
        ├── Discussion Messages (per trade)      │
        ├── Evidence Facts (per discipline)      │  every step writes a
        ├── Collision Analysis                   │  Workflow Event
        ├── Decision                             │  (the audit trail)
        ├── RFI ──► answer ──► Drawing Update    │
        └── Verification Run  ───────────────────┘
Project
  └── Drawings ──► Drawing Updates
  └── Trade Updates (site posts, can link to a change)
```

A change issue is the spine. Discussion and evidence feed the collision analysis. The analysis
produces one clear question. That question is settled either by a decision inside the team or by
an RFI sent out. Either outcome creates a drawing update. Once the drawing is revised, a
verification run confirms the change is closed.

---

## 4. The screens

- **Dashboard** — headline numbers, collision hotspots on a floor plan, recent activity and the
  split of open items by discipline.
- **Changes** — the full list of change issues, filterable. **Collisions** is the same list
  narrowed to clashes only.
- **Change detail** — meta panel, the trade discussion, and the Clarity insight card.
- **Analysis** — the clash detail, the assumptions each discipline is working from, and the
  impact.
- **Evidence** — every fact on the change with its source and confidence.
- **Resolve** — record the decision, the reason and the impact plan.
- **Verification** — the workflow timeline and the check that the change is closed.
- **RFIs** — draft, preview and send formal questions.
- **Drawings** — the sheet register and the update tasks against each sheet.
- **Updates** — trade posts from site, with acknowledgement.
- **Settings** — project setup.

---

## 5. The normal workflow, step by step

1. **Raise the change.** Changes → New change. Give it a title, level, zone, disciplines and an
   owner. Status starts at Open.
2. **Let the trades talk.** Open the change and post messages. Each trade adds what it knows.
   Voice notes are transcribed so the text is searchable.
3. **Add evidence.** On the Evidence screen, log the hard facts: levels, setouts, clearances.
   Mark each one as stated, inferred, confirmed, contradicted or missing, with its source.
4. **Run the analysis.** Press Analyze. Clarity compares what each discipline assumes, flags any
   overlap, and writes one exact question that has to be answered. The change moves to
   Potential Collision and the risk level is set.
5. **Resolve it, one of two ways.**
   - The team can answer it → Resolve screen. Record the decision, who made it and the reason.
     Status becomes Decision Recorded.
   - Someone outside has to answer → raise an RFI. Edit the question, attach evidence and
     drawings, choose recipients, then Send. Status becomes RFI Sent.
6. **Update the drawing.** Sending an RFI or recording a decision creates a drawing update task
   against the affected sheet. The sheet shows as Update Requested, then In Progress, then
   Updated.
7. **Verify.** Run verification once the revised sheet is in. If the clash is gone the change is
   Verified. If the drawing changed again underneath it, the change is flagged for re-analysis.

---

## 6. Reading the app

**Status colours**

- Red — high risk, potential collision, invalidated
- Amber — medium risk, in progress, decision recorded, update requested
- Green — low risk, verified, updated, resolved
- Blue — RFI sent, open

**Confidence** — every AI generated line carries High, Medium or Low, and a link back to the
source it came from. Treat anything AI generated as a draft until a person confirms it.

**Discipline icons** — the small round letters mark which trade a message, fact or drawing
belongs to: Architecture, Electrical, Mechanical, Fire.

**Collision hotspots** — the dashboard floor plan. Each circle is a spot where trades clash.
Bigger and redder means higher risk. Click a circle to open the change.

---

## 7. Trade updates

Site teams post updates from the Updates screen: progress, delay notice, site condition,
material change, question or sign off, each with an urgency. The office acknowledges each one so
nothing sits unread. An update can be tied to a change issue, which puts site reality straight
next to the design question.

---

## 8. Where the audit trail lives

Every meaningful step writes a workflow event: change created, collision detected, analysis
completed, decision recorded, RFI sent, drawing updated, verified, invalidated. These appear on
the dashboard activity feed and on the verification timeline of each change, so you can always
show how and when a decision was reached.

---

## 9. Quick tips

- Start every day on the Dashboard, then work the red hotspots first.
- If a change stalls, check the Evidence screen for facts marked Missing. That is usually the
  blocker.
- Do not raise an RFI until the analysis has produced the exact question. A vague RFI comes back
  slowly.
- Acknowledge trade updates promptly. Unacknowledged delay notices are the ones that hurt.
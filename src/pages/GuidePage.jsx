import React from "react";
import { Link } from "react-router-dom";
import GuideSection from "@/components/clarity/guide/GuideSection";

const GLOSSARY = [
  ["Change", "Anything that moved, was added or was removed on the project. Every workflow starts here."],
  ["Collision", "Two or more things that now want the same space or clash in some way."],
  ["Evidence", "A short fact from one team, with who said it and where it came from."],
  ["Analysis", "Clarity comparing what each team assumed, so the real question becomes clear."],
  ["Decision", "The agreed answer, who made it and why the other options were not chosen."],
  ["RFI", "A formal question sent to a party outside the room when nobody in the room can answer it."],
  ["Drawing update", "The task of putting the decision onto the drawing sheet."],
  ["Verification", "A recheck that the decision still holds after later changes."],
  ["Trade update", "A note posted by a trade from site, such as a delay or a site condition."],
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">How Clarity works</h1>
        <p className="mt-1 text-[13px] text-[#6B7280]">
          Clarity follows one change from the moment somebody notices it, through to the drawing being
          updated and checked. Every screen below is one step of that same path.
        </p>
      </div>

      <GuideSection step="1" title="Start at Home">
        <p>
          The <Link to="/dashboard" className="text-[#2563EB] underline">Home</Link> screen is your daily
          view. It shows how many changes are open, how many need a decision, and where the clashes sit on
          the floor plan. Each hotspot circle opens the change behind it.
        </p>
      </GuideSection>

      <GuideSection step="2" title="Raise a change">
        <p>
          Go to <Link to="/changes" className="text-[#2563EB] underline">Changes</Link> and add one. Give it
          a title, the level and zone, the teams it touches and who owns it. This record is the spine that
          everything else hangs off, so keep the title plain, for example "Wall W-23 moved 300mm east".
        </p>
      </GuideSection>

      <GuideSection step="3" title="Let the teams talk on the change">
        <p>
          Open the change and use the discussion panel. Each team says what they know from their own
          drawings. Nothing is lost in email or chat because it all sits against the one change.
        </p>
      </GuideSection>

      <GuideSection step="4" title="Capture evidence">
        <p>
          On the <span className="font-medium">Evidence</span> tab, each statement becomes a fact with a
          label: Stated, Inferred, Missing, Confirmed or Contradicted. Two facts marked Contradicted are
          usually the clash. A fact marked Missing is usually the reason you will end up sending an RFI.
        </p>
      </GuideSection>

      <GuideSection step="5" title="Run the analysis">
        <p>
          Press Analyze on the change. Clarity reads the discussion and the evidence, compares what each
          team assumed and writes a draft summary with the exact question that needs answering and a risk
          level of High, Medium or Low. It is a draft with a confidence level, and it always links back to
          the facts it used, so you can check it.
        </p>
      </GuideSection>

      <GuideSection step="6" title="Resolve, or ask">
        <p>
          If the room can answer, record a decision on the{" "}
          <span className="font-medium">Resolve</span> screen: the chosen option, the reason and who
          approved it. The change moves to Decision Recorded.
        </p>
        <p>
          If the answer sits with someone outside the room, raise an{" "}
          <Link to="/rfis" className="text-[#2563EB] underline">RFI</Link> instead. The evidence and
          drawings already attached to the change are carried into it. Sending the RFI moves the change to
          RFI Sent.
        </p>
      </GuideSection>

      <GuideSection step="7" title="Update the drawing">
        <p>
          A decision or an answered RFI creates a drawing update task in{" "}
          <Link to="/drawings" className="text-[#2563EB] underline">Drawings</Link>, with an owner and a due
          date. The sheet is marked Update Requested until the new revision is loaded, then Updated.
        </p>
      </GuideSection>

      <GuideSection step="8" title="Verify it still holds">
        <p>
          Verification rechecks a resolved change against later changes. If something new breaks the earlier
          decision, the change is marked Invalidated and comes back into your list instead of quietly going
          wrong on site.
        </p>
      </GuideSection>

      <GuideSection step="9" title="Site updates from the trades">
        <p>
          <Link to="/updates" className="text-[#2563EB] underline">Updates</Link> is where trades post
          progress, delays, site conditions and questions. Acknowledge each one so the trade knows it was
          read. An update can point at a change, which is how a site issue becomes tracked work.
        </p>
      </GuideSection>

      <GuideSection title="What the statuses mean">
        <ul className="list-disc space-y-1 pl-5">
          <li><span className="font-medium">Open</span> — raised, nobody has resolved it yet.</li>
          <li><span className="font-medium">Potential Collision</span> — analysis found a likely clash.</li>
          <li><span className="font-medium">Decision Recorded</span> — the answer is agreed and written down.</li>
          <li><span className="font-medium">RFI Sent</span> — waiting on an outside answer.</li>
          <li><span className="font-medium">Drawing Updated</span> — the sheet now shows the decision.</li>
          <li><span className="font-medium">Verified</span> — rechecked and still correct.</li>
          <li><span className="font-medium">Invalidated</span> — a later change broke the earlier decision.</li>
        </ul>
        <p>Red means high risk or unresolved, amber means medium, green means low or resolved.</p>
      </GuideSection>

      <GuideSection title="Words used in the app">
        <dl className="space-y-1.5">
          {GLOSSARY.map(([term, meaning]) => (
            <div key={term}>
              <dt className="font-medium">{term}</dt>
              <dd className="text-[#6B7280]">{meaning}</dd>
            </div>
          ))}
        </dl>
      </GuideSection>

      <GuideSection title="Two rules worth keeping">
        <p>
          Every piece of Clarity writing is a draft with a confidence level and a link back to its source.
          Read the source before you act on it.
        </p>
        <p>
          Record the reason, not just the outcome. Six months later the reason is the part people need.
        </p>
      </GuideSection>
    </div>
  );
}
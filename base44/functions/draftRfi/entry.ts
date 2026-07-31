import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { mistralJson } from '../../shared/mistral.ts';
import { loadIssueContext, contextText } from '../../shared/issueContext.ts';

const SYSTEM = `You are an assistant for a construction coordination tool. You write formal Requests for Information (RFIs) in plain, simple English. Do not use dashes or hyphens in sentences. Return a JSON object with these keys:
- "title": short RFI title, under 12 words
- "question": the formal RFI question, clear and specific, 2 to 4 sentences
- "background": brief background explaining why this question is being asked, 2 to 3 sentences
- "location": the affected location as a short string
- "priority": one of "High", "Medium", "Low"
- "disciplines": array of discipline names involved
- "related_drawings": array of drawing numbers mentioned in the context
- "confidence": one of "High", "Medium", "Low" reflecting how complete the source information is`;

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { issue_id } = await req.json();
    if (!issue_id) return Response.json({ error: 'issue_id is required' }, { status: 400 });

    const ctx = await loadIssueContext(base44, issue_id);
    const draft = await mistralJson(secrets.get('MISTRAL_API_KEY'), SYSTEM, `Draft an RFI for this change:\n\n${contextText(ctx)}`);

    const existing = await base44.entities.RFI.filter({ project_id: ctx.issue.project_id }, '-created_date', 500);
    const rfiNumber = `RFI-${String(existing.length + 1).padStart(3, '0')}`;

    const evidence = ctx.facts.slice(0, 3).map((f) => ({ discipline: f.discipline || 'General', text: f.text }));

    const rfi = await base44.entities.RFI.create({
      project_id: ctx.issue.project_id,
      issue_id,
      rfi_number: rfiNumber,
      title: draft.title || ctx.issue.title,
      question: draft.question || '',
      background: draft.background || '',
      location: draft.location || [ctx.issue.level, ctx.issue.zone].filter(Boolean).join(', '),
      priority: ['High', 'Medium', 'Low'].includes(draft.priority) ? draft.priority : ctx.issue.priority,
      disciplines: Array.isArray(draft.disciplines) ? draft.disciplines : (ctx.issue.disciplines || []),
      related_drawings: Array.isArray(draft.related_drawings) ? draft.related_drawings : (ctx.issue.related_drawings || []),
      evidence,
      due_date: ctx.issue.due_date,
      status: 'Draft',
    });

    return Response.json({ rfi_id: rfi.id, rfi_number: rfiNumber, confidence: draft.confidence || 'Medium' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
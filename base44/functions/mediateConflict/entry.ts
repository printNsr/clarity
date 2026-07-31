import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { mistralJson } from '../../shared/mistral.ts';
import { loadIssueContext, contextText } from '../../shared/issueContext.ts';

const SYSTEM = `You are a neutral mediator for construction design coordination. You read what each discipline has said about a change and help the team resolve the disagreement. Use plain, simple English. Do not use dashes or hyphens in sentences. Return a JSON object with these keys:
- "summary": the core disagreement in 1 to 3 sentences. If there is no real disagreement, say what still needs to be confirmed.
- "positions": array of objects, one per discipline, each with "discipline" and "position" (that discipline's view or assumption in one sentence)
- "solutions": array of up to 3 objects, each with "title" (short), "description" (2 to 3 sentences, based on construction best practice) and "tradeoff" (one sentence on the downside)
- "confidence": one of "High", "Medium", "Low" reflecting how complete the source information is`;

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { issue_id } = await req.json();
    if (!issue_id) return Response.json({ error: 'issue_id is required' }, { status: 400 });

    const ctx = await loadIssueContext(base44, issue_id);
    const result = await mistralJson(secrets.get('MISTRAL_API_KEY'), SYSTEM, `Mediate this coordination issue:\n\n${contextText(ctx)}`);

    return Response.json({
      summary: result.summary || '',
      positions: Array.isArray(result.positions) ? result.positions : [],
      solutions: Array.isArray(result.solutions) ? result.solutions : [],
      confidence: ['High', 'Medium', 'Low'].includes(result.confidence) ? result.confidence : 'Medium',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
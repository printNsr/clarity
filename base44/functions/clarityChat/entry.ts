import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { mistralJson } from '../../shared/mistral.ts';
import { loadAppContext, appContextText } from '../../shared/appContext.ts';

const SYSTEM = `You are the Clarity assistant for a construction project management hub. You are given a full snapshot of the business: projects, design changes, collision analyses, decisions, RFIs, drawings, trade updates and recent activity. Answer the user's question using only that snapshot. If the snapshot does not contain the answer, say plainly that the information is not recorded yet.

Use plain, simple English. Do not use dashes or hyphens in sentences. Be specific: name the changes, projects, people and numbers you are relying on. Keep answers short, a few sentences or a short list.

Return a JSON object with these keys:
- "answer": your reply as plain text. Use short line breaks for lists.
- "sources": array of up to 4 short strings naming the records you used, for example "Change: Wall W-23 moved 300mm east" or "RFI-002".`;

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { question, history } = await req.json();
    if (!question) return Response.json({ error: 'question is required' }, { status: 400 });

    const data = await loadAppContext(base44);
    const past = (Array.isArray(history) ? history.slice(-6) : [])
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
      .join('\n');

    const prompt = `BUSINESS SNAPSHOT:\n${appContextText(data)}\n\n${past ? `EARLIER IN THIS CHAT:\n${past}\n\n` : ''}QUESTION: ${question}`;
    const result = await mistralJson(secrets.get('MISTRAL_API_KEY'), SYSTEM, prompt);

    return Response.json({
      answer: result.answer || 'I could not find an answer in the project records.',
      sources: Array.isArray(result.sources) ? result.sources.slice(0, 4) : [],
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
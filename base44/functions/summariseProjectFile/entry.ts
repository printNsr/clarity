import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Reads an uploaded project file and returns a short factual summary that
// Clarity can quote when it checks a change for collisions.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const fileUrl = typeof body.file_url === 'string' ? body.file_url : '';
    const name = typeof body.name === 'string' ? body.name.slice(0, 200) : 'file';
    const category = typeof body.category === 'string' ? body.category.slice(0, 60) : 'Other';
    if (!fileUrl.startsWith('http')) return Response.json({ error: 'A file url is required' }, { status: 400 });

    const prompt = `You are helping a construction coordination tool index a project file.
File name: ${name}
File type: ${category}
Write a short factual summary of at most 120 words. List the concrete items another engineer would need: dimensions, clearances, levels, zones, materials, responsibilities, dates and any stated constraint. Use plain simple English. Do not guess. If the file has no useful detail, say so in one line.`;

    const summary = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [fileUrl],
    });

    return Response.json({ summary: typeof summary === 'string' ? summary.slice(0, 1500) : '' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
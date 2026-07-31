import { base44 } from "@/api/base44Client";

const iso = (h, m) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export async function loadSampleWorkspace() {
  const project = await base44.entities.Project.create({
    name: "Horizon Tower",
    code: "HZT",
    location: "42 Harbour Street",
    stage: "Design Development",
    description: "28 storey commercial tower.",
  });
  await base44.entities.Project.bulkCreate([
    { name: "Riverside Medical Centre", code: "RMC", stage: "Design Development" },
    { name: "Central Station Upgrade", code: "CSU", stage: "Concept" },
  ]);

  const issue = await base44.entities.ChangeIssue.create({
    project_id: project.id,
    title: "Wall W-23 moved 300mm east",
    description: "Architect relocated wall W-23 by 300mm east to widen the corridor.",
    level: "Level 05",
    zone: "Corridor C",
    stage: "Design Development",
    change_type: "Design change",
    priority: "High",
    owner: "Alex Anderson",
    owner_role: "Architect",
    due_date: "2025-05-24",
    disciplines: ["Electrical", "Mechanical", "Fire"],
    elements: ["W-23", "CT-05", "M-17"],
    related_drawings: ["E204", "M301", "A105"],
    status: "Potential Collision",
    collision_risk: "High",
    hotspot_x: 150,
    hotspot_y: 120,
  });

  await base44.entities.DiscussionMessage.bulkCreate([
    { issue_id: issue.id, author: "Sarah Patel", discipline: "Electrical", type: "audio", duration: "0:18", sent_at: iso(9, 22), transcript: "The cable tray currently follows Wall W-23. We assumed it could remain in the same position after the wall movement." },
    { issue_id: issue.id, author: "Mike Chen", discipline: "Mechanical", type: "audio", duration: "0:22", sent_at: iso(9, 27), transcript: "AHU duct M-17 requires 600mm access. Moving the wall may reduce the maintenance clearance." },
    { issue_id: issue.id, author: "Linda Gomez", discipline: "Fire", type: "audio", duration: "0:15", sent_at: iso(9, 31), transcript: "Sprinkler coverage may need to be checked if the wall and services are repositioned." },
  ]);

  await base44.entities.EvidenceFact.bulkCreate([
    { issue_id: issue.id, discipline: "Electrical", text: "Cable tray runs along this wall.", classification: "Stated", source_user: "Sarah Patel", source_time: iso(9, 22), element: "CT-05", fact_group: "Cable tray position", order: 1 },
    { issue_id: issue.id, discipline: "Electrical", text: "Cable tray CT-05 is located along W-23 per plan.", classification: "Inferred", source_user: "Mike Chen", source_time: iso(9, 20), element: "CT-05", fact_group: "Cable tray position", order: 2 },
    { issue_id: issue.id, discipline: "Electrical", text: "Confirmation of 600mm access to AHU duct M-17.", classification: "Missing", source_time: null, element: "M-17", fact_group: "Duct access clearance", order: 3 },
    { issue_id: issue.id, discipline: "Mechanical", text: "AHU duct M-17 runs along this wall.", classification: "Inferred", source_user: "Mike Chen", source_time: iso(9, 27), element: "M-17", fact_group: "Duct access clearance", order: 4 },
    { issue_id: issue.id, discipline: "Mechanical", text: "Maintenance access of 600mm is required around M-17.", classification: "Stated", source_user: "Mike Chen", source_time: iso(9, 28), element: "M-17", fact_group: "Duct access clearance", order: 5 },
    { issue_id: issue.id, discipline: "Mechanical", text: "Duct route follows Corridor C ceiling void.", classification: "Stated", source_user: "Mike Chen", source_time: iso(9, 29), element: "Corridor C", fact_group: "Wall position", order: 6 },
    { issue_id: issue.id, discipline: "Fire", text: "Sprinkler coverage may be affected by the wall move.", classification: "Inferred", source_user: "Linda Gomez", source_time: iso(9, 31), element: "Corridor C", fact_group: "Fire coverage", order: 7 },
    { issue_id: issue.id, discipline: "Fire", text: "Updated sprinkler layout approval.", classification: "Missing", element: "Corridor C", fact_group: "Fire coverage", order: 8 },
    { issue_id: issue.id, discipline: "Architecture", text: "Wall W-23 moved 300mm east on A105 rev C.", classification: "Stated", source_user: "Alex Anderson", source_time: iso(9, 15), element: "W-23", fact_group: "Wall position", order: 9 },
    { issue_id: issue.id, discipline: "Architecture", text: "Drawing A105 revision C is the current issue.", classification: "Stated", source_user: "Alex Anderson", source_time: iso(9, 16), element: "W-23", fact_group: "Drawing revision status", order: 10 },
  ]);

  await base44.entities.CollisionAnalysis.create({
    issue_id: issue.id,
    collision_detected: true,
    category: "Access clearance conflict",
    severity: "High",
    summary: "Differing assumptions could lead to RFI or rework.",
    exact_question: "Can the existing cable tray remain while preserving 600 mm access around AHU duct M-17?",
    impact_explanation: "If the cable tray remains in its current position, the required maintenance clearance around M-17 may be reduced. This could require drawing revisions, site rework or an RFI during construction.",
    assumptions: [
      { discipline: "Electrical", classification: "Stated", text: "Cable tray runs along this wall." },
      { discipline: "Mechanical", classification: "Inferred", text: "AHU duct M-17 runs along this wall." },
    ],
    nodes: ["W-23", "CT-05", "M-17", "Corridor C"],
    status: "Confirmed",
  });

  await base44.entities.Drawing.bulkCreate([
    { project_id: project.id, drawing_number: "E204", title: "Electrical Power Plan L05", discipline: "Electrical", revision: "B", status: "Issued" },
    { project_id: project.id, drawing_number: "M301", title: "Mechanical Services L05", discipline: "Mechanical", revision: "A", status: "Issued" },
    { project_id: project.id, drawing_number: "A105", title: "Architectural Plan L05", discipline: "Architecture", revision: "C", status: "Issued" },
  ]);

  await base44.entities.WorkflowEvent.bulkCreate([
    { issue_id: issue.id, project_id: project.id, event_type: "change_created", title: "Change created", description: issue.title, severity: "High", occurred_at: iso(9, 15) },
    { issue_id: issue.id, project_id: project.id, event_type: "collision_detected", title: "Potential collision detected", description: "Wall W-23 moved 300mm east", severity: "High", occurred_at: iso(9, 41) },
    { issue_id: issue.id, project_id: project.id, event_type: "analysis_completed", title: "Analysis completed", description: "Cable tray vs AHU duct M-17", severity: "Medium", occurred_at: iso(10, 10) },
  ]);

  return project;
}

export async function resetSampleWorkspace() {
  const entities = ["WorkflowEvent", "VerificationRun", "DrawingUpdate", "Drawing", "RFI", "Decision", "CollisionAnalysis", "EvidenceFact", "DiscussionMessage", "ChangeIssue", "Project"];
  for (const name of entities) {
    const records = await base44.entities[name].list("-created_date", 500);
    if (records.length) await base44.entities[name].deleteMany({ id: { $in: records.map((r) => r.id) } });
  }
  return loadSampleWorkspace();
}
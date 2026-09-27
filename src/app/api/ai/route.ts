import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { action, input, domain, currentSkills } = await req.json();

    if (action === 'enhance_bio') {
      // Generates an impactful student professional summary
      const response = `Aspiring Software Engineer & Tech Builder at ${input.college || 'University'}. Passionate about building resilient distributed systems and intuitive user interfaces. Active hackathon participant specializing in ${input.skills || 'modern web technologies'}, looking to collaborate on high-impact college and open-source initiatives.`;
      return NextResponse.json({ result: response });
    }

    if (action === 'extract_roles') {
      // Extracts roles and required skills from project description
      const desc = (input || '').toLowerCase();
      const suggestedRoles = [];

      if (desc.includes('ai') || desc.includes('machine learning') || desc.includes('rag') || desc.includes('llm')) {
        suggestedRoles.push({ roleTitle: 'AI/ML Lead', skillName: 'Python', category: 'AI / ML', priority: 'required' });
        suggestedRoles.push({ roleTitle: 'RAG Integration Member', skillName: 'LangChain', category: 'AI / ML', priority: 'required' });
      }
      if (desc.includes('ui') || desc.includes('frontend') || desc.includes('web') || desc.includes('assistant') || desc.includes('dashboard')) {
        suggestedRoles.push({ roleTitle: 'Frontend Engineer', skillName: 'React', category: 'Frontend', priority: 'required' });
        suggestedRoles.push({ roleTitle: 'UI/UX Designer', skillName: 'UI/UX Design', category: 'Design', priority: 'preferred' });
      }
      if (desc.includes('backend') || desc.includes('api') || desc.includes('database') || desc.includes('server')) {
        suggestedRoles.push({ roleTitle: 'Backend Developer', skillName: 'FastAPI', category: 'Backend', priority: 'required' });
        suggestedRoles.push({ roleTitle: 'Database Specialist', skillName: 'PostgreSQL', category: 'Database', priority: 'required' });
      }

      if (suggestedRoles.length === 0) {
        suggestedRoles.push({ roleTitle: 'Fullstack Lead', skillName: 'React', category: 'Frontend', priority: 'required' });
        suggestedRoles.push({ roleTitle: 'API Developer', skillName: 'Node.js', category: 'Backend', priority: 'required' });
      }

      return NextResponse.json({ roles: suggestedRoles });
    }

    if (action === 'skill_gap') {
      // Analyzes skill gaps for student
      const gaps = [
        {
          skill: 'TypeScript Strict Mode & Generics',
          reason: 'Most top hackathon frontend repos require production-grade type safety.',
          learningLink: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
        },
        {
          skill: 'Vector Databases & Embeddings',
          reason: 'Crucial for modern AI Campus assistants and RAG document search.',
          learningLink: 'https://python.langchain.com/docs/concepts/vectorstores/',
        },
        {
          skill: 'Docker Containerization',
          reason: 'Streamlines backend evaluation for judges and staging deployments.',
          learningLink: 'https://docs.docker.com/get-started/',
        },
      ];
      return NextResponse.json({ gaps });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('AI assistant error', error);
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}

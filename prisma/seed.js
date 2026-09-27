const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding GradLeaf database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.collaborationRequest.deleteMany();
  await prisma.task.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postLike.deleteMany();
  await prisma.post.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.projectSkill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Master Skills
  const skillsData = [
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'UI/UX Design', category: 'Design' },
    { name: 'Python', category: 'AI / ML' },
    { name: 'PyTorch', category: 'AI / ML' },
    { name: 'LangChain', category: 'AI / ML' },
    { name: 'FastAPI', category: 'Backend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Go', category: 'Backend' },
    { name: 'Flutter', category: 'Mobile' },
    { name: 'GraphQL', category: 'Backend' },
    { name: 'Redis', category: 'Database' },
  ];

  const skillMap = {};
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    skillMap[s.name] = created.id;
  }

  // 2. Create Users (Students)
  const alex = await prisma.user.create({
    data: {
      name: 'Alex Chen',
      email: 'alex.chen@campus.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
      college: 'MIT College of Engineering',
      course: 'B.S. Computer Science',
      department: 'EECS',
      year: 3,
      headline: 'Full-stack builder passionate about autonomous agents & campus tech',
      bio: 'Junior CS student building AI tools for student productivity. Organizer at HackMIT 2026. Looking for passionate teammates for hackathons!',
      interests: 'AI, Web Development, Cloud Systems',
      availability: '15-20 hrs/week (Evenings & Weekends)',
      githubUrl: 'https://github.com/alexchen',
      portfolioUrl: 'https://alexchen.dev',
      linkedinUrl: 'https://linkedin.com/in/alexchen-demo',
    },
  });

  const priya = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya.sharma@campus.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
      college: 'National Institute of Tech',
      course: 'B.Tech Information Technology',
      department: 'IT',
      year: 3,
      headline: 'Frontend Craftsman & UI/UX enthusiast • React, Tailwind, Next.js',
      bio: 'Crafting pixel-perfect interactive web apps. 2x hackathon winner (Best Design). Available for upcoming summer hackathons!',
      interests: 'Frontend Architecture, UI/UX Design, Design Systems',
      availability: '15 hrs/week (Flexible)',
      githubUrl: 'https://github.com/priyasharma',
      portfolioUrl: 'https://priyasharma.design',
      linkedinUrl: 'https://linkedin.com/in/priyasharma-demo',
    },
  });

  const marcus = await prisma.user.create({
    data: {
      name: 'Marcus Johnson',
      email: 'marcus.j@campus.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80',
      college: 'UC Berkeley',
      course: 'B.S. EECS',
      department: 'Computer Science',
      year: 4,
      headline: 'Backend Engineer • Scalable Systems, PostgreSQL & Go',
      bio: 'Senior student interested in distributed databases, microservices, and backend performance tuning.',
      interests: 'Distributed Systems, Backend APIs, Cloud Infrastructure',
      availability: '10-12 hrs/week',
      githubUrl: 'https://github.com/marcusj',
      portfolioUrl: 'https://marcus.io',
      linkedinUrl: 'https://linkedin.com/in/marcusj-demo',
    },
  });

  const elena = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      email: 'elena.r@campus.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      college: 'Stanford University',
      course: 'M.S. Artificial Intelligence',
      department: 'AI Lab',
      year: 1,
      headline: 'AI/ML Researcher • LLM Tool Use, LangChain & PyTorch',
      bio: 'Graduate researcher focusing on retrieval-augmented generation and reasoning models. Looking to build AI applications with solid engineering teams.',
      interests: 'AI, Natural Language Processing, Machine Learning',
      availability: '20 hrs/week (Hackathon sprint ready)',
      githubUrl: 'https://github.com/elenarostova',
      portfolioUrl: 'https://elena-ai.org',
      linkedinUrl: 'https://linkedin.com/in/elena-rostova',
    },
  });

  const rahul = await prisma.user.create({
    data: {
      name: 'Rahul Verma',
      email: 'rahul.v@campus.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      college: 'BITS Pilani',
      course: 'B.E. Computer Science',
      department: 'Computer Science',
      year: 2,
      headline: 'Mobile & Cloud Builder • Flutter & Node.js',
      bio: 'Sophomore building cross-platform student apps. Enjoys rapid prototyping, API integrations, and product development.',
      interests: 'Mobile Apps, Web Development, Cloud',
      availability: '15 hrs/week',
      githubUrl: 'https://github.com/rahulverma',
      portfolioUrl: 'https://rahulv.me',
      linkedinUrl: 'https://linkedin.com/in/rahulv-demo',
    },
  });

  // 3. Assign Skills to Users
  const userSkills = [
    // Alex
    { userId: alex.id, skillId: skillMap['Next.js'], status: 'Comfortable', proficiency: 5 },
    { userId: alex.id, skillId: skillMap['TypeScript'], status: 'Comfortable', proficiency: 4 },
    { userId: alex.id, skillId: skillMap['Python'], status: 'Project Experience', proficiency: 4 },
    { userId: alex.id, skillId: skillMap['PostgreSQL'], status: 'Project Experience', proficiency: 3 },
    // Priya
    { userId: priya.id, skillId: skillMap['React'], status: 'Comfortable', proficiency: 5 },
    { userId: priya.id, skillId: skillMap['Tailwind CSS'], status: 'Comfortable', proficiency: 5 },
    { userId: priya.id, skillId: skillMap['TypeScript'], status: 'Project Experience', proficiency: 4 },
    { userId: priya.id, skillId: skillMap['UI/UX Design'], status: 'Comfortable', proficiency: 5 },
    { userId: priya.id, skillId: skillMap['Next.js'], status: 'Practicing', proficiency: 3 },
    // Marcus
    { userId: marcus.id, skillId: skillMap['Go'], status: 'Comfortable', proficiency: 5 },
    { userId: marcus.id, skillId: skillMap['PostgreSQL'], status: 'Comfortable', proficiency: 5 },
    { userId: marcus.id, skillId: skillMap['Docker'], status: 'Comfortable', proficiency: 4 },
    { userId: marcus.id, skillId: skillMap['Node.js'], status: 'Project Experience', proficiency: 4 },
    { userId: marcus.id, skillId: skillMap['Redis'], status: 'Practicing', proficiency: 3 },
    // Elena
    { userId: elena.id, skillId: skillMap['Python'], status: 'Comfortable', proficiency: 5 },
    { userId: elena.id, skillId: skillMap['PyTorch'], status: 'Comfortable', proficiency: 5 },
    { userId: elena.id, skillId: skillMap['LangChain'], status: 'Comfortable', proficiency: 5 },
    { userId: elena.id, skillId: skillMap['FastAPI'], status: 'Project Experience', proficiency: 4 },
    // Rahul
    { userId: rahul.id, skillId: skillMap['Flutter'], status: 'Comfortable', proficiency: 4 },
    { userId: rahul.id, skillId: skillMap['Node.js'], status: 'Project Experience', proficiency: 4 },
    { userId: rahul.id, skillId: skillMap['React'], status: 'Practicing', proficiency: 3 },
    { userId: rahul.id, skillId: skillMap['PostgreSQL'], status: 'Learning', proficiency: 2 },
  ];

  for (const us of userSkills) {
    await prisma.userSkill.create({ data: us });
  }

  // 4. Create Project: AI-Powered Campus Assistant (Exact project from PDF specification)
  const campusProject = await prisma.project.create({
    data: {
      ownerId: alex.id,
      title: 'AI-Powered Campus Assistant',
      description: 'An intelligent multi-modal campus assistant that parses university syllabi, schedules assignment deadlines, answers course FAQs using RAG, and recommends study groups for students.',
      domain: 'AI & Machine Learning',
      deadline: '2026-10-15',
      status: 'recruiting',
      repoUrl: 'https://github.com/gradleaf-demo/campus-ai-assistant',
    },
  });

  // Assign required skills to Campus Project
  await prisma.projectSkill.create({
    data: { projectId: campusProject.id, skillId: skillMap['React'], role: 'React Developer', priority: 'required' }
  });
  await prisma.projectSkill.create({
    data: { projectId: campusProject.id, skillId: skillMap['FastAPI'], role: 'Backend Developer', priority: 'required' }
  });
  await prisma.projectSkill.create({
    data: { projectId: campusProject.id, skillId: skillMap['PostgreSQL'], role: 'Database Developer', priority: 'required' }
  });
  await prisma.projectSkill.create({
    data: { projectId: campusProject.id, skillId: skillMap['LangChain'], role: 'AI Integration Member', priority: 'required' }
  });

  // Project Members (Alex is Project Owner)
  await prisma.projectMember.create({
    data: {
      projectId: campusProject.id,
      userId: alex.id,
      role: 'Project Lead & Architect',
    },
  });

  // Project Tasks for Kanban
  await prisma.task.create({
    data: {
      projectId: campusProject.id,
      title: 'Design high-fidelity UI mockups for Chat & Syllabus Explorer',
      description: 'Create responsive desktop and mobile screens in Figma focusing on clean student experience.',
      status: 'in_progress',
      priority: 'high',
      assigneeName: 'Priya Sharma',
    },
  });

  await prisma.task.create({
    data: {
      projectId: campusProject.id,
      title: 'Setup PostgreSQL schema & vector embeddings table',
      description: 'Configure Prisma schema with pgvector extension support for campus document storage.',
      status: 'done',
      priority: 'high',
      assigneeName: 'Alex Chen',
    },
  });

  await prisma.task.create({
    data: {
      projectId: campusProject.id,
      title: 'Implement RAG pipeline with LangChain & hybrid search',
      description: 'Connect syllabus chunking and retrieval pipeline to OpenAI/Gemini embedding model.',
      status: 'todo',
      priority: 'high',
      assigneeName: 'Elena Rostova',
    },
  });

  await prisma.task.create({
    data: {
      projectId: campusProject.id,
      title: 'Write REST endpoints for document ingestion & user profiles',
      description: 'Build FastAPI routes with rate limiting and JWT verification.',
      status: 'todo',
      priority: 'medium',
      assigneeName: 'Marcus Johnson',
    },
  });

  // 4b. Additional Student Portfolio Projects for Alex Chen
  const devPulse = await prisma.project.create({
    data: {
      ownerId: alex.id,
      title: 'DevPulse - Peer Review & Git Analytics',
      description: 'Real-time developer productivity analytics and automated peer code review dashboard for collegiate engineering teams and hackathons.',
      domain: 'Web Development',
      deadline: '2026-11-20',
      status: 'active',
      repoUrl: 'https://github.com/gradleaf-demo/devpulse-analytics',
    },
  });

  await prisma.projectSkill.createMany({
    data: [
      { projectId: devPulse.id, skillId: skillMap['Next.js'], role: 'Frontend Lead', priority: 'required' },
      { projectId: devPulse.id, skillId: skillMap['TypeScript'], role: 'Fullstack Dev', priority: 'required' },
      { projectId: devPulse.id, skillId: skillMap['PostgreSQL'], role: 'Database Architect', priority: 'required' },
      { projectId: devPulse.id, skillId: skillMap['Docker'], role: 'DevOps Engineer', priority: 'preferred' },
    ],
  });

  await prisma.projectMember.create({
    data: {
      projectId: devPulse.id,
      userId: alex.id,
      role: 'Project Lead & Architect',
    },
  });

  const neuralNotes = await prisma.project.create({
    data: {
      ownerId: alex.id,
      title: 'NeuralNotes - Lecture AI Digest',
      description: 'Automated speech-to-text lecture digest that parses college recorded classes into structured study notes, concept graphs, and interactive quizzes.',
      domain: 'AI & Machine Learning',
      deadline: '2026-12-05',
      status: 'active',
      repoUrl: 'https://github.com/gradleaf-demo/neural-notes-ai',
    },
  });

  await prisma.projectSkill.createMany({
    data: [
      { projectId: neuralNotes.id, skillId: skillMap['Python'], role: 'AI / ML Engineer', priority: 'required' },
      { projectId: neuralNotes.id, skillId: skillMap['FastAPI'], role: 'Backend Developer', priority: 'required' },
      { projectId: neuralNotes.id, skillId: skillMap['PyTorch'], role: 'Model Tuning', priority: 'preferred' },
      { projectId: neuralNotes.id, skillId: skillMap['Redis'], role: 'Cache & Queue', priority: 'required' },
    ],
  });

  await prisma.projectMember.create({
    data: {
      projectId: neuralNotes.id,
      userId: alex.id,
      role: 'Lead AI Engineer',
    },
  });

  // Create another project: EcoTrack
  const ecoProject = await prisma.project.create({
    data: {
      ownerId: priya.id,
      title: 'EcoCampus - Carbon Footprint Gamification',
      description: 'Gamified mobile and web dashboard encouraging college students to adopt sustainable campus habits with peer challenges and rewards.',
      domain: 'Web Development',
      deadline: '2026-11-01',
      status: 'recruiting',
    },
  });

  await prisma.projectSkill.create({
    data: { projectId: ecoProject.id, skillId: skillMap['Tailwind CSS'], role: 'UI/UX Designer', priority: 'required' }
  });
  await prisma.projectSkill.create({
    data: { projectId: ecoProject.id, skillId: skillMap['Node.js'], role: 'Backend Engineer', priority: 'required' }
  });

  await prisma.projectMember.create({
    data: { projectId: ecoProject.id, userId: priya.id, role: 'Lead Designer & Organizer' }
  });

  // Marcus Projects
  const distKv = await prisma.project.create({
    data: {
      ownerId: marcus.id,
      title: 'DistributedKV - Raft Consensus Store',
      description: 'Fault-tolerant distributed key-value store implementing the Raft consensus algorithm with write-ahead logging and leader election.',
      domain: 'Distributed Systems',
      deadline: '2026-11-15',
      status: 'active',
      repoUrl: 'https://github.com/gradleaf-demo/distributed-kv',
    },
  });
  await prisma.projectSkill.createMany({
    data: [
      { projectId: distKv.id, skillId: skillMap['Go'], role: 'Distributed Systems Lead', priority: 'required' },
      { projectId: distKv.id, skillId: skillMap['Redis'], role: 'Storage Engineer', priority: 'required' },
    ],
  });
  await prisma.projectMember.create({ data: { projectId: distKv.id, userId: marcus.id, role: 'Lead Architect' } });

  // Elena Projects
  const arxivRag = await prisma.project.create({
    data: {
      ownerId: elena.id,
      title: 'ArxivRag - Research Paper Synthesis Agent',
      description: 'Autonomous retrieval agent that synthesizes academic literature into structured comparative tables and citation graphs.',
      domain: 'AI & Machine Learning',
      deadline: '2026-11-30',
      status: 'active',
      repoUrl: 'https://github.com/gradleaf-demo/arxiv-rag-agent',
    },
  });
  await prisma.projectSkill.createMany({
    data: [
      { projectId: arxivRag.id, skillId: skillMap['Python'], role: 'AI Researcher', priority: 'required' },
      { projectId: arxivRag.id, skillId: skillMap['LangChain'], role: 'RAG Pipeline Engineer', priority: 'required' },
    ],
  });
  await prisma.projectMember.create({ data: { projectId: arxivRag.id, userId: elena.id, role: 'Research Lead' } });

  // Rahul Projects
  const campusRide = await prisma.project.create({
    data: {
      ownerId: rahul.id,
      title: 'CampusRide - Peer Commute & Carpool',
      description: 'Cross-platform mobile carpooling network connecting verified university students heading in the same direction for daily campus commutes.',
      domain: 'Mobile Apps',
      deadline: '2026-11-25',
      status: 'active',
      repoUrl: 'https://github.com/gradleaf-demo/campus-ride',
    },
  });
  await prisma.projectSkill.createMany({
    data: [
      { projectId: campusRide.id, skillId: skillMap['Flutter'], role: 'Mobile Engineer', priority: 'required' },
      { projectId: campusRide.id, skillId: skillMap['Node.js'], role: 'Backend Lead', priority: 'required' },
    ],
  });
  await prisma.projectMember.create({ data: { projectId: campusRide.id, userId: rahul.id, role: 'Product Lead' } });

  // 5. Create Feed Posts
  const post1 = await prisma.post.create({
    data: {
      userId: alex.id,
      tag: 'Teammate Search',
      content: 'Excited to announce our project: "AI-Powered Campus Assistant"! We are building an agentic assistant for university students. Currently looking for a React frontend wizard and a Python/LangChain developer for the upcoming Hackathon. Check out our project page or drop a comment!',
    },
  });

  const post2 = await prisma.post.create({
    data: {
      userId: priya.id,
      tag: 'Project Milestone',
      content: 'Just finished publishing the complete design system for student portfolios on GradLeaf. Focused on accessible contrast, micro-interactions, and fluid typography. Let me know your thoughts on the dark mode preview!',
    },
  });

  const post3 = await prisma.post.create({
    data: {
      userId: elena.id,
      tag: 'Tech Resource',
      content: 'Quick tip for students working with LangChain & Local LLMs: Always use semantic chunking over fixed-size character splits for academic papers. We saw retrieval precision jump from 64% to 89% on our benchmark dataset!',
    },
  });

  // Comments & Likes
  await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: priya.id,
      content: 'This sounds amazing Alex! I have extensive experience with React & Tailwind and would love to collaborate on the frontend UI.',
    },
  });

  await prisma.comment.create({
    data: {
      postId: post1.id,
      userId: elena.id,
      content: 'I worked on syllabus parsing algorithms last semester. Count me in for the LangChain pipeline!',
    },
  });

  await prisma.postLike.create({
    data: { postId: post1.id, userId: priya.id },
  });
  await prisma.postLike.create({
    data: { postId: post1.id, userId: marcus.id },
  });
  await prisma.postLike.create({
    data: { postId: post2.id, userId: alex.id },
  });

  // 6. Collaboration Request (Demo ready)
  await prisma.collaborationRequest.create({
    data: {
      projectId: campusProject.id,
      senderId: alex.id,
      receiverId: priya.id,
      role: 'Frontend Lead (React)',
      message: 'Hi Priya! Your React and Tailwind experience is a perfect fit for our Campus Assistant project. Would love to have you on the team!',
      status: 'pending',
    },
  });

  // 7. Notifications
  await prisma.notification.create({
    data: {
      userId: priya.id,
      title: 'New Team Invitation',
      message: 'Alex Chen invited you to join "AI-Powered Campus Assistant" as Frontend Lead.',
      link: '/workspace/' + campusProject.id,
      type: 'invitation',
    },
  });

  await prisma.notification.create({
    data: {
      userId: alex.id,
      title: 'New Comment on your post',
      message: 'Priya Sharma commented on your post: "This sounds amazing Alex!"',
      link: '/feed',
      type: 'like',
    },
  });

  console.log('✅ GradLeaf database successfully seeded with realistic students, projects, skills, posts, and tasks!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

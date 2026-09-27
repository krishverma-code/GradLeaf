const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding comprehensive presentation dataset for GradLeaf...');

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
    { name: 'Kubernetes', category: 'DevOps' },
    { name: 'Go', category: 'Backend' },
    { name: 'Rust', category: 'Systems' },
    { name: 'Flutter', category: 'Mobile' },
    { name: 'GraphQL', category: 'Backend' },
    { name: 'Redis', category: 'Database' },
    { name: 'Solidity', category: 'Blockchain' },
    { name: 'Computer Vision', category: 'AI / ML' },
  ];

  const skillMap = {};
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    skillMap[s.name] = created.id;
  }

  // 2. Create 10 Realistic Student Profiles
  const alex = await prisma.user.create({
    data: {
      name: 'Alex Chen',
      email: 'alex.chen@campus.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
      college: 'MIT College of Engineering',
      course: 'B.S. Computer Science',
      department: 'EECS',
      year: 3,
      headline: 'Full-Stack Lead & AI Systems Builder • Next.js, LangChain, PyTorch',
      bio: 'Junior CS student building autonomous tools for university student productivity. HackMIT 2025 Winner. Passionate about LLM agents, distributed systems, and collaborative development.',
      interests: 'AI & Machine Learning, Web Development, Cloud Infrastructure',
      availability: '18 hrs/week (Flexible Evenings & Weekends)',
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
      headline: 'Frontend Architect & UI/UX Craftsman • React, Tailwind, Micro-interactions',
      bio: 'Passionate about human-centered interfaces, accessibility, and high-performance design systems. 2x hackathon winner (Best UI/UX). Open to collaborating on innovative student products!',
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
      headline: 'Distributed Systems & Backend Engineer • Go, Raft, High-Throughput APIs',
      bio: 'Senior CS student researching consensus algorithms, distributed fault-tolerance, and high-scale database caching. Enjoys systems programming, profiling, and open-source contributions.',
      interests: 'Distributed Systems, Backend APIs, Cloud Infrastructure',
      availability: '12 hrs/week',
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
      headline: 'AI/ML Researcher • Autonomous Agents, RAG Pipelines & PyTorch',
      bio: 'Graduate researcher focusing on hybrid neural retrieval, tool use, and multi-agent coordination. Looking to build real-world AI applications with strong collaborative student teams.',
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
      headline: 'Mobile & Full-Stack Prototyper • Flutter, Node.js, Cloud Run',
      bio: 'Sophomore building fluid cross-platform mobile apps for college students. Enjoys rapid UI prototyping, WebSockets, and real-time community experiences.',
      interests: 'Mobile Apps, Web Development, Cloud Systems',
      availability: '15 hrs/week',
      githubUrl: 'https://github.com/rahulverma',
      portfolioUrl: 'https://rahulv.me',
      linkedinUrl: 'https://linkedin.com/in/rahulv-demo',
    },
  });

  const sarah = await prisma.user.create({
    data: {
      name: 'Sarah Lin',
      email: 'sarah.lin@campus.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80',
      college: 'Carnegie Mellon University',
      course: 'B.S. Software Engineering',
      department: 'Institute for Software Research',
      year: 3,
      headline: 'Cloud Architect & DevOps Engineer • Kubernetes, Docker, CI/CD',
      bio: 'Junior software engineering major building automated deployment pipelines and zero-downtime microservices. AWS Certified Solutions Architect Associate.',
      interests: 'Cloud Infrastructure, DevOps, Distributed Systems',
      availability: '15 hrs/week',
      githubUrl: 'https://github.com/sarahlin',
      portfolioUrl: 'https://sarahlin.cloud',
      linkedinUrl: 'https://linkedin.com/in/sarahlin-demo',
    },
  });

  const david = await prisma.user.create({
    data: {
      name: 'David Kim',
      email: 'david.kim@campus.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      college: 'Georgia Tech',
      course: 'B.S. Robotics & Computer Science',
      department: 'Interactive Computing',
      year: 4,
      headline: 'Computer Vision & Robotics Engineer • PyTorch, OpenCV, ROS',
      bio: 'Senior building autonomous navigation drones and edge AI vision models. Seeking collaborative peers to integrate cloud robotics dashboards.',
      interests: 'Robotics, Computer Vision, Embedded Systems',
      availability: '12-15 hrs/week',
      githubUrl: 'https://github.com/davidkim',
      portfolioUrl: 'https://davidkim-robotics.com',
      linkedinUrl: 'https://linkedin.com/in/davidkim-demo',
    },
  });

  const aisha = await prisma.user.create({
    data: {
      name: 'Aisha Patel',
      email: 'aisha.patel@campus.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
      college: 'IIT Delhi',
      course: 'B.Tech Mathematics & Computing',
      department: 'Mathematics',
      year: 3,
      headline: 'FinTech & Cryptography Builder • Quantitative Analysis & Solidity',
      bio: 'Building peer micro-lending smart contracts and decentralized student grant disbursals. Strong foundation in cryptography and computational statistics.',
      interests: 'FinTech, Blockchain, Data Science',
      availability: '14 hrs/week',
      githubUrl: 'https://github.com/aishapatel',
      portfolioUrl: 'https://aisha-fintech.org',
      linkedinUrl: 'https://linkedin.com/in/aishapatel-demo',
    },
  });

  const carlos = await prisma.user.create({
    data: {
      name: 'Carlos Mendez',
      email: 'carlos.m@campus.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&h=200&q=80',
      college: 'UT Austin',
      course: 'B.S. Electrical & Computer Engineering',
      department: 'ECE',
      year: 2,
      headline: 'IoT & Hardware Hacker • Rust, Embedded C, Smart Energy',
      bio: 'Passionate about smart campus sensor grids and embedded IoT telemetry. Enjoys bridging physical sensor hardware with modern web dashboards.',
      interests: 'IoT, Hardware, Embedded Systems',
      availability: '16 hrs/week',
      githubUrl: 'https://github.com/carlosmendez',
      portfolioUrl: 'https://carlos-iot.me',
      linkedinUrl: 'https://linkedin.com/in/carlosm-demo',
    },
  });

  const ananya = await prisma.user.create({
    data: {
      name: 'Ananya Iyer',
      email: 'ananya.i@campus.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
      college: 'Jaypee Institute of Information Tech (JIIT)',
      course: 'B.Tech Computer Science & Engineering',
      department: 'CSE',
      year: 3,
      headline: 'Full-Stack Next.js Developer & Product Strategist • GraphQL, Prisma',
      bio: 'Junior building social-first collegiate tools. Led winning team at Hack-In-Summer 2026. Skilled in Next.js 15, PostgreSQL, and scalable API architecture.',
      interests: 'Web Development, Product Design, AI Applications',
      availability: '20 hrs/week (Hackathon ready)',
      githubUrl: 'https://github.com/ananyaiyer',
      portfolioUrl: 'https://ananya-dev.in',
      linkedinUrl: 'https://linkedin.com/in/ananyaiyer-demo',
    },
  });

  // 3. Assign Skills to Users with Mastery Taxonomy
  const userSkills = [
    // Alex Chen
    { userId: alex.id, skillId: skillMap['Next.js'], status: 'Comfortable', proficiency: 5 },
    { userId: alex.id, skillId: skillMap['TypeScript'], status: 'Comfortable', proficiency: 5 },
    { userId: alex.id, skillId: skillMap['Python'], status: 'Project Experience', proficiency: 4 },
    { userId: alex.id, skillId: skillMap['PostgreSQL'], status: 'Project Experience', proficiency: 4 },
    { userId: alex.id, skillId: skillMap['LangChain'], status: 'Project Experience', proficiency: 4 },
    // Priya Sharma
    { userId: priya.id, skillId: skillMap['React'], status: 'Comfortable', proficiency: 5 },
    { userId: priya.id, skillId: skillMap['Tailwind CSS'], status: 'Comfortable', proficiency: 5 },
    { userId: priya.id, skillId: skillMap['UI/UX Design'], status: 'Comfortable', proficiency: 5 },
    { userId: priya.id, skillId: skillMap['TypeScript'], status: 'Project Experience', proficiency: 4 },
    { userId: priya.id, skillId: skillMap['Next.js'], status: 'Practicing', proficiency: 3 },
    // Marcus Johnson
    { userId: marcus.id, skillId: skillMap['Go'], status: 'Comfortable', proficiency: 5 },
    { userId: marcus.id, skillId: skillMap['PostgreSQL'], status: 'Comfortable', proficiency: 5 },
    { userId: marcus.id, skillId: skillMap['Docker'], status: 'Comfortable', proficiency: 4 },
    { userId: marcus.id, skillId: skillMap['Redis'], status: 'Project Experience', proficiency: 4 },
    { userId: marcus.id, skillId: skillMap['Rust'], status: 'Practicing', proficiency: 3 },
    // Elena Rostova
    { userId: elena.id, skillId: skillMap['Python'], status: 'Comfortable', proficiency: 5 },
    { userId: elena.id, skillId: skillMap['PyTorch'], status: 'Comfortable', proficiency: 5 },
    { userId: elena.id, skillId: skillMap['LangChain'], status: 'Comfortable', proficiency: 5 },
    { userId: elena.id, skillId: skillMap['FastAPI'], status: 'Project Experience', proficiency: 4 },
    // Rahul Verma
    { userId: rahul.id, skillId: skillMap['Flutter'], status: 'Comfortable', proficiency: 5 },
    { userId: rahul.id, skillId: skillMap['Node.js'], status: 'Project Experience', proficiency: 4 },
    { userId: rahul.id, skillId: skillMap['React'], status: 'Practicing', proficiency: 3 },
    { userId: rahul.id, skillId: skillMap['PostgreSQL'], status: 'Learning', proficiency: 2 },
    // Sarah Lin
    { userId: sarah.id, skillId: skillMap['Docker'], status: 'Comfortable', proficiency: 5 },
    { userId: sarah.id, skillId: skillMap['Kubernetes'], status: 'Comfortable', proficiency: 5 },
    { userId: sarah.id, skillId: skillMap['Go'], status: 'Project Experience', proficiency: 4 },
    { userId: sarah.id, skillId: skillMap['TypeScript'], status: 'Practicing', proficiency: 3 },
    // David Kim
    { userId: david.id, skillId: skillMap['Computer Vision'], status: 'Comfortable', proficiency: 5 },
    { userId: david.id, skillId: skillMap['Python'], status: 'Comfortable', proficiency: 5 },
    { userId: david.id, skillId: skillMap['PyTorch'], status: 'Project Experience', proficiency: 4 },
    // Aisha Patel
    { userId: aisha.id, skillId: skillMap['Solidity'], status: 'Comfortable', proficiency: 4 },
    { userId: aisha.id, skillId: skillMap['Python'], status: 'Comfortable', proficiency: 5 },
    { userId: aisha.id, skillId: skillMap['PostgreSQL'], status: 'Project Experience', proficiency: 4 },
    // Carlos Mendez
    { userId: carlos.id, skillId: skillMap['Rust'], status: 'Project Experience', proficiency: 4 },
    { userId: carlos.id, skillId: skillMap['Python'], status: 'Comfortable', proficiency: 4 },
    { userId: carlos.id, skillId: skillMap['Node.js'], status: 'Practicing', proficiency: 3 },
    // Ananya Iyer
    { userId: ananya.id, skillId: skillMap['Next.js'], status: 'Comfortable', proficiency: 5 },
    { userId: ananya.id, skillId: skillMap['React'], status: 'Comfortable', proficiency: 5 },
    { userId: ananya.id, skillId: skillMap['GraphQL'], status: 'Comfortable', proficiency: 4 },
    { userId: ananya.id, skillId: skillMap['Tailwind CSS'], status: 'Comfortable', proficiency: 5 },
  ];

  for (const us of userSkills) {
    await prisma.userSkill.create({ data: us });
  }

  // 4. Create 10+ Diverse, Engaging Campus Projects
  // Project 1: AI-Powered Campus Assistant (Flagship)
  const campusProject = await prisma.project.create({
    data: {
      ownerId: alex.id,
      title: 'AI-Powered Campus Assistant',
      tagline: 'Multi-modal academic assistant for syllabi, FAQs, and assignment management',
      description: 'An intelligent multi-modal campus assistant that parses university syllabi, schedules assignment deadlines, answers course FAQs using RAG, and recommends study groups for students.',
      domain: 'AI & Machine Learning',
      deadline: '2026-10-15',
      status: 'recruiting',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
      demoUrl: 'https://campus-ai-assistant.vercel.app',
      repoUrl: 'https://github.com/gradleaf-demo/campus-ai-assistant',
    },
  });

  await prisma.projectSkill.createMany({
    data: [
      { projectId: campusProject.id, skillId: skillMap['React'], role: 'Frontend Developer', priority: 'required' },
      { projectId: campusProject.id, skillId: skillMap['FastAPI'], role: 'Backend Developer', priority: 'required' },
      { projectId: campusProject.id, skillId: skillMap['PostgreSQL'], role: 'Database Engineer', priority: 'required' },
      { projectId: campusProject.id, skillId: skillMap['LangChain'], role: 'AI Integration Lead', priority: 'required' },
    ],
  });

  await prisma.projectMember.createMany({
    data: [
      { projectId: campusProject.id, userId: alex.id, role: 'Project Lead & Architect' },
      { projectId: campusProject.id, userId: priya.id, role: 'Frontend UI/UX Specialist' },
    ],
  });

  await prisma.task.createMany({
    data: [
      {
        projectId: campusProject.id,
        title: 'Design high-fidelity UI mockups for Chat & Syllabus Explorer',
        description: 'Create responsive desktop and mobile screens focusing on clean student experience.',
        status: 'done',
        priority: 'high',
        assigneeName: 'Priya Sharma',
      },
      {
        projectId: campusProject.id,
        title: 'Setup PostgreSQL schema & vector embeddings table',
        description: 'Configure Prisma schema with pgvector extension support for campus document storage.',
        status: 'done',
        priority: 'high',
        assigneeName: 'Alex Chen',
      },
      {
        projectId: campusProject.id,
        title: 'Implement RAG pipeline with LangChain & hybrid search',
        description: 'Connect syllabus chunking and retrieval pipeline to Gemini and local embedding models.',
        status: 'in_progress',
        priority: 'high',
        assigneeName: 'Elena Rostova',
      },
      {
        projectId: campusProject.id,
        title: 'Write REST endpoints for document ingestion & user profiles',
        description: 'Build FastAPI routes with rate limiting and JWT session verification.',
        status: 'todo',
        priority: 'medium',
        assigneeName: 'Marcus Johnson',
      },
    ],
  });

  // Project 2: DevPulse
  const devPulse = await prisma.project.create({
    data: {
      ownerId: alex.id,
      title: 'DevPulse - Peer Review & Git Analytics',
      tagline: 'Developer productivity analytics and automated peer code reviews',
      description: 'Real-time developer productivity analytics and automated peer code review dashboard for collegiate engineering teams, hackathons, and capstone projects.',
      domain: 'Web Development',
      deadline: '2026-11-20',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
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
  await prisma.projectMember.create({ data: { projectId: devPulse.id, userId: alex.id, role: 'Lead Architect' } });
  await prisma.task.createMany({
    data: [
      { projectId: devPulse.id, title: 'GitHub Webhook Ingestion API', description: 'Stream commit and PR events directly into database', status: 'done', priority: 'high', assigneeName: 'Alex Chen' },
      { projectId: devPulse.id, title: 'Analytics Dashboard Charts', description: 'Interactive velocity and code churn charts using Tremor', status: 'in_progress', priority: 'high', assigneeName: 'Priya Sharma' },
    ],
  });

  // Project 3: NeuralNotes
  const neuralNotes = await prisma.project.create({
    data: {
      ownerId: alex.id,
      title: 'NeuralNotes - Lecture AI Digest',
      tagline: 'Speech-to-text lecture digest, concept graphs, and automated revision quizzes',
      description: 'Automated speech-to-text lecture digest that parses college recorded classes into structured study notes, concept graphs, and interactive flashcards.',
      domain: 'AI & Machine Learning',
      deadline: '2026-12-05',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      repoUrl: 'https://github.com/gradleaf-demo/neural-notes-ai',
    },
  });
  await prisma.projectSkill.createMany({
    data: [
      { projectId: neuralNotes.id, skillId: skillMap['Python'], role: 'AI / ML Engineer', priority: 'required' },
      { projectId: neuralNotes.id, skillId: skillMap['FastAPI'], role: 'Backend Developer', priority: 'required' },
      { projectId: neuralNotes.id, skillId: skillMap['Redis'], role: 'Queue Manager', priority: 'required' },
    ],
  });
  await prisma.projectMember.create({ data: { projectId: neuralNotes.id, userId: alex.id, role: 'Lead AI Engineer' } });

  // Project 4: EcoCampus
  const ecoProject = await prisma.project.create({
    data: {
      ownerId: priya.id,
      title: 'EcoCampus - Carbon Footprint Gamification',
      tagline: 'Gamified sustainability tracker and inter-hostel green challenges',
      description: 'Gamified mobile and web dashboard encouraging college students to adopt sustainable campus habits with peer challenges, meal emission counters, and dining discounts.',
      domain: 'Web Development',
      deadline: '2026-11-01',
      status: 'recruiting',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    },
  });
  await prisma.projectSkill.createMany({
    data: [
      { projectId: ecoProject.id, skillId: skillMap['Tailwind CSS'], role: 'UI/UX Designer', priority: 'required' },
      { projectId: ecoProject.id, skillId: skillMap['Node.js'], role: 'Backend Engineer', priority: 'required' },
      { projectId: ecoProject.id, skillId: skillMap['React'], role: 'Frontend Engineer', priority: 'required' },
    ],
  });
  await prisma.projectMember.create({ data: { projectId: ecoProject.id, userId: priya.id, role: 'Lead Organizer' } });

  // Project 5: DistributedKV
  const distKv = await prisma.project.create({
    data: {
      ownerId: marcus.id,
      title: 'DistributedKV - Raft Consensus Store',
      tagline: 'Fault-tolerant distributed key-value store with leader election',
      description: 'Fault-tolerant distributed key-value store implementing the Raft consensus algorithm with write-ahead logging, snapshotting, and linearizable reads.',
      domain: 'Distributed Systems',
      deadline: '2026-11-15',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      repoUrl: 'https://github.com/gradleaf-demo/distributed-kv',
    },
  });
  await prisma.projectSkill.createMany({
    data: [
      { projectId: distKv.id, skillId: skillMap['Go'], role: 'Distributed Systems Lead', priority: 'required' },
      { projectId: distKv.id, skillId: skillMap['Redis'], role: 'Cache Architect', priority: 'required' },
      { projectId: distKv.id, skillId: skillMap['Docker'], role: 'Container Orchestrator', priority: 'preferred' },
    ],
  });
  await prisma.projectMember.create({ data: { projectId: distKv.id, userId: marcus.id, role: 'Systems Architect' } });

  // Project 6: CloudMesh
  const cloudMesh = await prisma.project.create({
    data: {
      ownerId: sarah.id,
      title: 'CloudMesh - Microservice Service Mesh for Hackathons',
      tagline: 'Lightweight service discovery, mTLS security, and traffic routing for collegiate teams',
      description: 'A developer-friendly service mesh built for student hackathon projects requiring instant zero-trust internal networking and distributed tracing across hybrid cloud providers.',
      domain: 'Distributed Systems',
      deadline: '2026-12-10',
      status: 'recruiting',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    },
  });
  await prisma.projectSkill.createMany({
    data: [
      { projectId: cloudMesh.id, skillId: skillMap['Kubernetes'], role: 'K8s Specialist', priority: 'required' },
      { projectId: cloudMesh.id, skillId: skillMap['Go'], role: 'Proxy Core Developer', priority: 'required' },
    ],
  });
  await prisma.projectMember.create({ data: { projectId: cloudMesh.id, userId: sarah.id, role: 'Cloud Lead' } });

  // Project 7: ArxivRag
  const arxivRag = await prisma.project.create({
    data: {
      ownerId: elena.id,
      title: 'ArxivRag - Research Paper Synthesis Agent',
      tagline: 'Autonomous AI literature survey and comparative matrix synthesizer',
      description: 'Autonomous retrieval agent that ingests academic papers from Arxiv, generates comparative benchmark tables, and discovers conflicting empirical claims automatically.',
      domain: 'AI & Machine Learning',
      deadline: '2026-11-30',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
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

  // Project 8: VisionNav
  const visionNav = await prisma.project.create({
    data: {
      ownerId: david.id,
      title: 'VisionNav - Autonomous Campus Quad Drone',
      tagline: 'Edge AI computer vision obstacle avoidance for university quad delivery',
      description: 'Real-time monocular depth estimation and semantic segmentation running on Jetson Orin Nano for GPS-denied indoor and quad navigation.',
      domain: 'Robotics & Hardware',
      deadline: '2026-12-20',
      status: 'recruiting',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    },
  });
  await prisma.projectSkill.createMany({
    data: [
      { projectId: visionNav.id, skillId: skillMap['Computer Vision'], role: 'Perception Lead', priority: 'required' },
      { projectId: visionNav.id, skillId: skillMap['PyTorch'], role: 'Model Optimization', priority: 'required' },
    ],
  });
  await prisma.projectMember.create({ data: { projectId: visionNav.id, userId: david.id, role: 'Robotics Lead' } });

  // Project 9: CampusRide
  const campusRide = await prisma.project.create({
    data: {
      ownerId: rahul.id,
      title: 'CampusRide - Peer Commute & Carpool',
      tagline: 'Verified collegiate carpool and peer ride-sharing network',
      description: 'Cross-platform mobile carpooling network connecting verified university students heading in the same direction for daily campus commutes and weekend trips.',
      domain: 'Mobile Apps',
      deadline: '2026-11-25',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
      repoUrl: 'https://github.com/gradleaf-demo/campus-ride',
    },
  });
  await prisma.projectSkill.createMany({
    data: [
      { projectId: campusRide.id, skillId: skillMap['Flutter'], role: 'Mobile Lead', priority: 'required' },
      { projectId: campusRide.id, skillId: skillMap['Node.js'], role: 'Backend Lead', priority: 'required' },
    ],
  });
  await prisma.projectMember.create({ data: { projectId: campusRide.id, userId: rahul.id, role: 'Product Lead' } });

  // Project 10: CampusPay
  const campusPay = await prisma.project.create({
    data: {
      ownerId: aisha.id,
      title: 'CampusPay - Student Micro-Scholarship DAO',
      tagline: 'Transparent student grant disbursal with automated peer review milestones',
      description: 'Decentralized micro-grant allocation protocol where student engineering clubs submit milestones and receive instant automated funding upon verified GitHub pull request merges.',
      domain: 'FinTech & Analytics',
      deadline: '2026-12-15',
      status: 'recruiting',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    },
  });
  await prisma.projectSkill.createMany({
    data: [
      { projectId: campusPay.id, skillId: skillMap['Solidity'], role: 'Smart Contract Dev', priority: 'required' },
      { projectId: campusPay.id, skillId: skillMap['React'], role: 'Web3 Frontend', priority: 'required' },
    ],
  });
  await prisma.projectMember.create({ data: { projectId: campusPay.id, userId: aisha.id, role: 'FinTech Lead' } });

  // Project 11: SmartDorm
  const smartDorm = await prisma.project.create({
    data: {
      ownerId: carlos.id,
      title: 'SmartDorm - IoT Energy Optimization',
      tagline: 'Telemetry sensor mesh monitoring hostel energy and water conservation',
      description: 'Open-hardware environmental monitoring system built with ESP32 microcontrollers that surfaces actionable electricity and water savings data for university residence halls.',
      domain: 'Robotics & Hardware',
      deadline: '2026-12-01',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    },
  });
  await prisma.projectSkill.createMany({
    data: [
      { projectId: smartDorm.id, skillId: skillMap['Rust'], role: 'Embedded Firmware', priority: 'required' },
      { projectId: smartDorm.id, skillId: skillMap['Python'], role: 'Data Analysis', priority: 'required' },
    ],
  });
  await prisma.projectMember.create({ data: { projectId: smartDorm.id, userId: carlos.id, role: 'Hardware Lead' } });

  // Project 12: SkillGraph
  const skillGraphProj = await prisma.project.create({
    data: {
      ownerId: ananya.id,
      title: 'SkillGraph - Verified Collegiate Competency Network',
      tagline: 'Interactive 3D dependency graph of campus coursework and verified skills',
      description: 'Interactive knowledge graph visualizing college engineering curricula, prerequisites, and peer-to-peer tutoring relationships using force-directed graphs and GraphQL.',
      domain: 'Web Development',
      deadline: '2026-11-18',
      status: 'recruiting',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    },
  });
  await prisma.projectSkill.createMany({
    data: [
      { projectId: skillGraphProj.id, skillId: skillMap['Next.js'], role: 'Fullstack Lead', priority: 'required' },
      { projectId: skillGraphProj.id, skillId: skillMap['GraphQL'], role: 'API Architect', priority: 'required' },
    ],
  });
  await prisma.projectMember.create({ data: { projectId: skillGraphProj.id, userId: ananya.id, role: 'Lead Architect' } });

  // 5. Create Rich Campus Feed Posts
  const post1 = await prisma.post.create({
    data: {
      userId: alex.id,
      tag: 'Teammate Search',
      content: '🚀 Excited to announce our project: "AI-Powered Campus Assistant"! We are building an agentic assistant for university students that parses syllabi, tracks deadlines, and provides RAG course tutoring. Currently looking for a React frontend wizard and a Python/LangChain developer for the upcoming Hackathon. Check out our project page or drop a comment!',
    },
  });

  const post2 = await prisma.post.create({
    data: {
      userId: priya.id,
      tag: 'Project Milestone',
      content: '🎨 Just finished publishing the complete design system for student portfolios on GradLeaf. Focused on accessible contrast, micro-interactions, and fluid typography. Let me know your thoughts on the dark mode preview in the comments!',
    },
  });

  const post3 = await prisma.post.create({
    data: {
      userId: elena.id,
      tag: 'Tech Resource',
      content: '⚡ Quick tip for students working with LangChain & Local LLMs: Always use semantic chunking over fixed-size character splits for academic papers. We saw retrieval precision jump from 64% to 89% on our benchmark dataset!',
    },
  });

  const post4 = await prisma.post.create({
    data: {
      userId: marcus.id,
      tag: 'Tech Resource',
      content: '📊 Benchmarked our Go Raft consensus store against 100,000 write ops/second under 3-node cluster partitioning. Zero split-brain states and automatic leader re-election completed in under 180ms! Open-sourced on GitHub.',
    },
  });

  const post5 = await prisma.post.create({
    data: {
      userId: ananya.id,
      tag: 'Hackathon Alert',
      content: '🏆 Looking for 2 engineers (1 Fullstack + 1 ML) to join our squad for the upcoming National Collegiate Hackathon! We are building an autonomous campus skill exchange. DM me or apply on our project page!',
    },
  });

  const post6 = await prisma.post.create({
    data: {
      userId: david.id,
      tag: 'Showcase',
      content: '🚁 First successful outdoor quad test of our autonomous obstacle avoidance model! The drone mapped 4 buildings on campus in real-time with zero collisions. Looking for computer vision collaborators!',
    },
  });

  // Comments & Likes
  await prisma.comment.createMany({
    data: [
      {
        postId: post1.id,
        userId: priya.id,
        content: 'This sounds amazing Alex! I have extensive experience with React & Tailwind and would love to collaborate on the frontend UI.',
      },
      {
        postId: post1.id,
        userId: elena.id,
        content: 'I worked on syllabus parsing algorithms last semester. Count me in for the LangChain pipeline!',
      },
      {
        postId: post2.id,
        userId: alex.id,
        content: 'The typography hierarchy and sage green palettes look so clean Priya! Great work.',
      },
      {
        postId: post4.id,
        userId: sarah.id,
        content: '180ms leader election under partition is incredible Marcus! Are you using gRPC for heartbeats?',
      },
      {
        postId: post5.id,
        userId: rahul.id,
        content: 'I would love to handle the mobile Flutter interface for this Ananya!',
      },
    ],
  });

  await prisma.postLike.createMany({
    data: [
      { postId: post1.id, userId: priya.id },
      { postId: post1.id, userId: marcus.id },
      { postId: post1.id, userId: elena.id },
      { postId: post2.id, userId: alex.id },
      { postId: post2.id, userId: ananya.id },
      { postId: post3.id, userId: alex.id },
      { postId: post4.id, userId: sarah.id },
      { postId: post5.id, userId: rahul.id },
      { postId: post5.id, userId: priya.id },
    ],
  });

  // 6. Collaboration Requests (Ready for Demo)
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
  await prisma.notification.createMany({
    data: [
      {
        userId: priya.id,
        title: 'New Team Invitation',
        message: 'Alex Chen invited you to join "AI-Powered Campus Assistant" as Frontend Lead.',
        link: '/workspace/' + campusProject.id,
        type: 'invitation',
      },
      {
        userId: alex.id,
        title: 'New Comment on your post',
        message: 'Priya Sharma commented on your post: "This sounds amazing Alex!"',
        link: '/feed',
        type: 'like',
      },
      {
        userId: alex.id,
        title: 'New Peer Endorsement',
        message: 'Elena Rostova endorsed your "LangChain" competency.',
        link: '/profile/' + alex.id,
        type: 'endorsement',
      },
    ],
  });

  console.log('✅ GradLeaf presentation dataset successfully seeded: 10 students, 12 projects, 6 posts, 20 skills, 10 tasks!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

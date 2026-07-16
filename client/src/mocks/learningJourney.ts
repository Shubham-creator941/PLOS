export const learningJourneyData = {
  header: {
    goal: 'AWS Solutions Architect',
    status: 'On Track',
    estimatedCompletion: '12 Weeks',
    progress: 15,
  },
  why: 'I want to transition from a generalist developer to a specialized cloud architect to gain financial freedom and work on scalable distributed systems.',
  identity: 'I am becoming a Cloud Engineer who designs resilient and secure systems.',
  successDefinition: 'Passing the AWS Certified Solutions Architect - Associate exam with a score above 800.',
  systemPrinciples: [
    'Learn Daily',
    'Practice Deliberately',
    'Teach Others',
    'Reflect Frequently',
    'Stay Consistent'
  ],
  habits: {
    dailyLearning: { label: 'Daily Learning', streak: 5, maxStreak: 30, progress: 40 },
    weeklyReflection: { label: 'Weekly Reflection', streak: 2, maxStreak: 4, progress: 50 },
    teachBack: { label: 'Teach Back', streak: 1, maxStreak: 4, progress: 25 },
    projectProgress: { label: 'Project Progress', progress: 15 },
  },
  todaysMission: {
    title: 'Complete the VPC lesson',
    estimatedTime: '45 Minutes',
    difficulty: 'Medium',
    focusModeStatus: 'Ready'
  },
  weeks: [
    {
      id: 1,
      title: 'Week 1',
      milestone: 'Cloud Concepts & IAM',
      isCompleted: true,
      tasks: [
        'Understand cloud computing models (IaaS, PaaS, SaaS)',
        'Master IAM basics (Users, Groups, Roles, Policies)',
        'Set up AWS free tier account & billing alarms'
      ],
      estimatedHours: 8,
      cognitiveWorkload: 'Light',
      teachBackActivity: 'Explain IAM Roles vs Policies to a peer or in a blog post.',
      reflectionPrompt: 'What was the most counterintuitive part of AWS permissions?',
    },
    {
      id: 2,
      title: 'Week 2',
      milestone: 'Virtual Private Cloud (VPC)',
      isCompleted: false,
      isCurrent: true,
      tasks: [
        'Understand subnets, route tables, and internet gateways',
        'Configure NAT Gateways and Bastion Hosts',
        'Build a custom 3-tier VPC architecture from scratch'
      ],
      estimatedHours: 10,
      cognitiveWorkload: 'Intensive',
      teachBackActivity: 'Draw a VPC diagram and explain traffic flow from the internet to a private subnet.',
      reflectionPrompt: 'How does VPC peering simplify network architecture?',
    },
    {
      id: 3,
      title: 'Week 3',
      milestone: 'EC2 & Compute Services',
      isCompleted: false,
      tasks: [
        'Deep dive into EC2 instance types and purchasing options',
        'Configure Application Load Balancers and Auto Scaling Groups',
        'Deploy a scalable web application'
      ],
      estimatedHours: 12,
      cognitiveWorkload: 'Moderate',
      teachBackActivity: 'Explain the difference between ALB, NLB, and GLB.',
      reflectionPrompt: 'When would you choose Spot instances over On-Demand?',
    },
    {
      id: 4,
      title: 'Week 4',
      milestone: 'Storage Solutions (S3, EBS, EFS)',
      isCompleted: false,
      tasks: [
        'Master S3 storage classes and lifecycle policies',
        'Understand EBS volume types and snapshots',
        'Mount EFS across multiple EC2 instances'
      ],
      estimatedHours: 9,
      cognitiveWorkload: 'Moderate',
      teachBackActivity: 'Compare object storage (S3) vs block storage (EBS) with real-world examples.',
      reflectionPrompt: 'Why is S3 considered highly durable?',
    }
  ],
  motivationalQuotes: [
    "You wanted to become a Cloud Engineer. Today's lesson moves you one step closer.",
    "You defined success as passing the AWS Certification. Stay consistent.",
    "Remember why you started: Financial freedom and scalable systems.",
    "Every study session reinforces your new identity."
  ]
};

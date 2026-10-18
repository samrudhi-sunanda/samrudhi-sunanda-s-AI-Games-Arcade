export interface TeamMember {
  id: string;
  name: string;
  role: string;
  tag: string;
  initials: string;
  avatarGradient: string;
  badgeColor: string;
  responsibilitiesSummary: string;
  responsibilities: string[];
}

/**
 * Project Team Details
 * Easily editable placeholders for project team members and contributors.
 */
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'developer-1',
    name: 'Samruddhi S',
    role: 'Project Developer',
    tag: 'Lead Developer',
    initials: 'SS',
    avatarGradient: 'from-purple-600 via-indigo-600 to-pink-500',
    badgeColor: 'bg-purple-950/90 text-purple-300 border-purple-500/40',
    responsibilitiesSummary:
      'Project planning, overall architecture, AI algorithm implementation, UI development, and testing.',
    responsibilities: [
      'Project planning and system design',
      'Overall software architecture and modular hierarchy',
      'AI algorithm implementation (Minimax, A*, CSP, Alpha-Beta)',
      'UI/UX development and responsive styling',
      'Testing, optimization, and sound integration',
    ],
  },
  {
    id: 'developer-2',
    name: 'Jay K, Pratiksha K, Akanksha G',
    role: 'Co-Developer',
    tag: 'Co-Developers',
    initials: 'CO',
    avatarGradient: 'from-blue-600 via-cyan-600 to-teal-500',
    badgeColor: 'bg-cyan-950/90 text-cyan-300 border-cyan-500/40',
    responsibilitiesSummary:
      'Assisting with game logic, algorithm implementation, UI improvements, debugging, testing, and documentation.',
    responsibilities: [
      'Assisting with game logic and state validation',
      'Algorithm implementation support and test verification',
      'UI improvements and visual refinement',
      'Debugging, performance testing, and quality assurance',
      'Project documentation and algorithm analysis reports',
    ],
  },
];

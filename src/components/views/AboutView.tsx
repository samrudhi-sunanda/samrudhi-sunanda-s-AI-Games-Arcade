import React, { useState } from 'react';
import { 
  GraduationCap, 
  Code2, 
  BookOpen, 
  Sparkles, 
  BrainCircuit, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  Cpu, 
  Terminal, 
  Compass,
  ArrowRight,
  Users,
  Briefcase,
  UserCheck
} from 'lucide-react';
import { AI_CONCEPTS_LIST, AIConceptInfo } from '../../utils/gamesData.ts';
import { TEAM_MEMBERS, TeamMember } from '../../utils/teamData.ts';
import { AlgorithmModal } from '../AlgorithmModal.tsx';
import { ActiveView } from '../../types/index.ts';
import { soundManager } from '../../utils/audio.ts';

interface AboutViewProps {
  setActiveView: (view: ActiveView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setActiveView }) => {
  const [selectedConcept, setSelectedConcept] = useState<AIConceptInfo | null>(null);

  const handleOpenConcept = (concept: AIConceptInfo) => {
    soundManager.playClick();
    setSelectedConcept(concept);
  };

  return (
    <div className="space-y-14 py-6 sm:py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-500/40 transition-colors">
          Academic Mini-Project Documentation
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
          About AI Games Arcade
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed transition-colors">
          A collegiate engineering project developed to translate abstract Artificial Intelligence theory into interactive, playable browser simulations.
        </p>
      </div>

      {/* MEET OUR TEAM SECTION */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <Users className="w-4 h-4" />
            <span>Project Contributors</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
            Meet Our Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed transition-colors">
            "Built collaboratively through creativity, problem-solving, and Artificial Intelligence."
          </p>
        </div>

        {/* Responsive Two-Card Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="relative rounded-3xl bg-gradient-to-br from-white via-indigo-50/30 to-slate-50 border border-slate-200 shadow-md hover:shadow-xl dark:from-[#0f172a] dark:via-[#121c38] dark:to-[#171333] dark:border-indigo-500/30 p-6 sm:p-7 dark:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Profile Avatar & Header Header */}
                <div className="flex items-start gap-4 mb-5">
                  {/* Initials Avatar / Image Placeholder */}
                  <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr ${member.avatarGradient} p-0.5 shadow-md shadow-indigo-500/20 shrink-0`}>
                    <div className="w-full h-full bg-slate-50 dark:bg-[#0d142d] rounded-[14px] flex items-center justify-center transition-colors">
                      <span className="font-black text-xl sm:text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-white dark:via-slate-100 dark:to-indigo-200">
                        {member.initials}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${member.badgeColor}`}>
                        {member.role}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-300 font-medium mt-0.5">
                      {member.tag}
                    </p>
                  </div>
                </div>

                {/* Core Responsibilities Summary */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 mb-4 transition-colors">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    <Briefcase className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Role & Scope</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {member.responsibilitiesSummary}
                  </p>
                </div>

                {/* Detailed Responsibilities List */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Key Contributions & Responsibilities:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {member.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Department & Project affiliation footer */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 transition-colors">
                <span>Department of Computer Engineering</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">AI Mini-Project</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Student Author & Project Information Card */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/60 border border-indigo-100 shadow-lg dark:from-[#101935] dark:via-[#141b3d] dark:to-[#1a1236] dark:border-indigo-500/30 p-6 sm:p-8 dark:shadow-2xl space-y-6 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800/80 pb-6 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/25 font-black text-lg">
              SS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white transition-colors">Project Overview</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800/40">
                  Third-Year Mini-Project
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                Department of Computer Engineering
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bachelor of Engineering (Computer Engineering)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
              <span className="text-slate-500">Project:</span>{' '}
              <strong className="text-slate-900 dark:text-white">AI Games Arcade</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
              <span className="text-slate-500">Scope:</span>{' '}
              <strong className="text-emerald-600 dark:text-emerald-400">7 Playable AI Games</strong>
            </div>
          </div>
        </div>

        {/* Project Abstract */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>Project Abstract & Technical Scope</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The <strong>AI Games Arcade</strong> is a standalone web application designed as a Third-Year Computer Engineering mini-project. It addresses the pedagogical disconnect between theoretical Artificial Intelligence coursework and tangible practical implementations.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Rather than relying on black-box external cloud APIs or static simulations, all seven games execute real algorithmic decision engines client-side in TypeScript. Students and evaluators can inspect search trees, watch A* graph traversals, test Minimax depth penalization, inspect CSP backtracking steps, and evaluate how heuristic utility formulas balance multiple strategic dimensions.
          </p>
        </div>
      </div>

      {/* AI Learning Center — 8 Core Concepts Breakdown */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-4 h-4" />
            <span>Comprehensive Syllabus Mapping</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
            AI Learning Center: 8 Fundamental Concepts
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto transition-colors">
            Click on any module below to inspect the mathematical formulation, algorithmic execution steps, time/space complexity, and practical engineering use cases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AI_CONCEPTS_LIST.map((concept) => (
            <div
              key={concept.id}
              onClick={() => handleOpenConcept(concept)}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-50/80 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-500/30">
                    Concept #{concept.number}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {concept.associatedGame}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                  {concept.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {concept.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                <span>View Full Mathematical Analysis</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technology & Architectural Architecture */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 transition-colors">
          <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Technology Stack & Architecture</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">Frontend UI</span>
            <strong className="text-slate-900 dark:text-white text-sm">React 19 & TypeScript</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">Styling Engine</span>
            <strong className="text-slate-900 dark:text-white text-sm">Tailwind CSS v4</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">Audio Synthesis</span>
            <strong className="text-slate-900 dark:text-white text-sm">Web Audio API</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">Persistence</span>
            <strong className="text-slate-900 dark:text-white text-sm">HTML5 LocalStorage</strong>
          </div>
        </div>
      </section>

      {/* Modal for Deep-Dive Concept Analysis */}
      {selectedConcept && (
        <AlgorithmModal
          concept={selectedConcept}
          isOpen={Boolean(selectedConcept)}
          onClose={() => setSelectedConcept(null)}
        />
      )}
    </div>
  );
};

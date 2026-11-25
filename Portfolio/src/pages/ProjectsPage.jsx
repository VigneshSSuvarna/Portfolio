import React, { useState } from 'react';
import { Search, ArrowUpRight } from 'lucide-react';
import { projectsData } from '../data/portfolioData';
import { LiveStatusBadge } from '../components/LiveStatusBadge';

export default function ProjectsPage({ isDark, setCurrentPage, setPreviousPage }) {
  const [projectFilter, setProjectFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const projectCategories = ['All', ...new Set(projectsData.map(p => p.category).filter(Boolean))];

  const filteredProjects = projectsData.filter(project => {
    const matchesFilter = projectFilter === 'All' || project.category === projectFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Projects
          </h1>
          <p className={`text-sm sm:text-base mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Selected full-stack applications, AI systems, and tools I've built.
          </p>
        </div>

        {/* Search Bar */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-full md:w-64 transition-colors ${
          isDark ? 'bg-neutral-900 border-neutral-800 focus-within:border-neutral-500' : 'bg-white border-neutral-200 focus-within:border-neutral-400'
        }`}>
          <Search size={16} className={isDark ? 'text-neutral-500' : 'text-neutral-400'} />
          <input 
            type="text"
            placeholder="Search tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`bg-transparent border-none outline-none text-sm w-full font-mono ${isDark ? 'text-white placeholder-neutral-600' : 'text-neutral-900 placeholder-neutral-400'}`}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {projectCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setProjectFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors border cursor-pointer ${
              projectFilter === cat 
                ? (isDark ? 'bg-white border-white text-black' : 'bg-neutral-900 border-neutral-900 text-white')
                : (isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:text-black')
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filtered Projects Map */}
      <div className="flex flex-col gap-6">
        {filteredProjects.length === 0 ? (
          <div className={`p-8 text-center font-mono text-sm border rounded-xl border-dashed ${isDark ? 'border-neutral-800 text-neutral-500' : 'border-neutral-300 text-neutral-400'}`}>
            No projects found matching your criteria.
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                if (project.pageKey) {
                  setPreviousPage('projects');
                  setCurrentPage(project.pageKey);
                }
              }}
              className={`p-6 sm:p-8 rounded-xl border transition-all flex flex-col sm:flex-row sm:justify-between gap-4 shadow-sm cursor-pointer group ${
                isDark
                  ? 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-600'
                  : 'bg-white border-neutral-200 hover:border-neutral-400 hover:shadow-md'
              }`}
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className={`text-lg sm:text-xl font-semibold group-hover:underline underline-offset-4 transition-colors ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {project.title}
                  </h2>
                  {project.category && (
                    <span className={`text-xs font-mono px-2.5 py-1 rounded ${isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-700'}`}>
                      {project.category}
                    </span>
                  )}
                  <LiveStatusBadge url={project.demo} isDark={isDark} />
                </div>
                <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.techStack.map((tech) => (
                    <span key={tech} className={`text-xs sm:text-sm font-mono border px-2.5 py-1 rounded ${isDark ? 'text-neutral-400 bg-neutral-900 border-neutral-800' : 'text-neutral-700 bg-neutral-100 border-neutral-200'}`}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end justify-start gap-3 text-xs sm:text-sm font-mono shrink-0 pt-1">
                <a href={project.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className={`flex items-center gap-1.5 underline underline-offset-4 ${isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'}`}>
                  source <ArrowUpRight size={15} />
                </a>
                {project.demo !== "#" && (
                  <a href={project.demo} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className={`flex items-center gap-1.5 underline underline-offset-4 ${isDark ? 'text-white hover:text-neutral-300' : 'text-neutral-900 hover:text-black'}`}>
                    live demo <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
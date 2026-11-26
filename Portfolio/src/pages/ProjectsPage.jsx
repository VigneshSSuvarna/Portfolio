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

  const hairline = isDark ? 'border-neutral-800' : 'border-neutral-200';
  const divider = isDark ? 'divide-neutral-800' : 'divide-neutral-200';
  const headingText = isDark ? 'text-white' : 'text-black';
  const mutedText = 'text-[#737373]';
  const bodyText = isDark ? 'text-[#a3a3a3]' : 'text-[#525252]';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-semibold tracking-tight ${headingText}`}>
            Projects
          </h1>
          <p className={`text-sm mt-1 ${bodyText}`}>
            Selected full-stack applications, AI systems, and tools I've built.
          </p>
        </div>

        {/* Search Bar */}
        <div className={`flex items-center gap-2 pb-1.5 border-b w-full md:w-64 ${
          isDark ? 'border-neutral-800 focus-within:border-neutral-400' : 'border-neutral-200 focus-within:border-neutral-600'
        }`}>
          <Search size={14} className={mutedText} />
          <input
            type="text"
            placeholder="Filter by name or stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`bg-transparent border-none outline-none text-xs w-full font-mono ${isDark ? 'text-white placeholder-[#737373]' : 'text-black placeholder-[#737373]'}`}
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className={`flex flex-wrap gap-x-6 gap-y-2 border-b pb-3 ${hairline}`}>
        {projectCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setProjectFilter(cat)}
            className={`text-xs font-mono transition-colors cursor-pointer ${
              projectFilter === cat
                ? `${headingText} underline underline-offset-4`
                : `${mutedText} hover:${headingText}`
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filtered Projects List */}
      {filteredProjects.length === 0 ? (
        <div className={`py-12 text-center font-mono text-xs border-t border-b ${hairline} ${mutedText}`}>
          No projects found matching your criteria.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                if (project.pageKey) {
                  setPreviousPage('projects');
                  setCurrentPage(project.pageKey);
                }
              }}
              className={`border rounded-md px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer group transition-colors ${
                isDark
                  ? 'border-neutral-800 hover:border-neutral-600'
                  : 'border-neutral-200 hover:border-neutral-400'
              }`}
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2 className={`text-base font-medium group-hover:underline underline-offset-4 ${headingText}`}>
                    {project.title}
                  </h2>
                  <LiveStatusBadge url={project.demo} isDark={isDark} />
                </div>
                <p className={`text-sm leading-relaxed ${bodyText}`}>
                  {project.description}
                </p>
                <div className={`text-xs font-mono ${mutedText}`}>
                  {project.techStack.join(' · ')}
                </div>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end justify-start gap-2 text-xs font-mono shrink-0">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`inline-flex items-center gap-1 underline underline-offset-4 ${isDark ? 'text-[#a3a3a3] hover:text-white' : 'text-[#525252] hover:text-black'}`}
                >
                  Source <ArrowUpRight size={13} />
                </a>
                {project.demo !== "#" && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`inline-flex items-center gap-1 underline underline-offset-4 ${headingText}`}
                  >
                    Live Demo <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

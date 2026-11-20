import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { generateSlug } from '../utils/slugify';
import { documentProjects } from '../data/portfolioData';
import fallbackProjectImg from '../assets/images/hero_commercial_tower_1795156654561.jpg';

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '200px 0px' });

  useEffect(() => {
    if (!isInView) return;

    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, category, image')
          .neq('category', '인테리어');

        const fetchedList = !error && data ? (data as Project[]) : [];
        const existingTitles = new Set(fetchedList.map((p) => p.title.trim()));
        const missingDoc = documentProjects
          .filter((dp) => !existingTitles.has(dp.title.trim()))
          .map((dp) => ({
            id: dp.id,
            title: dp.title,
            category: dp.category,
            image: dp.image || '',
          }));
        const combined = [...missingDoc, ...fetchedList];

        const shuffled = combined.sort(() => 0.5 - Math.random()).slice(0, 4);
        setProjects(shuffled);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects(
          documentProjects.slice(0, 4).map((dp) => ({
            id: dp.id,
            title: dp.title,
            category: dp.category,
            image: dp.image || '',
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isInView]);

  return (
    <section ref={ref} className="py-16 md:py-24 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase mb-2">
              Portfolio
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              OUR BIG WINs
            </h2>
          </div>
          <Link
            to="/projects"
            className="hidden md:inline-flex items-center text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors group whitespace-nowrap shrink-0"
          >
            <span>{language === 'ko' ? '모든 프로젝트 보기' : 'VIEW ALL PROJECTS'}</span>
            <ArrowRight
              size={16}
              className="ml-2 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((skeleton) => (
              <div key={skeleton} className="space-y-3 animate-pulse">
                <div className="aspect-[4/3] rounded-2xl bg-gray-200" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-5 w-2/3 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, idx) => {
              const categoryLabel =
                language === 'ko'
                  ? project.category
                  : project.category === '상업'
                  ? 'Commercial'
                  : project.category === '주거'
                  ? 'Residential'
                  : project.category === '복합개발'
                  ? 'Mixed-Use'
                  : project.category === '근생'
                  ? 'Neighborhood'
                  : project.category;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="group"
                >
                  <Link
                    to={`/projects/${generateSlug(project.title)}`}
                    className="block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors"
                  >
                    <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
                      <img
                        src={project.image || fallbackProjectImg}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== fallbackProjectImg) {
                            target.src = fallbackProjectImg;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
                    </div>

                    <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1 tabular-nums">
                          <span className="font-mono text-gray-400">0{idx + 1}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-blue-600 font-semibold">{categoryLabel}</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {project.title}
                        </h3>
                      </div>

                      <span className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 group-hover:bg-gray-900 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <ArrowRight size={16} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/projects"
            className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors group"
          >
            <span>{language === 'ko' ? '모든 프로젝트 보기' : 'VIEW ALL PROJECTS'}</span>
            <ArrowRight
              size={16}
              className="ml-2 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

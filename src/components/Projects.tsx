import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { generateSlug } from '../utils/slugify';

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "200px 0px" });

  useEffect(() => {
    if (!isInView) return;

    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, category, image')
          .order('created_at', { ascending: false })
          .limit(4);
          
        if (error) throw error;
        setProjects(data as Project[]);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isInView]);

  return (
    <section ref={ref} className="py-12 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-gray-600 uppercase mb-2">Portfolio</h2>
            <h3 className="text-2xl md:text-4xl font-bold text-gray-900">OUR BIG WINs</h3>
          </div>
          <Link to="/projects" className="hidden md:inline-flex items-center text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors group">
            {language === 'ko' ? '모든 프로젝트 보기' : 'VIEW ALL PROJECTS'}
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">{language === 'ko' ? '프로젝트를 불러오는 중입니다...' : 'Loading projects...'}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative"
              >
                <Link to={`/projects/${generateSlug(project.title)}`} className="block">
                  <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/3]">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {language === 'ko' ? project.category : (
                      project.category === '상업' ? 'Commercial' :
                      project.category === '주거' ? 'Residential' :
                      project.category === '복합개발' ? 'Mixed-Use' :
                      project.category === '근생' ? 'Neighborhood' : project.category
                    )}
                  </p>
                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                    {project.title}
                  </h4>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/projects" className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors group">
            {language === 'ko' ? '모든 프로젝트 보기' : 'VIEW ALL PROJECTS'}
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

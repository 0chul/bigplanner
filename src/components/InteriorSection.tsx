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

export default function InteriorSection() {
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
          .eq('category', '인테리어');
          
        if (error) throw error;
        
        // 랜덤으로 섞은 후 4개만 선택
        const shuffled = (data as Project[]).sort(() => 0.5 - Math.random()).slice(0, 4);
        setProjects(shuffled);
      } catch (error) {
        console.error("Error fetching interior projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isInView]);

  return (
    <section ref={ref} className="py-12 md:py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-gray-600 uppercase mb-2">Interior</h2>
            <h3 className="text-2xl md:text-4xl font-bold text-gray-900">INTERIOR DESIGN</h3>
          </div>
          <Link to="/interior" className="hidden md:inline-flex items-center text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors group">
            {language === 'ko' ? '모든 인테리어 보기' : 'VIEW ALL INTERIORS'}
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">{language === 'ko' ? '인테리어 프로젝트를 불러오는 중입니다...' : 'Loading interior projects...'}</div>
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
                  <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/3] shadow-sm hover:shadow-lg transition-shadow duration-500">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                    {project.title}
                  </h4>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/interior" className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors group">
            {language === 'ko' ? '모든 인테리어 보기' : 'VIEW ALL INTERIORS'}
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect, useRef } from 'react';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactCTA from '../components/ContactCTA';
import { supabase } from '../supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { generateSlug } from '../utils/slugify';
import { Project } from './Projects';

const PAGE_SIZE = 9;

export default function InteriorPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { language } = useLanguage();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchProjects = async (pageIndex: number) => {
    try {
      if (pageIndex === 0) setLoading(true);
      else setFetchingMore(true);

      const start = pageIndex * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('category', '인테리어')
        .order('created_at', { ascending: false })
        .range(start, end);
        
      if (error) throw error;
      
      if (data) {
        if (pageIndex === 0) {
          setProjects(data as Project[]);
        } else {
          setProjects(prev => {
            const newProjects = data as Project[];
            const uniqueProjects = newProjects.filter(np => !prev.some(p => p.id === np.id));
            return [...prev, ...uniqueProjects];
          });
        }
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch (error) {
      console.error("Error fetching interior projects:", error);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjects(0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // Trigger only when intersecting closely, avoid loading too much in advance
      if (entries[0].isIntersecting && hasMore && !loading && !fetchingMore) {
        setPage(prev => {
          const nextPage = prev + 1;
          fetchProjects(nextPage);
          return nextPage;
        });
      }
    }, {
      rootMargin: '100px', // Fetch only when 100px from the bottom
      threshold: 0.1
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, fetchingMore]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <SEO 
        title={language === 'ko' ? '인테리어 | 빅플래너파트너스' : 'Interior | BIGPLANNER PARTNERS'}
        description={language === 'ko' ? "빅플래너파트너스의 감각적인 인테리어 포트폴리오를 소개합니다." : "Introducing BIGPLANNER PARTNERS' sophisticated interior portfolio."}
        url="https://bigplanner.co.kr/interior"
        image="https://injrbniytgtubemniaps.supabase.co/storage/v1/object/public/bigplanner/logo.png"
      />
      <Navbar />
      
      <div className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight"
          >
            Interior Portfolio
          </motion.h1>
        </div>
      </div>

      <div className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "50px" }}
                  key={project.id}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/5] shadow-sm hover:shadow-xl transition-shadow duration-500"
                >
                  <Link to={`/projects/${generateSlug(project.title)}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View {project.title}</span>
                  </Link>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      {project.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Load More Observer Target */}
            <div ref={loadMoreRef} className="py-8 flex justify-center mt-8">
              {fetchingMore && (
                <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
              )}
            </div>
          </>
        )}
      </div>
      <ContactCTA />
      <Footer />
    </div>
  );
}

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
import { ArrowUpRight, Grid, SlidersHorizontal, Eye } from 'lucide-react';

const PAGE_SIZE = 9;

export default function InteriorPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  
  // Editorial Category Filter
  const [activeSubcategory, setActiveSubcategory] = useState('All');
  const [subcategories, setSubcategories] = useState<string[]>(['All']);
  
  const { language } = useLanguage();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const fetchProjects = async (pageIndex: number, resetList = false) => {
    try {
      if (pageIndex === 0) setLoading(true);
      else setFetchingMore(true);

      const start = pageIndex * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      if (pageIndex === 0 || resetList) {
        let query = supabase
          .from('projects')
          .select('*')
          .eq('category', '인테리어')
          .order('created_at', { ascending: false });

        if (activeSubcategory !== 'All') {
          query = query.eq('subcategory', activeSubcategory);
        }

        const { data, error } = await query;
          
        if (error) throw error;
        
        if (data) {
          // Randomize the order of projects across all pages for the magazine look
          const randomizedData = [...data].sort(() => Math.random() - 0.5);
          setAllProjects(randomizedData as Project[]);
          
          const paginatedData = randomizedData.slice(start, end + 1);
          setProjects(paginatedData as Project[]);
          setHasMore(paginatedData.length === PAGE_SIZE && end < data.length - 1);
        }
      } else {
        const paginatedData = allProjects.slice(start, end + 1);
        setProjects(prev => {
          const newProjects = paginatedData as Project[];
          const uniqueProjects = newProjects.filter(np => !prev.some(p => p.id === np.id));
          return [...prev, ...uniqueProjects];
        });
        setHasMore(paginatedData.length === PAGE_SIZE && end < allProjects.length - 1);
      }
    } catch (error) {
      console.error("Error fetching interior projects:", error);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  // Fetch unique subcategories for filters
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('subcategory')
          .eq('category', '인테리어');
          
        if (error) throw error;
        
        if (data) {
          const subs = Array.from(new Set(data.map(item => item.subcategory).filter(Boolean))) as string[];
          setSubcategories(['All', ...subs]);
        }
      } catch (e) {
        console.error("Error fetching subcategories:", e);
      }
    };
    fetchSubcategories();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjects(0, true);
    setPage(0);
  }, [activeSubcategory]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading && !fetchingMore) {
        setPage(prev => {
          const nextPage = prev + 1;
          fetchProjects(nextPage);
          return nextPage;
        });
      }
    }, {
      rootMargin: '100px',
      threshold: 0.1
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, fetchingMore, activeSubcategory]);

  return (
    <div className="min-h-screen bg-[#FCFBFA] font-sans text-gray-900 pb-12">
      <SEO 
        title={language === 'ko' ? '인테리어 아카이브 | 빅플래너파트너스' : 'Interior Archive | BIGPLANNER PARTNERS'}
        description={language === 'ko' ? "N도씨 디자인의 감성적이고 감각적인 하이엔드 인테리어 포트폴리오 매거진." : "Highend interior design portfolio magazine of N-Degree Design."}
        url="https://bigplanner.co.kr/interior"
        image="https://injrbniytgtubemniaps.supabase.co/storage/v1/object/public/bigplanner/logo.png"
      />
      <Navbar />
      
      {/* Magazine Editorial Masthead */}
      <div className="pt-28 pb-16 md:pt-40 md:pb-24 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-gray-500 uppercase mb-3">
                <span>INTERIOR DESIGN ARCHIVE</span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                <span>VOL. 3.0</span>
              </div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-6xl md:text-7xl font-light text-gray-900 leading-none tracking-tight font-serif"
              >
                SPACES <span className="font-sans font-bold">EMOTION</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-sm sm:text-base text-gray-600 max-w-xl font-light leading-relaxed"
              >
                {language === 'ko' ? (
                  "자연스러운 물성과 정교한 마감, 선과 면의 미학으로 완성한 N도씨 인테리어 아카이브. 단순한 인테리어를 넘어 거주자의 삶을 담아두는 여백의 미학을 잡지처럼 감상해보세요."
                ) : (
                  "N-Degree's interior archive completed with natural texture, sophisticated lines, and rich planes. Experience architectural spaces presented like an aesthetic editorial magazine."
                )}
              </motion.p>
            </div>
            
            <div className="text-left md:text-right font-mono text-[11px] leading-relaxed text-gray-500 border-l md:border-l-0 md:border-r border-gray-200 pl-4 md:pl-0 md:pr-4">
              <p>DESIGN STUDIO N-DEGREE</p>
              <p>PERSPECTIVE OF MODERN ATELIER</p>
              <p>BIGPLANNER COOPERATION SPECIAL EDITION</p>
            </div>
          </div>

          {/* Elegant Magazine Border Line Divider */}
          <div className="w-full flex justify-between items-center py-2 border-y border-gray-900 text-[10px] font-mono tracking-widest text-gray-500">
            <span>ISSUE NO. 03 // 2026 SPECIAL</span>
            <span>ATELIER DE DESIGN INTÉRIEUR</span>
            <span>SEOUL, KOREA</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Magazine Subcategory Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200/80 pb-6 mb-12 gap-4">
          <div className="flex items-center gap-2.5 text-xs font-mono text-gray-800 font-bold uppercase tracking-wider">
            <SlidersHorizontal size={14} />
            <span>Curate Space Field :</span>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-0">
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubcategory(sub)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-300 ${
                  activeSubcategory === sub
                    ? "bg-gray-900 text-white font-semibold"
                    : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/90"
                }`}
              >
                {sub === 'All' ? (language === 'ko' ? '전체 필드' : 'ALL FIELDS') : sub}
              </button>
            ))}
          </div>
        </div>

        {/* Magazine Grid Layout */}
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
            <p className="mt-4 text-xs font-mono text-gray-500 tracking-wider">LOADING JOURNAL...</p>
          </div>
        ) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12"
            >
              <AnimatePresence mode="popLayout">
                {projects.map((project, idx) => {
                  const isFeaturedSpread = idx % 3 === 0; // Asymmetrical Magazine Layout: Every 3rd item is a wide layout spread
                  const padNum = String(idx + 1).padStart(2, '0');

                  if (isFeaturedSpread) {
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.7 }}
                        key={project.id}
                        className="md:col-span-2 group flex flex-col md:flex-row gap-8 bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500"
                      >
                        {/* Featured Spread Left side: Beautiful frame */}
                        <div className="w-full md:w-3/5 overflow-hidden rounded-2xl relative aspect-[4/3] bg-gray-50 flex-shrink-0">
                          <Link to={`/projects/${generateSlug(project.title)}`} className="absolute inset-0 z-20" />
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <div className="absolute top-4 left-4 bg-gray-900/90 text-white font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full z-10 backdrop-blur-sm">
                            FEATURED LOOK
                          </div>
                        </div>

                        {/* Featured Spread Right side: Magazine Columns Text Editorial layout */}
                        <div className="flex flex-col justify-between py-2 flex-grow">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                              <span>NO. {padNum}</span>
                              <span className="text-indigo-600 font-semibold">{project.subcategory || (language === 'ko' ? '인테리어디자인' : 'Spatial Design')}</span>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                              <Link to={`/projects/${generateSlug(project.title)}`}>
                                {project.title}
                              </Link>
                            </h3>
                            
                            <hr className="border-gray-100" />
                            
                            <p className="text-xs text-gray-600 font-light leading-relaxed line-clamp-4">
                              {project.description || (language === 'ko' ? '어지러운 도심 속 공간의 아름다움을 정갈함으로 채워낸 인테리어 디자인 프로젝트입니다. 빛과 자연소재가 온전히 어우러지는 따뜻하고 정숙한 무드를 선사합니다.' : 'An editorial design highlighting pristine harmony, texture, and elegant lines inside residential space.')}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-100/50 space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-[11px] font-mono text-gray-500">
                              <div>
                                <span className="block text-[9px] text-gray-400">LOCATION</span>
                                <span className="text-gray-900 font-medium truncate block">{project.location || 'Seoul, Korea'}</span>
                              </div>
                              <div>
                                <span className="block text-[9px] text-gray-400">PROJECT YEAR</span>
                                <span className="text-gray-900 font-medium block">{project.year || '2025'}</span>
                              </div>
                            </div>

                            <Link 
                              to={`/projects/${generateSlug(project.title)}`}
                              className="inline-flex items-center gap-2 mt-4 text-xs font-mono font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-widest"
                            >
                              <span>READ ARTICLE</span>
                              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  // Standard Portrait Editorial Card
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.7 }}
                      key={project.id}
                      className="group flex flex-col bg-white p-5 rounded-3xl border border-gray-100/80 shadow-sm hover:shadow-lg transition-all duration-500"
                    >
                      {/* Image section */}
                      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-50 mb-5">
                        <Link to={`/projects/${generateSlug(project.title)}`} className="absolute inset-0 z-10" />
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 to-transparent h-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Info details under image */}
                      <div className="flex flex-col justify-between flex-grow">
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center text-[11px] font-mono text-gray-400">
                            <span>LOOK NO. {padNum}</span>
                            <span>{project.subcategory || 'Interior Layout'}</span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                            <Link to={`/projects/${generateSlug(project.title)}`}>
                              {project.title}
                            </Link>
                          </h3>
                          
                          <p className="text-[11px] text-gray-500 font-light line-clamp-2 leading-relaxed">
                            {project.description || (language === 'ko' ? 'N도씨만의 섬세한 선의 비례와 차분한 톤온톤 구성이 돋보이는 작품입니다.' : 'A narrative structure showcasing soft color tones and warm atmosphere.')}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] font-mono text-gray-500">
                          <span>{project.location || 'Seoul'}</span>
                          <span>•</span>
                          <span>{project.year || '2025'}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {!loading && projects.length === 0 && (
              <div className="text-center py-24 text-gray-400 font-mono">
                {language === 'ko' ? '해당 필드의 프로젝트가 없습니다.' : 'NO PROJECTS SELECTED IN THIS FIELD.'}
              </div>
            )}
            
            {/* Load More Observer Target */}
            <div ref={loadMoreRef} className="py-12 flex justify-center mt-12">
              {fetchingMore && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span className="text-[10px] font-mono tracking-wider text-gray-400">LOADING MORE ITEMS...</span>
                </div>
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


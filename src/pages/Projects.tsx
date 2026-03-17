import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactCTA from '../components/ContactCTA';
import { supabase } from '../supabase';

const categories = ["All", "상업", "주거", "복합개발", "근생"];

export interface Project {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  year?: string;
  location?: string;
  client?: string;
  role?: string;
  image?: string;
  gallery?: string[];
  description?: string;
  challenge?: string;
  solution?: string;
  zoning?: string;
  land_area?: string;
  building_area?: string;
  total_floor_area?: string;
  scale?: string;
  far?: string;
  bcr?: string;
  notes?: string;
  created_at?: string;
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*');
          
        if (error) throw error;
        // Shuffle the array randomly
        const shuffledData = (data as Project[]).sort(() => Math.random() - 0.5);
        setAllProjects(shuffledData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = activeCategory === "All" 
      ? allProjects 
      : allProjects.filter(project => project.category === activeCategory);
    setDisplayedProjects(filtered.slice(0, visibleCount));
  }, [allProjects, activeCategory, visibleCount]);

  useEffect(() => {
    // Reset visible count when category changes
    setVisibleCount(6);
  }, [activeCategory]);

  useEffect(() => {
    const filtered = activeCategory === "All" 
      ? allProjects 
      : allProjects.filter(project => project.category === activeCategory);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Only load more if we haven't displayed all filtered projects
          if (displayedProjects.length < filtered.length) {
            setVisibleCount(prev => prev + 6);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [displayedProjects, activeCategory, allProjects]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Helmet>
        <title>프로젝트 | 빅플래너파트너스</title>
        <meta name="description" content="빅플래너파트너스가 완성한 다양한 건축 및 개발 프로젝트를 소개합니다. 공간의 가치를 극대화하는 우리의 결과물을 확인해보세요." />
        <meta name="keywords" content="빅플래너파트너스, 프로젝트, 건축, 부동산개발, 포트폴리오" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "프로젝트 목록",
              "description": "빅플래너파트너스가 완성한 다양한 건축 및 개발 프로젝트를 소개합니다."
            }
          `}
        </script>
      </Helmet>
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Our Portfolio
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            빅플래너파트너스가 완성한 다양한 건축 및 개발 프로젝트를 소개합니다.
            공간의 가치를 극대화하는 우리의 결과물을 확인해보세요.
          </motion.p>
        </div>
      </div>

      {/* Filter & Grid Section */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === category 
                  ? "bg-gray-900 text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">프로젝트를 불러오는 중입니다...</div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {displayedProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={project.id}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/5] shadow-sm hover:shadow-xl transition-shadow duration-500"
                >
                  <Link to={`/projects/${project.id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View {project.title}</span>
                  </Link>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-white/80 text-sm font-bold uppercase tracking-wider">
                        {project.category}
                      </span>
                      <span className="text-white/60 text-sm font-medium">
                        {project.year}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      {project.title}
                    </h3>
                    
                    {/* Hidden line that expands on hover */}
                    <div className="w-0 h-0.5 bg-white mt-4 transition-all duration-500 group-hover:w-12" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        <div ref={sentinelRef} className="h-10" />

        {!loading && displayedProjects.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            해당 카테고리의 프로젝트가 없습니다.
          </div>
        )}
      </div>

      <ContactCTA />
      <Footer />
    </div>
  );
}

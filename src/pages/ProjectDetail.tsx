import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Target, Lightbulb, Building2, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactCTA from '../components/ContactCTA';
import { supabase } from '../supabase';
import { Project } from './Projects';
import { useLanguage } from '../contexts/LanguageContext';
import { generateSlug } from '../utils/slugify';

const SpecItem = ({ label, value }: { label: string, value: React.ReactNode }) => {
  if (!value) return null;
  return (
    <div className="py-3 flex justify-between items-start gap-4 border-b border-gray-200/60 last:border-0">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 mt-0.5">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right break-keep">{value}</span>
    </div>
  );
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchAllProjects = async () => {
      setLoading(true);
      try {
        // Fetch all projects
        const { data: allProjectsData, error: allProjectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (allProjectsError) {
          console.error("Error fetching all projects:", allProjectsError);
        } else {
          setAllProjects(allProjectsData as Project[]);
          const foundProject = (allProjectsData as Project[]).find(p => generateSlug(p.title) === slug);
          setProject(foundProject || null);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans text-gray-900">
        <div className="text-xl text-gray-500">{language === 'ko' ? '프로젝트 정보를 불러오는 중입니다...' : 'Loading project information...'}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans text-gray-900">
        <h1 className="text-4xl font-bold mb-4">{language === 'ko' ? '프로젝트를 찾을 수 없습니다.' : 'Project not found.'}</h1>
        <Link to="/projects" className="text-blue-600 hover:underline">
          {language === 'ko' ? '프로젝트 목록으로 돌아가기' : 'Back to projects list'}
        </Link>
      </div>
    );
  }

  const projectIndex = allProjects.findIndex(p => p.id === id);
  const nextProject = allProjects.length > 1 ? allProjects[(projectIndex + 1) % allProjects.length] : null;
  const prevProject = allProjects.length > 1 ? allProjects[(projectIndex - 1 + allProjects.length) % allProjects.length] : null;

  const formatArea = (m2: string | undefined) => {
    if (!m2) return null;
    const num = parseFloat(m2.replace(/,/g, ''));
    if (isNaN(num)) return `${m2} ㎡`;
    const pyeong = (num * 0.3025).toFixed(1);
    return `${m2} ㎡ (${pyeong} ${language === 'ko' ? '평' : 'pyeong'})`;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <SEO 
        title={`${project.title} | ${language === 'ko' ? '빅플래너파트너스' : 'BIGPLANNER PARTNERS'}`}
        description={project.description?.substring(0, 150) || (language === 'ko' ? `${project.title} 프로젝트 상세 페이지입니다.` : `${project.title} project detail page.`)}
        url={`https://bigplanner.co.kr/projects/${generateSlug(project.title)}`}
        image={project.image || "https://injrbniytgtubemniaps.supabase.co/storage/v1/object/public/bigplanner/logo.png"}
      />
      <Helmet>
        <meta name="keywords" content={language === 'ko' ? `빅플래너파트너스, ${project.title}, ${project.category}, 건축, 부동산개발` : `BIGPLANNER PARTNERS, ${project.title}, ${project.category}, Architecture, Real Estate Development`} />
        <link rel="canonical" href={`https://bigplanner.co.kr/projects/${generateSlug(project.title)}`} />
        <script type="application/ld+json">
          {`
            [
              {
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                "name": "${project.title}",
                "description": "${project.description?.substring(0, 150) || ''}",
                "image": "${project.image || ''}",
                "url": "https://bigplanner.co.kr/projects/${generateSlug(project.title)}"
              },
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "${language === 'ko' ? '홈' : 'Home'}",
                    "item": "https://bigplanner.co.kr/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "${language === 'ko' ? '프로젝트' : 'Projects'}",
                    "item": "https://bigplanner.co.kr/projects"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "${project.title}",
                    "item": "https://bigplanner.co.kr/projects/${generateSlug(project.title)}"
                  }
                ]
              }
            ]
          `}
        </script>
      </Helmet>
      <Navbar />
      
      {/* Hero Image */}
      <div className="relative h-[60vh] md:h-[85vh] w-full">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
        </motion.div>
        
        <div className="absolute inset-0 flex items-end pb-20 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 border border-white/30 rounded-full text-white/90 text-xs font-bold tracking-widest uppercase backdrop-blur-md bg-white/10">
                  {project.category}
                </span>
                {project.year && (
                  <span className="text-white/80 text-sm font-medium tracking-wider">
                    {project.year}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-4 md:mb-6">
                {project.title}
              </h1>
              {project.location && (
                <p className="text-base md:text-xl text-white/80 font-light flex items-center gap-2">
                  <MapPin size={20} />
                  {project.location}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          
          {/* Left Column: Metadata */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <div className="sticky top-32 bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 size={20} className="text-indigo-600" />
                Project Facts
              </h3>
              <div className="space-y-1">
                <SpecItem label={language === 'ko' ? '클라이언트' : 'Client'} value={project.client} />
                <SpecItem label={language === 'ko' ? '위치' : 'Location'} value={project.location} />
                <SpecItem label={language === 'ko' ? '용도구역' : 'Zoning'} value={project.zoning} />
                <SpecItem label={language === 'ko' ? '규모' : 'Scale'} value={project.scale} />
                <SpecItem label={language === 'ko' ? '대지면적' : 'Land Area'} value={formatArea(project.land_area)} />
                <SpecItem label={language === 'ko' ? '건축면적' : 'Building Area'} value={formatArea(project.building_area)} />
                <SpecItem label={language === 'ko' ? '연면적' : 'Total Floor Area'} value={formatArea(project.total_floor_area)} />
                <SpecItem label={language === 'ko' ? '용적률' : 'FAR'} value={project.far ? `${project.far}%` : null} />
                <SpecItem label={language === 'ko' ? '건폐율' : 'BCR'} value={project.bcr ? `${project.bcr}%` : null} />
                <SpecItem label={language === 'ko' ? '연도' : 'Year'} value={project.year} />
                <SpecItem label={language === 'ko' ? '역할' : 'Role'} value={project.role} />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8 space-y-12 md:space-y-16"
          >
            {project.image && (
              <figure className="relative rounded-3xl overflow-hidden shadow-md group">
                <img 
                  src={project.image} 
                  alt={`${project.title} 대표 이미지`} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 pt-12 text-white/90 text-sm font-medium">
                  {project.title} - Overview
                </figcaption>
              </figure>
            )}

            {project.description && (
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 tracking-tight">{language === 'ko' ? '프로젝트 개요' : 'Project Overview'}</h2>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            )}
            
            {(project.challenge || project.solution) && (
              <div className="grid md:grid-cols-2 gap-6 mt-10 md:mt-12">
                {project.challenge && (
                  <div className="bg-gray-50 p-8 md:p-10 rounded-2xl md:rounded-3xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                      <Target className="text-indigo-600" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{language === 'ko' ? '도전 과제' : 'Challenge'}</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {project.challenge}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div className="bg-gray-900 p-8 md:p-10 rounded-2xl md:rounded-3xl text-white shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                      <Lightbulb className="text-yellow-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{language === 'ko' ? '해결 방안' : 'Solution'}</h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="py-16 md:py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Project Gallery</h2>
              <div className="w-12 h-1 bg-indigo-600 mt-4 rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {project.gallery.map((img, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`rounded-2xl overflow-hidden shadow-sm group ${idx % 3 === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-[4/3]'}`}
                >
                  <img 
                    src={img} 
                    alt={`${project.title} gallery ${idx + 1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Project Navigation */}
      {allProjects.length > 1 && prevProject && nextProject && (
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
            <Link 
              to={`/projects/${generateSlug(prevProject.title)}`}
              className="flex-1 p-8 md:p-16 flex flex-col items-start hover:bg-gray-50 transition-colors border-b md:border-b-0 md:border-r border-gray-200 group"
            >
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                {language === 'ko' ? '이전 프로젝트' : 'Previous Project'}
              </span>
              <span className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                {prevProject.title}
              </span>
            </Link>
            
            <Link 
              to={`/projects/${generateSlug(nextProject.title)}`}
              className="flex-1 p-8 md:p-16 flex flex-col items-end text-right hover:bg-gray-50 transition-colors group"
            >
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                {language === 'ko' ? '다음 프로젝트' : 'Next Project'}
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                {nextProject.title}
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Share Section */}
      <div className="py-12 bg-white border-t border-gray-100 text-center">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert(language === 'ko' ? '링크가 복사되었습니다.' : 'Link copied to clipboard.');
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors text-sm font-bold"
        >
          <Share2 size={18} />
          {language === 'ko' ? '프로젝트 공유하기' : 'Share Project'}
        </button>
      </div>

      <ContactCTA />
      <Footer />
    </div>
  );
}

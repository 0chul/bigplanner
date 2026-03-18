import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Target, Lightbulb, Building2, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactCTA from '../components/ContactCTA';
import { supabase } from '../supabase';
import { Project } from './Projects';

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
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectAndAll = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch current project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        
        if (projectError) {
          console.error("Error fetching project:", projectError);
          setProject(null);
        } else {
          setProject(projectData as Project);
        }

        // Fetch all projects for navigation
        const { data: allProjectsData, error: allProjectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (allProjectsError) {
          console.error("Error fetching all projects:", allProjectsError);
        } else {
          setAllProjects(allProjectsData as Project[]);
        }

      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndAll();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-sans text-gray-900">
        <div className="text-xl text-gray-500">프로젝트 정보를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans text-gray-900">
        <h1 className="text-4xl font-bold mb-4">프로젝트를 찾을 수 없습니다.</h1>
        <Link to="/projects" className="text-blue-600 hover:underline">
          프로젝트 목록으로 돌아가기
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
    return `${m2} ㎡ (${pyeong} 평)`;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Helmet>
        <title>{project.title} | 빅플래너파트너스</title>
        <meta name="description" content={project.description?.substring(0, 150) || `${project.title} 프로젝트 상세 페이지입니다.`} />
        <meta name="keywords" content={`빅플래너파트너스, ${project.title}, ${project.category}, 건축, 부동산개발`} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              "name": "${project.title}",
              "description": "${project.description?.substring(0, 150) || ''}"
            }
          `}
        </script>
      </Helmet>
      <Navbar />
      
      {/* Hero Image */}
      <div className="relative h-[70vh] md:h-[85vh] w-full">
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
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                {project.title}
              </h1>
              {project.location && (
                <p className="text-lg md:text-xl text-white/80 font-light flex items-center gap-2">
                  <MapPin size={20} />
                  {project.location}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
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
                <SpecItem label="클라이언트" value={project.client} />
                <SpecItem label="위치" value={project.location} />
                <SpecItem label="용도구역" value={project.zoning} />
                <SpecItem label="규모" value={project.scale} />
                <SpecItem label="대지면적" value={formatArea(project.land_area)} />
                <SpecItem label="건축면적" value={formatArea(project.building_area)} />
                <SpecItem label="연면적" value={formatArea(project.total_floor_area)} />
                <SpecItem label="용적률" value={project.far ? `${project.far}%` : null} />
                <SpecItem label="건폐율" value={project.bcr ? `${project.bcr}%` : null} />
                <SpecItem label="연도" value={project.year} />
                <SpecItem label="역할" value={project.role} />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8 space-y-16"
          >
            {project.image && (
              <figure className="relative rounded-3xl overflow-hidden shadow-md group">
                <img 
                  src={project.image} 
                  alt={`${project.title} 대표 이미지`} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 pt-12 text-white/90 text-sm font-medium">
                  {project.title} - Overview
                </figcaption>
              </figure>
            )}

            {project.description && (
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">프로젝트 개요</h2>
                <p className="text-xl text-gray-600 leading-relaxed font-light whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            )}
            
            {(project.challenge || project.solution) && (
              <div className="grid md:grid-cols-2 gap-6 mt-12">
                {project.challenge && (
                  <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                      <Target className="text-indigo-600" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">도전 과제</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {project.challenge}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div className="bg-gray-900 p-10 rounded-3xl text-white shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                      <Lightbulb className="text-yellow-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">해결 방안</h3>
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
        <div className="py-24 bg-gray-50 border-t border-gray-100">
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
              to={`/projects/${prevProject.id}`}
              className="flex-1 p-8 md:p-16 flex flex-col items-start hover:bg-gray-50 transition-colors border-b md:border-b-0 md:border-r border-gray-200 group"
            >
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                이전 프로젝트
              </span>
              <span className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                {prevProject.title}
              </span>
            </Link>
            
            <Link 
              to={`/projects/${nextProject.id}`}
              className="flex-1 p-8 md:p-16 flex flex-col items-end text-right hover:bg-gray-50 transition-colors group"
            >
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                다음 프로젝트
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                {nextProject.title}
              </span>
            </Link>
          </div>
        </div>
      )}

      <ContactCTA />
      <Footer />
    </div>
  );
}

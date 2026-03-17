import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactCTA from '../components/ContactCTA';
import { supabase } from '../supabase';
import { Project } from './Projects';

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
      <div className="relative h-[60vh] md:h-[70vh] w-full mt-16">
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
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        
        <div className="absolute inset-0 flex items-end pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-white/80 font-bold tracking-widest uppercase text-sm mb-4 block">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
                {project.title}
              </h1>
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
            className="lg:col-span-4 space-y-8"
          >
            {project.client && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">클라이언트</h3>
                  <p className="text-lg font-medium text-gray-900">{project.client}</p>
                </div>
                <div className="w-full h-px bg-gray-200" />
              </>
            )}
            
            {project.location && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">위치</h3>
                  <p className="text-lg font-medium text-gray-900">{project.location}</p>
                </div>
                <div className="w-full h-px bg-gray-200" />
              </>
            )}

            {project.zoning && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">용도구역</h3>
                  <p className="text-lg font-medium text-gray-900">{project.zoning}</p>
                </div>
                <div className="w-full h-px bg-gray-200" />
              </>
            )}

            {project.scale && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">규모</h3>
                  <p className="text-lg font-medium text-gray-900">{project.scale}</p>
                </div>
                <div className="w-full h-px bg-gray-200" />
              </>
            )}

            {project.land_area && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">대지면적</h3>
                  <p className="text-lg font-medium text-gray-900">{formatArea(project.land_area)}</p>
                </div>
                <div className="w-full h-px bg-gray-200" />
              </>
            )}

            {project.building_area && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">건축면적</h3>
                  <p className="text-lg font-medium text-gray-900">{formatArea(project.building_area)}</p>
                </div>
                <div className="w-full h-px bg-gray-200" />
              </>
            )}

            {project.total_floor_area && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">연면적</h3>
                  <p className="text-lg font-medium text-gray-900">{formatArea(project.total_floor_area)}</p>
                </div>
                <div className="w-full h-px bg-gray-200" />
              </>
            )}

            {project.far && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">용적률</h3>
                  <p className="text-lg font-medium text-gray-900">{project.far}%</p>
                </div>
                <div className="w-full h-px bg-gray-200" />
              </>
            )}

            {project.bcr && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">건폐율</h3>
                  <p className="text-lg font-medium text-gray-900">{project.bcr}%</p>
                </div>
                <div className="w-full h-px bg-gray-200" />
              </>
            )}
            
            {project.year && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">연도</h3>
                  <p className="text-lg font-medium text-gray-900">{project.year}</p>
                </div>
                <div className="w-full h-px bg-gray-200" />
              </>
            )}
            
            {project.role && (
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">역할</h3>
                <p className="text-lg font-medium text-gray-900">{project.role}</p>
              </div>
            )}
          </motion.div>

          {/* Right Column: Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8 space-y-12"
          >
            {project.description && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">프로젝트 개요</h2>
                <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            )}
            
            {(project.challenge || project.solution) && (
              <div className="grid md:grid-cols-2 gap-8">
                {project.challenge && (
                  <div className="bg-gray-50 p-8 rounded-2xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">도전 과제</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {project.challenge}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div className="bg-gray-900 p-8 rounded-2xl text-white">
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
        <div className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.gallery.map((img, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-2xl overflow-hidden aspect-[4/3]"
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

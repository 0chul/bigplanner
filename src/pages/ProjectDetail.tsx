import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactCTA from '../components/ContactCTA';
import { supabase } from '../supabase';

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  location?: string;
  client?: string;
  role?: string;
  image: string;
  gallery?: string[];
  description?: string;
  challenge?: string;
  solution?: string;
}

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
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Link to="/projects" className="text-blue-600 hover:underline">
          Return to Projects
        </Link>
      </div>
    );
  }

  const projectIndex = allProjects.findIndex(p => p.id === id);
  const nextProject = allProjects.length > 1 ? allProjects[(projectIndex + 1) % allProjects.length] : null;
  const prevProject = allProjects.length > 1 ? allProjects[(projectIndex - 1 + allProjects.length) % allProjects.length] : null;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
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
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Client</h3>
                  <p className="text-lg font-medium text-gray-900">{project.client}</p>
                </div>
                <div className="w-full h-px bg-gray-200" />
              </>
            )}
            
            {project.location && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Location</h3>
                  <p className="text-lg font-medium text-gray-900">{project.location}</p>
                </div>
                <div className="w-full h-px bg-gray-200" />
              </>
            )}
            
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Year</h3>
              <p className="text-lg font-medium text-gray-900">{project.year}</p>
            </div>
            <div className="w-full h-px bg-gray-200" />
            
            {project.role && (
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Role</h3>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
                <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            )}
            
            {(project.challenge || project.solution) && (
              <div className="grid md:grid-cols-2 gap-8">
                {project.challenge && (
                  <div className="bg-gray-50 p-8 rounded-2xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">The Challenge</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {project.challenge}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div className="bg-gray-900 p-8 rounded-2xl text-white">
                    <h3 className="text-xl font-bold mb-4">Our Solution</h3>
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
                Previous Project
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
                Next Project
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

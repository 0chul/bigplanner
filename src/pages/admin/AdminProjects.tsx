import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';
import { Plus, Edit2, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';

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
  created_at: any;
}

export default function AdminProjects() {
  const { isAdmin, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // File Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '', category: 'Commercial', year: new Date().getFullYear().toString(),
    location: '', client: '', role: '', image: '', gallery: '',
    description: '', challenge: '', solution: ''
  });

  useEffect(() => {
    if (!isAdmin) return;

    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data as Project[]);
      }
      setFetching(false);
    };

    fetchProjects();

    // Set up real-time subscription
    const channel = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        category: project.category,
        year: project.year,
        location: project.location || '',
        client: project.client || '',
        role: project.role || '',
        image: project.image,
        gallery: project.gallery?.join('\n') || '',
        description: project.description || '',
        challenge: project.challenge || '',
        solution: project.solution || ''
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '', category: 'Commercial', year: new Date().getFullYear().toString(),
        location: '', client: '', role: '', image: '', gallery: '',
        description: '', challenge: '', solution: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `main/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('projects')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('projects').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, image: data.publicUrl }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    setUploadingGallery(true);
    const newUrls: string[] = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('projects')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('projects').getPublicUrl(filePath);
        newUrls.push(data.publicUrl);
      }
      
      setFormData(prev => {
        const currentGallery = prev.gallery ? prev.gallery.split('\n').filter(url => url.trim() !== '') : [];
        return {
          ...prev,
          gallery: [...currentGallery, ...newUrls].join('\n')
        };
      });
    } catch (error) {
      console.error("Gallery upload error:", error);
      alert("갤러리 이미지 업로드에 실패했습니다.");
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const projectData = {
      title: formData.title,
      category: formData.category,
      year: formData.year,
      location: formData.location,
      client: formData.client,
      role: formData.role,
      image: formData.image,
      gallery: formData.gallery.split('\n').filter(url => url.trim() !== ''),
      description: formData.description,
      challenge: formData.challenge,
      solution: formData.solution,
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        if (error) throw error;
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("저장에 실패했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  if (loading || fetching) return <div className="p-8">Loading...</div>;
  if (!isAdmin) return <div className="p-8">접근 권한이 없습니다.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">포트폴리오 관리</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
        >
          <Plus size={20} /> 새 프로젝트 추가
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
            <div className="h-48 overflow-hidden relative">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={() => handleOpenModal(project)} className="p-2 bg-white/90 rounded-full shadow hover:bg-white text-gray-700">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(project.id)} className="p-2 bg-white/90 rounded-full shadow hover:bg-white text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{project.category}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{project.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{project.description || '설명 없음'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold">{editingProject ? '프로젝트 수정' : '새 프로젝트 추가'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">프로젝트명 *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 *</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black">
                    <option value="Commercial">Commercial (상업시설)</option>
                    <option value="Residential">Residential (주거시설)</option>
                    <option value="Office">Office (업무시설)</option>
                    <option value="Culture">Culture (문화시설)</option>
                    <option value="Interior">Interior (인테리어)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">연도 *</label>
                  <input required type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">위치</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">클라이언트</label>
                  <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">역할 (Role)</label>
                  <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">메인 이미지 *</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black mb-2" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={mainImageInputRef}
                      onChange={handleMainImageUpload}
                    />
                    <button 
                      type="button"
                      onClick={() => mainImageInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                    >
                      {uploadingImage ? '업로드 중...' : <><Upload size={16} /> 파일 업로드</>}
                    </button>
                  </div>
                  {formData.image && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">갤러리 이미지 (선택)</label>
                <div className="space-y-2">
                  <textarea value={formData.gallery} onChange={e => setFormData({...formData, gallery: e.target.value})} rows={3} placeholder="https://...&#10;https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    className="hidden" 
                    ref={galleryInputRef}
                    onChange={handleGalleryUpload}
                  />
                  <button 
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={uploadingGallery}
                    className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                  >
                    {uploadingGallery ? '업로드 중...' : <><ImageIcon size={16} /> 여러 파일 업로드</>}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">프로젝트 개요</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">문제점 (Challenge)</label>
                  <textarea value={formData.challenge} onChange={e => setFormData({...formData, challenge: e.target.value})} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">해결책 (Solution)</label>
                  <textarea value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black" />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">취소</button>
                <button type="submit" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800">저장하기</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

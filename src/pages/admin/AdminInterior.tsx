import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';
import { Plus, Edit2, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Project } from '../Projects';

export default function AdminInterior() {
  const { isAdmin, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '', category: '인테리어', subcategory: '', year: new Date().getFullYear().toString(),
    location: '', client: '', role: '', image: '', gallery: '',
    description: '', challenge: '', solution: '',
    zoning: '', land_area: '', building_area: '', total_floor_area: '',
    scale: '', far: '', bcr: '', notes: ''
  });

  useEffect(() => {
    if (!isAdmin) return;

    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('category', '인테리어')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching interior projects:", error);
      } else {
        setProjects(data as Project[]);
      }
      setFetching(false);
    };

    fetchProjects();

    const channel = supabase
      .channel('interior_projects_changes')
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
        category: '인테리어',
        subcategory: project.subcategory || '',
        year: project.year || '',
        location: project.location || '',
        client: project.client || '',
        role: project.role || '',
        image: project.image || '',
        gallery: project.gallery?.join('\n') || '',
        description: project.description || '',
        challenge: project.challenge || '',
        solution: project.solution || '',
        zoning: project.zoning || '',
        land_area: project.land_area || '',
        building_area: project.building_area || '',
        total_floor_area: project.total_floor_area || '',
        scale: project.scale || '',
        far: project.far || '',
        bcr: project.bcr || '',
        notes: project.notes || ''
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '', category: '인테리어', subcategory: '', year: new Date().getFullYear().toString(),
        location: '', client: '', role: '', image: '', gallery: '',
        description: '', challenge: '', solution: '',
        zoning: '', land_area: '', building_area: '', total_floor_area: '',
        scale: '', far: '', bcr: '', notes: ''
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
        .upload(filePath, file, { cacheControl: '31536000', upsert: false });

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
          .upload(filePath, file, { cacheControl: '31536000', upsert: false });

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
      category: '인테리어',
      subcategory: formData.subcategory,
      year: formData.year,
      location: formData.location,
      client: formData.client,
      role: formData.role,
      image: formData.image,
      gallery: formData.gallery.split('\n').filter(url => url.trim() !== ''),
      description: formData.description,
      challenge: formData.challenge,
      solution: formData.solution,
      zoning: formData.zoning,
      land_area: formData.land_area,
      building_area: formData.building_area,
      total_floor_area: formData.total_floor_area,
      scale: formData.scale,
      far: formData.far,
      bcr: formData.bcr,
      notes: formData.notes
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

  if (loading || fetching) return <div className="p-4 md:p-8">Loading...</div>;
  if (!isAdmin) return <div className="p-4 md:p-8">접근 권한이 없습니다.</div>;

  return (
    <div className="p-4 md:p-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">인테리어 포트폴리오 관리</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 w-full sm:w-auto justify-center"
        >
          <Plus size={20} /> 새 인테리어 프로젝트 추가
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
              <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{project.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{project.description || '설명 없음'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-2xl font-bold">{editingProject ? '프로젝트 수정' : '새 프로젝트 추가'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">프로젝트명 *</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">연도 *</label>
                  <input required type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black" />
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

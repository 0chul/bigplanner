import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';
import { Plus, Edit2, Trash2, X, Upload, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { Project } from '../Projects';

interface GalleryItem {
  id: string;
  imgUrl: string;
  subtitle: string;
  text: string;
}

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

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [uploadingItemIds, setUploadingItemIds] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    title: '', category: '인테리어', subcategory: '', year: new Date().getFullYear().toString(),
    location: '', client: '', role: '', image: '', gallery: '',
    description: '', challenge: '', solution: '',
    zoning: '', land_area: '', building_area: '', total_floor_area: '',
    scale: '', far: '', bcr: '', notes: ''
  });

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

  useEffect(() => {
    if (!isAdmin) return;

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

  const parseGalleryToItems = (galleryArray: string[] | undefined): GalleryItem[] => {
    if (!galleryArray) return [];
    return galleryArray.map((item, idx) => {
      const parts = item.split('|').map(s => s.trim());
      return {
        id: `${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
        imgUrl: parts[0] || '',
        subtitle: parts.length > 1 ? parts[1] : '',
        text: parts.length > 2 ? parts[2] : ''
      };
    });
  };

  const serializeItemsToGallery = (items: GalleryItem[]): string[] => {
    return items
      .map(item => {
        if (!item.subtitle && !item.text) {
          return item.imgUrl;
        }
        const parts = [item.imgUrl, item.subtitle || '', item.text || ''];
        while (parts.length > 1 && parts[parts.length - 1] === '') {
          parts.pop();
        }
        return parts.join(' | ');
      })
      .filter(str => str.trim() !== '');
  };

  const moveGalleryItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === galleryItems.length - 1) return;

    const newItems = [...galleryItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    
    setGalleryItems(newItems);
  };

  const addGalleryItem = () => {
    const newItem: GalleryItem = {
      id: `${Date.now()}_${Math.random().toString(36).substring(7)}`,
      imgUrl: '',
      subtitle: '',
      text: ''
    };
    setGalleryItems([...galleryItems, newItem]);
  };

  const removeGalleryItem = (id: string) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
  };

  const updateGalleryItem = (id: string, updates: Partial<Omit<GalleryItem, 'id'>>) => {
    setGalleryItems(galleryItems.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const handleSingleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingItemIds(prev => ({ ...prev, [id]: true }));
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('projects')
        .upload(filePath, file, { cacheControl: '31536000', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('projects').getPublicUrl(filePath);
      
      updateGalleryItem(id, { imgUrl: data.publicUrl });
    } catch (error) {
      console.error("Single gallery upload error:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploadingItemIds(prev => ({ ...prev, [id]: false }));
    }
  };

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
        gallery: '',
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
      setGalleryItems(parseGalleryToItems(project.gallery));
    } else {
      setEditingProject(null);
      setFormData({
        title: '', category: '인테리어', subcategory: '', year: new Date().getFullYear().toString(),
        location: '', client: '', role: '', image: '', gallery: '',
        description: '', challenge: '', solution: '',
        zoning: '', land_area: '', building_area: '', total_floor_area: '',
        scale: '', far: '', bcr: '', notes: ''
      });
      setGalleryItems([]);
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
    const newItems: GalleryItem[] = [];

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
        newItems.push({
          id: `${Date.now()}_${Math.random().toString(36).substring(7)}`,
          imgUrl: data.publicUrl,
          subtitle: '',
          text: ''
        });
      }
      
      setGalleryItems(prev => [...prev, ...newItems]);
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
    
    const serializedGallery = serializeItemsToGallery(galleryItems);
    
    const projectData = {
      title: formData.title,
      category: '인테리어',
      subcategory: formData.subcategory,
      year: formData.year,
      location: formData.location,
      client: formData.client,
      role: formData.role,
      image: formData.image,
      gallery: serializedGallery,
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
      await fetchProjects();
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
        await fetchProjects();
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
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-800">갤러리 디테일 블록 (매거진 형식)</label>
                    <p className="text-xs text-gray-500">각 블록에 사진, 소제목, 상세 내용을 입력하여 매거진 스타일로 배치할 수 있습니다.</p>
                  </div>
                  <div className="flex gap-2">
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
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors border border-gray-200"
                    >
                      {uploadingGallery ? '업로드 중...' : <><ImageIcon size={14} /> 일괄 업로드</>}
                    </button>
                    <button 
                      type="button"
                      onClick={addGalleryItem}
                      className="flex items-center gap-1.5 text-xs font-semibold text-white bg-black hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus size={14} /> 블록 추가
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-[480px] overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-200">
                  {galleryItems.length === 0 ? (
                    <div className="text-center py-10 rounded-lg">
                      <ImageIcon className="mx-auto text-gray-300 mb-2" size={32} />
                      <p className="text-xs text-gray-500 font-medium">추가된 디테일 블록이 없습니다.</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">상단의 '블록 추가' 또는 '일괄 업로드' 버튼을 이용해 보세요.</p>
                    </div>
                  ) : (
                    galleryItems.map((item, idx) => (
                      <div key={item.id} className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow transition-shadow relative">
                        <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-gray-100">
                          <span className="text-xs font-bold text-gray-400"># {idx + 1}번 블록</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveGalleryItem(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                              title="위로 이동"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveGalleryItem(idx, 'down')}
                              disabled={idx === galleryItems.length - 1}
                              className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                              title="아래로 이동"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeGalleryItem(item.id)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded ml-1"
                              title="블록 삭제"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                          {/* Image field */}
                          <div className="md:col-span-4 space-y-2">
                            <div className="aspect-[4/3] bg-gray-50 rounded border border-gray-200 relative flex items-center justify-center overflow-hidden">
                              {item.imgUrl ? (
                                <>
                                  <img src={item.imgUrl} alt={`Block ${idx + 1}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => updateGalleryItem(item.id, { imgUrl: '' })}
                                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                                  >
                                    <X size={10} />
                                  </button>
                                </>
                              ) : (
                                <div className="text-center p-2">
                                  <ImageIcon className="mx-auto text-gray-300 mb-0.5" size={20} />
                                  <span className="text-[10px] text-gray-400 block">사진 없음</span>
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                id={`file-upload-${item.id}`}
                                onChange={(e) => handleSingleImageUpload(item.id, e)}
                              />
                              <label
                                htmlFor={`file-upload-${item.id}`}
                                className="w-full text-center cursor-pointer text-[10px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 py-1 px-2 rounded block transition-colors border border-gray-200"
                              >
                                {uploadingItemIds[item.id] ? '업로드 중...' : '이미지 업로드'}
                              </label>
                            </div>
                          </div>

                          {/* Text/Subtitle fields */}
                          <div className="md:col-span-8 space-y-2">
                            <div>
                              <input
                                type="text"
                                value={item.imgUrl}
                                onChange={e => updateGalleryItem(item.id, { imgUrl: e.target.value })}
                                placeholder="이미지 URL (직접 입력 또는 업로드)"
                                className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-black outline-none"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                value={item.subtitle}
                                onChange={e => updateGalleryItem(item.id, { subtitle: e.target.value })}
                                placeholder="소제목 (예: 침실의 아늑함, 조명 포인트)"
                                className="w-full text-xs font-semibold px-2.5 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-black outline-none"
                              />
                            </div>
                            <div>
                              <textarea
                                value={item.text}
                                onChange={e => updateGalleryItem(item.id, { text: e.target.value })}
                                placeholder="상세 내용을 설명해 주세요."
                                rows={2}
                                className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-black outline-none resize-y"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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

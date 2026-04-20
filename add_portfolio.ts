import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://injrbniytgtubemniaps.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluanJibml5dGd0dWJlbW5pYXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MzA3NDcsImV4cCI6MjA4OTIwNjc0N30.h3njZ7cRvJblL_MIZJ5qJRD45zjzsdWpPiV-90tDxmg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addProject() {
  const projectData = {
    title: '곳곳에서 사랑스러움이 묻어나는 군포 아파트 인테리어',
    category: '인테리어',
    subcategory: '아파트',
    year: '2019',
    location: '군포',
    client: '',
    role: '인테리어 디자인 및 시공',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop',
    gallery: [],
    description: '상세 내용은 네이버 블로그를 참고해주세요.\n링크: https://blog.naver.com/ndegree/221652804493',
    notes: 'https://blog.naver.com/ndegree/221652804493'
  };

  const { data, error } = await supabase
    .from('projects')
    .insert([projectData]);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}

addProject();

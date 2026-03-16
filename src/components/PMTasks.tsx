import { motion } from 'motion/react';

export default function PMTasks() {
  const tasks = [
    { title: "사업기획", desc: "토지검토, 법규검토, 건축검토, 시장분석, 임차기획, 금융기획" },
    { title: "사업계획", desc: "사업일정수립, 건축규모검토, 공사비예측, 대출검토" },
    { title: "건축설계", desc: "건축사 선정, 기획설계(건축개요, 평/입/단면도,투시도), 실시설계(일정, 공사비, 시공성)" },
    { title: "건축시공", desc: "적산/견적, 시공사 선정(견적비교, 공사비확정, 계약), 공사(대금관리, 사용승인 등)" },
    { title: "건물분양", desc: "분양홍보, 분양대행사운영, 모델하우스운영" },
    { title: "임차MD", desc: "근린생활시설(상가) 임차대행" },
    { title: "사업청산", desc: "시행수익확정, 시행법인청산(법무, 세무, 회계)" },
  ];

  return (
    <div className="py-16 bg-gray-50 rounded-3xl my-12">
      <div className="max-w-4xl mx-auto px-8">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">PM 업무 내용</h3>
        <div className="space-y-8">
          {tasks.map((task, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8"
            >
              <div className="w-full md:w-48 bg-gray-900 text-white py-4 px-6 rounded-2xl text-center font-bold flex-shrink-0 shadow-md">
                {task.title}
              </div>
              <div className="flex-1 text-gray-800 text-base md:text-lg leading-relaxed font-medium">
                {task.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

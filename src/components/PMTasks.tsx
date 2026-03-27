import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function PMTasks() {
  const { language } = useLanguage();

  const tasks = language === 'ko' ? [
    { title: "사업기획", desc: "토지검토, 법규검토, 건축검토, 시장분석, 임차기획, 금융기획" },
    { title: "사업계획", desc: "사업일정수립, 건축규모검토, 공사비예측, 대출검토" },
    { title: "건축설계", desc: "건축사 선정, 기획설계(건축개요, 평/입/단면도,투시도), 실시설계(일정, 공사비, 시공성)" },
    { title: "건축시공", desc: "적산/견적, 시공사 선정(견적비교, 공사비확정, 계약), 공사(대금관리, 사용승인 등)" },
    { title: "건물분양", desc: "분양홍보, 분양대행사운영, 모델하우스운영" },
    { title: "임차MD", desc: "근린생활시설(상가) 임차대행" },
    { title: "사업청산", desc: "시행수익확정, 시행법인청산(법무, 세무, 회계)" },
  ] : [
    { title: "Business Planning", desc: "Land review, legal review, architectural review, market analysis, lease planning, financial planning" },
    { title: "Business Plan", desc: "Establish business schedule, review building scale, estimate construction cost, review loan" },
    { title: "Architectural Design", desc: "Select architect, schematic design (architectural overview, plan/elevation/section, perspective), construction document (schedule, construction cost, constructability)" },
    { title: "Construction", desc: "Estimation/quote, select contractor (quote comparison, confirm construction cost, contract), construction (payment management, approval for use, etc.)" },
    { title: "Building Sales", desc: "Sales promotion, operate sales agency, operate model house" },
    { title: "Lease MD", desc: "Neighborhood living facility (commercial) lease agency" },
    { title: "Business Liquidation", desc: "Confirm implementation profit, liquidate implementation corporation (legal, tax, accounting)" },
  ];

  return (
    <div className="py-10 md:py-16 bg-gray-50 rounded-2xl md:rounded-3xl my-8 md:my-12">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10 md:mb-12">{language === 'ko' ? 'PM 업무 내용' : 'PM Task Details'}</h3>
        <div className="space-y-4 md:space-y-8">
          {tasks.map((task, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white md:bg-transparent rounded-2xl md:rounded-none p-5 md:p-0 shadow-sm md:shadow-none border border-gray-100 md:border-none flex flex-col md:flex-row md:items-center gap-3 md:gap-8 relative overflow-hidden group"
            >
              {/* Mobile background step number */}
              <div className="absolute -right-4 -top-4 text-8xl font-black text-gray-100 select-none md:hidden pointer-events-none transition-transform group-hover:scale-110">
                {idx + 1}
              </div>
              
              <div className="w-fit md:w-48 bg-gray-900 text-white py-2 px-4 md:py-4 md:px-6 rounded-lg md:rounded-2xl text-center font-bold flex-shrink-0 shadow-sm relative z-10 flex items-center gap-2">
                <span className="md:hidden text-gray-400 text-xs font-normal">STEP {idx + 1}</span>
                <span>{task.title}</span>
              </div>
              
              <div className="flex-1 text-gray-600 md:text-gray-800 text-sm md:text-lg leading-relaxed font-medium break-keep relative z-10 mt-2 md:mt-0 pl-1 md:pl-0">
                {task.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

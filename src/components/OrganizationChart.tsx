import { motion } from 'motion/react';

export default function OrganizationChart() {
  const teams = [
    { name: "사업운영 BU", sub: ["부동산금융팀", "PM사업 1팀", "PM사업 2팀"] },
    { name: "건축기획 BU", sub: ["디자인팀", "설계1팀", "설계2팀"] },
    { name: "앱 개발운영 BU", sub: ["앱 개발팀", "앱 운영팀"] },
    { name: "CoBIZ BU", sub: ["부동산중개팀", "건축시공팀", "행정대행팀"] },
    { name: "경영지원", sub: ["인사총무팀", "회계세무팀", "홍보마케팅팀"] },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">조직도</h2>
        
        {/* CEO */}
        <div className="flex justify-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="w-48 h-48 rounded-full bg-gray-900 text-white flex flex-col items-center justify-center shadow-xl border-8 border-gray-100"
          >
            <span className="text-sm font-medium opacity-80">CEO</span>
            <span className="text-xl font-bold">대표이사</span>
          </motion.div>
        </div>

        {/* Horizontal Line */}
        <div className="relative w-full h-px bg-gray-300 mb-8 hidden md:block">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full"></div>
        </div>

        {/* Teams */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {teams.map((team, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col"
            >
              <div className="bg-gray-900 text-white p-4 text-center font-bold mb-2 rounded-lg">
                {team.name}
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 flex-1">
                {team.sub.map((sub, sIdx) => (
                  <div key={sIdx} className="text-sm text-gray-600 text-center py-1 border-b border-gray-100 last:border-0">
                    {sub}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

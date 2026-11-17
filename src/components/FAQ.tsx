import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, X, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  faqCategories,
  propTechFaqs,
  type FAQCategory,
  type FAQItem,
} from '../data/faqData';

interface FAQProps {
  initialCategory?: FAQCategory;
  surface?: 'white' | 'gray';
}

export default function FAQ({ initialCategory = 'all', surface = 'gray' }: FAQProps) {
  const { language } = useLanguage();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const fetchFaqs = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/faqs', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal,
      });

      const contentType = response.headers.get('content-type') || '';

      if (response.ok && contentType.includes('application/json')) {
        const payload = await response.json();
        const items: FAQItem[] = Array.isArray(payload?.items) ? payload.items : [];
        const sorted = [...items].sort((a, b) => a.displayOrder - b.displayOrder);
        setFaqs(sorted);
        if (sorted.length > 0) {
          setOpenIds((prev) =>
            Object.keys(prev).length > 0 ? prev : { [sorted[0].id]: true }
          );
        }
      } else {
        // Static hosting fallback (e.g., GitHub Pages without Express API)
        const sorted = [...propTechFaqs].sort((a, b) => a.displayOrder - b.displayOrder);
        setFaqs(sorted);
        if (sorted.length > 0) {
          setOpenIds((prev) =>
            Object.keys(prev).length > 0 ? prev : { [sorted[0].id]: true }
          );
        }
      }
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      console.error('Failed to fetch FAQs from API:', err);
      // Graceful fallback when running offline/static, while keeping error handling explicit if empty
      const sorted = [...propTechFaqs].sort((a, b) => a.displayOrder - b.displayOrder);
      if (sorted.length > 0) {
        setFaqs(sorted);
        setOpenIds((prev) =>
          Object.keys(prev).length > 0 ? prev : { [sorted[0].id]: true }
        );
      } else {
        setError(
          language === 'ko'
            ? '자주 묻는 질문을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
            : 'Unable to load FAQs right now. Please try again.'
        );
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [language]);

  useEffect(() => {
    const controller = new AbortController();
    fetchFaqs(controller.signal);
    return () => controller.abort();
  }, [fetchFaqs, retryCount]);

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return faqs.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;

      const question = (language === 'ko' ? item.questionKo : item.questionEn).toLowerCase();
      const answer = (language === 'ko' ? item.answerKo : item.answerEn).toLowerCase();
      const takeaway = (language === 'ko' ? item.keyTakeawayKo : item.keyTakeawayEn).toLowerCase();
      const categoryLabel = (language === 'ko' ? item.categoryLabelKo : item.categoryLabelEn).toLowerCase();

      return (
        question.includes(query) ||
        answer.includes(query) ||
        takeaway.includes(query) ||
        categoryLabel.includes(query)
      );
    });
  }, [faqs, selectedCategory, searchQuery, language]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allVisibleExpanded =
    filteredFaqs.length > 0 && filteredFaqs.every((item) => Boolean(openIds[item.id]));

  const handleToggleAll = () => {
    if (allVisibleExpanded) {
      const next: Record<string, boolean> = { ...openIds };
      filteredFaqs.forEach((item) => {
        next[item.id] = false;
      });
      setOpenIds(next);
    } else {
      const next: Record<string, boolean> = { ...openIds };
      filteredFaqs.forEach((item) => {
        next[item.id] = true;
      });
      setOpenIds(next);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const faqSchema = useMemo(() => {
    if (faqs.length === 0) return null;
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: language === 'ko' ? item.questionKo : item.questionEn,
        acceptedAnswer: {
          '@type': 'Answer',
          text: language === 'ko' ? item.answerKo : item.answerEn,
        },
      })),
    });
  }, [faqs, language]);

  const sectionBg = surface === 'white' ? 'bg-white' : 'bg-gray-50';

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className={`py-16 md:py-24 border-t border-gray-200 ${sectionBg}`}
    >
      {faqSchema && (
        <Helmet>
          <script type="application/ld+json">{faqSchema}</script>
        </Helmet>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Editorial Heading & Context */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase mb-3">
                Frequently Asked Questions
              </p>
              <h2
                id="faq-heading"
                className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight text-balance"
              >
                {language === 'ko'
                  ? '프롭테크 서비스, 무엇이든 확인하세요'
                  : 'Clear Answers on Our Prop-Tech Services'}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                {language === 'ko'
                  ? '타당성 분석(BIG Consulting)부터 실시간 현장 감리(BIG Management), 에스크로 안전계약(BIG Credit) 및 비용 구조까지 고객이 가장 자주 묻는 핵심 질문을 투명하게 공개합니다.'
                  : 'Explore transparent answers covering feasibility consulting, real-time PM oversight, escrow safety contracts, and fee structures.'}
              </p>
            </div>

            {/* Quiet Unboxed Metadata */}
            <div className="pt-4 border-t border-gray-200 flex items-center gap-2 text-xs font-medium text-gray-500 tabular-nums">
              <span>
                {language === 'ko'
                  ? `총 ${faqs.length}개 핵심 질문`
                  : `${faqs.length} Key Questions`}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {language === 'ko' ? '실시간 데이터 연동' : 'Live Service Guide'}
              </span>
            </div>

            {/* Direct Consultation Link */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
              <h3 className="text-base font-bold text-gray-900">
                {language === 'ko'
                  ? '프로젝트 맞춤 검토가 필요하신가요?'
                  : 'Need a Project-Specific Assessment?'}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {language === 'ko'
                  ? '대상지 지번과 사업 목표를 남겨주시면 전담 PM이 1영업일 이내에 직접 안내해 드립니다.'
                  : 'Share your site address and goals, and a dedicated PM will respond within 1 business day.'}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <span>
                  {language === 'ko' ? '전담 PM 상담 신청' : 'Consult With a PM'}
                </span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Column: Search, Category Filters & Accordion */}
          <div className="lg:col-span-8 space-y-6">
            {/* Filter & Search Toolbar */}
            <div className="space-y-4">
              {/* Search Box */}
              <div className="relative">
                <label htmlFor="faq-search-input" className="sr-only">
                  {language === 'ko' ? '자주 묻는 질문 검색' : 'Search FAQs'}
                </label>
                <Search
                  size={18}
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  id="faq-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'ko'
                      ? '키워드로 검색하세요 (예: 에스크로, 감리 앱, 타당성 분석, 수수료)'
                      : 'Search by keyword (e.g., escrow, app, feasibility, fees)'
                  }
                  className="w-full min-h-[48px] pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label={language === 'ko' ? '검색어 지우기' : 'Clear search'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Segmented Category Filter + Expand/Collapse Control */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div
                  role="tablist"
                  aria-label={language === 'ko' ? 'FAQ 카테고리 필터' : 'FAQ category filter'}
                  className="flex items-center gap-1 p-1 bg-gray-100 border border-gray-200 rounded-xl overflow-x-auto"
                >
                  {faqCategories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                          isActive
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {language === 'ko' ? cat.labelKo : cat.labelEn}
                      </button>
                    );
                  })}
                </div>

                {!loading && filteredFaqs.length > 0 && (
                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs sm:text-sm text-gray-600 shrink-0">
                    <span className="tabular-nums font-medium">
                      {language === 'ko'
                        ? `${filteredFaqs.length}개 표시`
                        : `${filteredFaqs.length} items`}
                    </span>
                    <button
                      type="button"
                      onClick={handleToggleAll}
                      className="px-3 py-2 min-h-[40px] rounded-lg text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      {allVisibleExpanded
                        ? language === 'ko'
                          ? '모두 접기'
                          : 'Collapse All'
                        : language === 'ko'
                        ? '모두 펼치기'
                        : 'Expand All'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div
                aria-busy="true"
                aria-label={language === 'ko' ? '질문 목록을 불러오는 중' : 'Loading FAQs'}
                className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-200 px-6"
              >
                {[1, 2, 3, 4].map((skeleton) => (
                  <div key={skeleton} className="py-6 space-y-3 animate-pulse">
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                    <div className="h-5 w-4/5 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center mx-auto">
                  <AlertCircle size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-gray-900">
                    {language === 'ko' ? '데이터를 불러올 수 없습니다' : 'Could Not Load FAQs'}
                  </p>
                  <p className="text-sm text-gray-600">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRetryCount((c) => c + 1)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap shrink-0"
                >
                  <RotateCcw size={15} />
                  <span>{language === 'ko' ? '다시 시도' : 'Retry'}</span>
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredFaqs.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-4">
                <div className="space-y-1.5">
                  <p className="text-base font-bold text-gray-900">
                    {language === 'ko'
                      ? '검색 조건과 일치하는 질문이 없습니다'
                      : 'No Matching Questions Found'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'ko'
                      ? '다른 키워드로 검색하거나 전체 카테고리를 선택해 보세요.'
                      : 'Try another keyword or reset the category filter.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
                >
                  <RotateCcw size={15} />
                  <span>{language === 'ko' ? '필터 초기화' : 'Reset Filters'}</span>
                </button>
              </div>
            )}

            {/* Accordion FAQ List */}
            {!loading && !error && filteredFaqs.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-200">
                {filteredFaqs.map((item, idx) => {
                  const isOpen = Boolean(openIds[item.id]);
                  const buttonId = `faq-trigger-${item.id}`;
                  const panelId = `faq-panel-${item.id}`;
                  const displayIndex = String(idx + 1).padStart(2, '0');
                  const categoryLabel =
                    language === 'ko' ? item.categoryLabelKo : item.categoryLabelEn;
                  const question =
                    language === 'ko' ? item.questionKo : item.questionEn;
                  const answer =
                    language === 'ko' ? item.answerKo : item.answerEn;
                  const takeaway =
                    language === 'ko' ? item.keyTakeawayKo : item.keyTakeawayEn;
                  const relatedLabel =
                    language === 'ko' ? item.relatedLabelKo : item.relatedLabelEn;

                  return (
                    <div key={item.id} className="px-6 sm:px-8">
                      <h3>
                        <button
                          id={buttonId}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => toggleItem(item.id)}
                          className="w-full py-6 min-h-[56px] text-left flex items-start justify-between gap-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-lg"
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 tabular-nums">
                              <span className="font-mono font-semibold text-gray-700">
                                {displayIndex}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="text-blue-600 font-semibold">
                                {categoryLabel}
                              </span>
                            </div>
                            <span className="block text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                              {question}
                            </span>
                          </div>

                          <span
                            aria-hidden="true"
                            className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                              isOpen
                                ? 'rotate-180 bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                            }`}
                          >
                            <ChevronDown size={18} />
                          </span>
                        </button>
                      </h3>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            className="pb-6 pt-1 space-y-4"
                          >
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                              {answer}
                            </p>

                            <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <p className="text-xs sm:text-sm text-gray-600">
                                <span className="font-bold text-gray-900 mr-1.5">
                                  {language === 'ko' ? '핵심 요약:' : 'Key Point:'}
                                </span>
                                {takeaway}
                              </p>

                              {item.relatedPath && relatedLabel && (
                                <Link
                                  to={item.relatedPath}
                                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap shrink-0"
                                >
                                  <span>{relatedLabel}</span>
                                  <ArrowRight size={14} aria-hidden="true" />
                                </Link>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

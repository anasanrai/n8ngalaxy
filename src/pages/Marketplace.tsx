import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchX } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TemplateCard from '../components/TemplateCard';
import { supabase } from '../lib/supabase';
import type { Template } from '../types';

const CATEGORIES = [
  'All',
  'Real Estate',
  'Sales',
  'Finance',
  'Marketing',
  'HR',
  'DevOps',
  'AI Agents',
];

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('published', true);
      
      if (error) throw error;
      return data as Template[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const filteredAndSortedTemplates = useMemo(() => {
    if (!templates) return [];

    // Filter
    let result = templates;
    if (activeCategory !== 'All') {
      const dbCategory = activeCategory.toLowerCase().replace(' ', '_');
      result = result.filter(t => t.category === dbCategory);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low':
          return a.price_cents - b.price_cents;
        case 'Price: High':
          return b.price_cents - a.price_cents;
        case 'Newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'Featured':
        default:
          if (a.featured === b.featured) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return a.featured ? -1 : 1;
      }
    });

    return result;
  }, [templates, activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-background pt-[144px] pb-12 px-6 text-center">
          <div className="max-w-[1200px] mx-auto">
            <span className="block font-sans font-medium text-[12px] text-primary tracking-[0.1em] uppercase mb-4">MARKETPLACE</span>
            <h1 className="font-display font-extrabold text-[48px] text-text-primary leading-tight mb-4">
              Browse n8n Templates
            </h1>
            <p className="font-sans font-normal text-[16px] text-text-secondary">
              Production-ready workflows. Download JSON, import, done.
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="sticky top-[64px] z-40 bg-background border-b border-border py-4 px-6 md:px-12">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Categories */}
            <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex-none h-[32px] px-[14px] rounded-pill font-sans font-medium text-[13px] border transition-colors whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-primary/15 border-primary/40 text-primary'
                      : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:border-text-secondary/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="w-full md:w-auto flex justify-end shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-[32px] pl-[12px] pr-[30px] rounded-input bg-surface border border-border text-text-secondary font-sans font-medium text-[13px] focus:outline-none focus:border-primary appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                }}
              >
                {['Featured', 'Price: Low', 'Price: High', 'Newest'].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Template Grid */}
        <section className="py-12 px-6">
          <div className="max-w-[1200px] mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[340px] rounded-card border border-border bg-surface overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-surface via-border to-surface w-[200%] animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }}></div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedTemplates.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <SearchX className="w-12 h-12 text-text-tertiary mb-6" />
                <h3 className="font-display font-bold text-[20px] text-text-secondary mb-2">No templates found</h3>
                <p className="font-sans font-normal text-[14px] text-text-tertiary">Try a different category</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

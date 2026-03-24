import { useNavigate } from 'react-router-dom';
import { GitBranch } from 'lucide-react';
import type { Template } from '../types';

export default function TemplateCard({ template }: { template: Template }) {
  const navigate = useNavigate();

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'real_estate': return 'bg-[rgba(0,229,199,0.1)] border-[rgba(0,229,199,0.3)] text-[#00E5C7]';
      case 'sales': return 'bg-[rgba(124,58,237,0.1)] border-[rgba(124,58,237,0.3)] text-[#7C3AED]';
      case 'finance': return 'bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)] text-[#F59E0B]';
      case 'marketing': return 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)] text-[#EF4444]';
      case 'hr': return 'bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.3)] text-[#10B981]';
      case 'devops': return 'bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.3)] text-[#3B82F6]';
      case 'ai_agents': return 'bg-[rgba(168,85,247,0.1)] border-[rgba(168,85,247,0.3)] text-[#A855F7]';
      default: return 'bg-surface border-border text-text-secondary';
    }
  };

  const formatCategory = (cat: string) => {
    return cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formattedPrice = template.price_cents === 0 
    ? 'Free' 
    : `$${(template.price_cents / 100).toLocaleString('en-US', { minimumFractionDigits: template.price_cents % 100 === 0 ? 0 : 2 })}`;

  const toolsToShow = template.tools.slice(0, 4);
  const extraToolsCount = template.tools.length - 4;

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (template.price_cents === 0) {
      // Free download logic placeholder (or navigate to detail anyway if simple)
      navigate(`/template/${template.slug}`);
    } else {
      navigate(`/template/${template.slug}`);
    }
  };

  return (
    <div 
      onClick={() => navigate(`/template/${template.slug}`)}
      className="bg-surface border border-border rounded-card flex flex-col h-full hover:border-[#7C3AED]/40 hover:shadow-[0_0_32px_rgba(124,58,237,0.08)] transition-all duration-200 ease-in-out cursor-pointer group overflow-hidden"
    >
      {/* Top section */}
      <div className="p-6 pb-0 flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center px-[10px] h-[24px] rounded-pill border font-sans font-medium text-[11px] uppercase tracking-wider ${getCategoryColor(template.category)}`}>
            {formatCategory(template.category)}
          </span>
          {template.featured && (
            <span className="inline-flex items-center px-[10px] h-[24px] rounded-pill border border-primary bg-primary text-white font-sans font-medium text-[11px] uppercase tracking-wider">
              FEATURED
            </span>
          )}
        </div>
        
        <h3 className="font-display font-bold text-[18px] text-text-primary mt-3 line-clamp-2">
          {template.title}
        </h3>
        
        <p className="font-sans font-normal text-[14px] text-text-secondary leading-[1.5] mt-2 line-clamp-3">
          {template.description}
        </p>
      </div>

      {/* Tools row */}
      <div className="px-6 py-4 flex flex-wrap gap-2">
        {toolsToShow.map(tool => (
          <span key={tool} className="inline-flex items-center px-2 py-[2px] rounded-[6px] border border-border bg-background font-sans font-medium text-[11px] text-text-tertiary">
            {tool}
          </span>
        ))}
        {extraToolsCount > 0 && (
          <span className="inline-flex items-center px-2 py-[2px] rounded-[6px] border border-border bg-background font-sans font-medium text-[11px] text-text-tertiary">
            +{extraToolsCount} more
          </span>
        )}
      </div>

      {/* Node count */}
      <div className="px-6 pb-4 flex items-center gap-1.5 text-text-tertiary">
        <GitBranch size={12} />
        <span className="font-sans font-normal text-[12px]">{template.node_count} nodes</span>
      </div>

      {/* Bottom section */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between mt-auto">
        <div className={`font-sans font-bold text-[20px] ${template.price_cents === 0 ? 'text-accent' : 'text-text-primary'}`}>
          {formattedPrice}
        </div>
        <button 
          onClick={handleAction}
          className="h-[36px] px-4 bg-primary hover:bg-primary-hover text-white font-sans font-medium text-[13px] rounded-input transition-colors flex items-center gap-1"
        >
          {template.price_cents === 0 ? 'Download Free' : 'Get Template'} <span className="translate-y-[0.5px]">→</span>
        </button>
      </div>
    </div>
  );
}

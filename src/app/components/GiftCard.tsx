import { ExternalLink, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface GiftCardProps {
  gift: {
    id: string;
    name: string;
    link?: string;
    priority: 'high' | 'medium' | 'low';
    note?: string;
    imageUrl?: string;
  };
  onDelete: (id: string) => void;
}

export function GiftCard({ gift, onDelete }: GiftCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const priorityConfig = {
    high: {
      label: 'High Priority',
      bg: 'bg-[#D97652]',
      text: 'text-white',
    },
    medium: {
      label: 'Someday',
      bg: 'bg-[#C9A76B]',
      text: 'text-white',
    },
    low: {
      label: 'Dreaming',
      bg: 'bg-[#9CAF88]',
      text: 'text-white',
    },
  };

  const config = priorityConfig[gift.priority] || priorityConfig.medium;

  const getPriceDisplay = (priority: string) => {
    // Just a visual indicator based on priority
    if (priority === 'high') return '$$$';
    if (priority === 'medium') return '$$';
    return '$';
  };

  return (
    <div className="group bg-white rounded-[1.25rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(217,118,82,0.15)] transition-all duration-300">
      {/* Image */}
      <div className="relative h-56 sm:h-64 overflow-hidden bg-[#EBE6DD]">
        {gift.imageUrl ? (
          <img
            src={gift.imageUrl}
            alt={gift.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#706B61]">
            <span className="text-sm">No image</span>
          </div>
        )}
        
        {/* Priority Badge */}
        <div className="absolute top-4 right-4">
          <span className={`${config.bg} ${config.text} px-3 py-1.5 rounded-full text-xs shadow-lg`}>
            {config.label}
          </span>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(gift.id)}
          className="absolute top-4 left-4 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
          aria-label="Delete gift"
        >
          <Trash2 className="w-4 h-4 text-[#D94E3D]" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <h3 className="text-xl mb-2 text-[#3D3328] line-clamp-2" style={{ fontFamily: "DarumadropOne, serif" }}>
          {gift.name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-[#706B61]">{getPriceDisplay(gift.priority)}</span>
        </div>

        {/* Link Button */}
        {gift.link && (
          <a
            href={gift.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#7C8B6E] hover:bg-[#6B7A5E] text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200 mb-3 shadow-sm"
          >
            View Link
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {/* Her Note Section */}
        {gift.note && (
          <div className="border-t border-[#EBE6DD] pt-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-left text-sm text-[#706B61] hover:text-[#3D3328] transition-colors"
            >
              <span>Her Note</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {isExpanded && (
              <p className="mt-3 text-sm text-[#3D3328] leading-relaxed italic">
                "{gift.note}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
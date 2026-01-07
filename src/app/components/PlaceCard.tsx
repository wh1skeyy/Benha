import { Heart, Trash2, MapPin } from 'lucide-react';

interface PlaceCardProps {
  place: {
    id: string;
    name: string;
    location: string;
    tags: string[];
    status: 'dreaming' | 'booked' | 'visited';
    note?: string;
    imageUrl?: string;
    mapLink?: string;
  };
  onDelete: (id: string) => void;
}

export function PlaceCard({ place, onDelete }: PlaceCardProps) {
  const statusConfig = {
    dreaming: {
      label: 'Dreaming of',
      color: 'text-[#C9A76B]',
      icon: '✨',
    },
    booked: {
      label: 'Booked',
      color: 'text-[#D97652]',
      icon: '✓',
    },
    visited: {
      label: 'Visited',
      color: 'text-[#7C8B6E]',
      icon: '♥',
    },
  };

  const config = statusConfig[place.status] || statusConfig.dreaming;

  // Extract URL from note if present
  const extractUrlFromNote = (note?: string): string | null => {
    if (!note) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = note.match(urlRegex);
    return match ? match[0] : null;
  };

  const mapLinkFromNote = extractUrlFromNote(place.note);
  const finalMapLink = place.mapLink || mapLinkFromNote;

  return (
    <div className="group bg-white rounded-[1.25rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(124,139,110,0.15)] transition-all duration-300">
      {/* Wide Atmospheric Image */}
      <div className="relative h-72 sm:h-80 overflow-hidden bg-[#EBE6DD]">
        {place.imageUrl ? (
          <img
            src={place.imageUrl}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#706B61]">
            <span className="text-sm">No image</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D3328]/60 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <span className="text-sm">{config.icon}</span>
            <span className={`${config.color} text-sm`}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Map Link Button */}
        {finalMapLink && (
          <a
            href={finalMapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg hover:bg-white transition-colors"
            aria-label="View on map"
          >
            <MapPin className="w-4 h-4 text-[#7C8B6E]" />
            <span className="text-sm text-[#3D3328]">Map</span>
          </a>
        )}

        {/* Delete Button */}
        <button
          onClick={() => onDelete(place.id)}
          className="absolute top-4 right-4 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
          aria-label="Delete place"
        >
          <Trash2 className="w-4 h-4 text-[#D94E3D]" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <div className="mb-3">
          <h3 className="text-2xl mb-1 text-[#3D3328]" style={{ fontFamily: "DarumadropOne, serif" }}>
            {place.name}
          </h3>
          <p className="text-[#706B61]">{place.location}</p>
        </div>

        {/* Tags */}
        {place.tags && place.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {place.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#EBE6DD] text-[#3D3328] px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Note */}
        {place.note && (
          <p className="text-sm text-[#706B61] leading-relaxed italic border-t border-[#EBE6DD] pt-4">
            "{place.note}"
          </p>
        )}
      </div>
    </div>
  );
}
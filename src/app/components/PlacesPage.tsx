import { Plus, ArrowLeft } from 'lucide-react';
import { PlaceCard } from './PlaceCard';

interface Place {
  id: string;
  name: string;
  location: string;
  tags: string[];
  status: 'dreaming' | 'booked' | 'visited';
  note?: string;
  imageUrl?: string;
  mapLink?: string;
}

interface PlacesPageProps {
  places: Place[];
  onBack: () => void;
  onAddNew: () => void;
  onDelete: (id: string) => void;
}

export function PlacesPage({ places, onBack, onAddNew, onDelete }: PlacesPageProps) {
  return (
    <div className="min-h-screen p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#706B61] hover:text-[#3D3328] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl mb-2 text-[#3D3328]" style={{ fontFamily: "DarumadropOne, serif" }}>
              The Atlas
            </h1>
            <p className="text-lg text-[#706B61]">
              Places to explore and memories to make together
            </p>
          </div>
          
          <button
            onClick={onAddNew}
            className="bg-[#7C8B6E] hover:bg-[#6B7A5E] text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl sm:self-start"
          >
            <Plus className="w-5 h-5" />
            Add Place
          </button>
        </div>
      </div>

      {/* Grid - Journal style layout */}
      <div className="max-w-7xl mx-auto">
        {places.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#EBE6DD] rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-[#706B61]" />
            </div>
            <h3 className="text-2xl mb-2 text-[#3D3328]">No destinations yet</h3>
            <p className="text-[#706B61] mb-6">Start planning your adventures</p>
            <button
              onClick={onAddNew}
              className="bg-[#7C8B6E] hover:bg-[#6B7A5E] text-white px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Destination
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
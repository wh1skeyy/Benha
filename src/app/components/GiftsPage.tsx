import { Plus, ArrowLeft } from 'lucide-react';
import { GiftCard } from './GiftCard';

interface Gift {
  id: string;
  name: string;
  link?: string;
  priority: 'high' | 'medium' | 'low';
  note?: string;
  imageUrl?: string;
}

interface GiftsPageProps {
  gifts: Gift[];
  onBack: () => void;
  onAddNew: () => void;
  onDelete: (id: string) => void;
}

export function GiftsPage({ gifts, onBack, onAddNew, onDelete }: GiftsPageProps) {
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
              The Boutique
            </h1>
            <p className="text-lg text-[#706B61]">
              Beautiful things to wrap and treasure
            </p>
          </div>
          
          <button
            onClick={onAddNew}
            className="bg-[#7C8B6E] hover:bg-[#6B7A5E] text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl sm:self-start"
          >
            <Plus className="w-5 h-5" />
            Add Gift
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        {gifts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#EBE6DD] rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-[#706B61]" />
            </div>
            <h3 className="text-2xl mb-2 text-[#3D3328]">No gifts yet</h3>
            <p className="text-[#706B61] mb-6">Start adding items to your wishlist</p>
            <button
              onClick={onAddNew}
              className="bg-[#7C8B6E] hover:bg-[#6B7A5E] text-white px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Gift
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {gifts.map((gift) => (
              <GiftCard key={gift.id} gift={gift} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
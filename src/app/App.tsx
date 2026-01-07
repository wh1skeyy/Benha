import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { GiftsPage } from './components/GiftsPage';
import { PlacesPage } from './components/PlacesPage';
import { AddItemModal } from './components/AddItemModal';
import { FallingLeaves, ParticlePreset } from './components/FallingLeaves';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast, Toaster } from 'sonner';
import { sampleGifts, samplePlaces } from './utils/seedData';
import { Sparkles } from 'lucide-react';

type Page = 'home' | 'gifts' | 'places';

interface Gift {
  id: string;
  name: string;
  link?: string;
  priority: 'high' | 'medium' | 'low';
  note?: string;
  imageUrl?: string;
  imagePath?: string;
}

interface Place {
  id: string;
  name: string;
  location: string;
  tags: string[];
  status: 'dreaming' | 'booked' | 'visited';
  note?: string;
  imageUrl?: string;
  imagePath?: string;
  mapLink?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'gift' | 'place'>('gift');
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showParticleMenu, setShowParticleMenu] = useState(false);

  // Randomly select a particle preset on page load
  const getRandomPreset = (): ParticlePreset => {
    const presets: ParticlePreset[] = ['autumn', 'summer', 'sakura', 'snow'];
    return presets[Math.floor(Math.random() * presets.length)];
  };
  
  const [particlePreset, setParticlePreset] = useState<ParticlePreset>(getRandomPreset());

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-ebd4994c`;

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [giftsRes, placesRes] = await Promise.all([
        fetch(`${apiUrl}/gifts`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }),
        fetch(`${apiUrl}/places`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }),
      ]);

      if (giftsRes.ok) {
        const giftsData = await giftsRes.json();
        setGifts(giftsData);
        
        // Seed sample data if empty
        if (giftsData.length === 0) {
          seedSampleData();
        }
      }

      if (placesRes.ok) {
        const placesData = await placesRes.json();
        setPlaces(placesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const seedSampleData = async () => {
    try {
      // Add sample gifts
      for (const gift of sampleGifts) {
        await fetch(`${apiUrl}/gifts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(gift),
        });
      }

      // Add sample places
      for (const place of samplePlaces) {
        await fetch(`${apiUrl}/places`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(place),
        });
      }

      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  };

  const handleAddGift = async (data: any) => {
    try {
      const res = await fetch(`${apiUrl}/gifts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to add gift');
      }

      const newGift = await res.json();
      setGifts([...gifts, newGift]);
      toast.success('Gift added successfully!');
    } catch (error) {
      console.error('Error adding gift:', error);
      toast.error('Failed to add gift');
      throw error;
    }
  };

  const handleAddPlace = async (data: any) => {
    try {
      const res = await fetch(`${apiUrl}/places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to add place');
      }

      const newPlace = await res.json();
      setPlaces([...places, newPlace]);
      toast.success('Place added successfully!');
    } catch (error) {
      console.error('Error adding place:', error);
      toast.error('Failed to add place');
      throw error;
    }
  };

  const handleDeleteGift = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/gifts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete gift');
      }

      setGifts(gifts.filter(g => g.id !== id));
      toast.success('Gift deleted');
    } catch (error) {
      console.error('Error deleting gift:', error);
      toast.error('Failed to delete gift');
    }
  };

  const handleDeletePlace = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/places/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete place');
      }

      setPlaces(places.filter(p => p.id !== id));
      toast.success('Place deleted');
    } catch (error) {
      console.error('Error deleting place:', error);
      toast.error('Failed to delete place');
    }
  };

  const openAddModal = (type: 'gift' | 'place') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D97652] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#706B61]">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <FallingLeaves preset={particlePreset} />
      
      {/* Particle Preset Selector */}
      <div className="fixed top-6 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setShowParticleMenu(!showParticleMenu)}
            className="bg-transparent rounded-full p-3 transition-all hover:scale-110"
            aria-label="Change particle effects"
          >
            <Sparkles className="w-5 h-5 text-transparent opacity-0" />
          </button>
          
          {showParticleMenu && (
            <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-sm border-2 border-[#D97652]/30 rounded-2xl shadow-xl p-2 min-w-[180px]">
              <div className="text-xs uppercase tracking-wider text-[#706B61] px-3 py-2 font-medium">
                Particle Effect
              </div>
              {(['autumn', 'summer', 'sakura', 'snow'] as ParticlePreset[]).map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setParticlePreset(preset);
                    setShowParticleMenu(false);
                    toast.success(`Switched to ${preset} particles`);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all ${
                    particlePreset === preset
                      ? 'bg-[#D97652] text-white'
                      : 'hover:bg-[#F5F1E8] text-[#706B61]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {preset === 'autumn' && <span>🍂</span>}
                    {preset === 'summer' && <span>✨</span>}
                    {preset === 'sakura' && <span>🌸</span>}
                    {preset === 'snow' && <span>❄️</span>}
                    <span className="capitalize">{preset}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {currentPage === 'home' && (
        <HomePage onNavigate={setCurrentPage} />
      )}

      {currentPage === 'gifts' && (
        <GiftsPage
          gifts={gifts}
          onBack={() => setCurrentPage('home')}
          onAddNew={() => openAddModal('gift')}
          onDelete={handleDeleteGift}
        />
      )}

      {currentPage === 'places' && (
        <PlacesPage
          places={places}
          onBack={() => setCurrentPage('home')}
          onAddNew={() => openAddModal('place')}
          onDelete={handleDeletePlace}
        />
      )}

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        onSubmit={modalType === 'gift' ? handleAddGift : handleAddPlace}
      />
    </>
  );
}
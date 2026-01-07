import { X, Upload, Loader } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'gift' | 'place';
  onSubmit: (data: any) => Promise<void>;
}

export function AddItemModal({ isOpen, onClose, type, onSubmit }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    location: '',
    mapLink: '',
    priority: 'medium',
    status: 'dreaming',
    tags: '',
    note: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = formData.imageUrl;

      // If user uploaded a file, upload it to Supabase Storage first
      if (imageFile) {
        try {
          // Generate unique filename: timestamp + random string + original extension
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const extension = imageFile.name.split('.').pop() || 'jpg';
          const uniqueFilename = `${timestamp}-${randomString}.${extension}`;
          
          // Upload to Supabase Storage
          const { data, error } = await supabase.storage
            .from('wishlist-images')
            .upload(uniqueFilename, imageFile, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) {
            throw error;
          }

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('wishlist-images')
            .getPublicUrl(data.path);

          finalImageUrl = publicUrl;
          toast.success('Image uploaded successfully!');
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error('Failed to upload image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      const data: any = {
        name: formData.name,
        note: formData.note,
        imageUrl: finalImageUrl,
      };

      if (type === 'gift') {
        data.link = formData.link;
        data.priority = formData.priority;
      } else {
        data.location = formData.location;
        data.status = formData.status;
        data.tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        data.mapLink = formData.mapLink;
      }

      await onSubmit(data);
      
      // Reset form
      setFormData({
        name: '',
        link: '',
        location: '',
        mapLink: '',
        priority: 'medium',
        status: 'dreaming',
        tags: '',
        note: '',
        imageUrl: '',
      });
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D3328]/60 backdrop-blur-sm">
      <div className="bg-white rounded-[1.25rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#EBE6DD] p-6 flex items-center justify-between rounded-t-[1.25rem]">
          <h2 className="text-2xl text-[#3D3328]">
            Add New {type === 'gift' ? 'Gift' : 'Place'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EBE6DD] hover:bg-[#D1C9BC] flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-[#3D3328]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block text-[#3D3328] mb-2">Image</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#D1C9BC] rounded-xl p-8 text-center cursor-pointer hover:border-[#D97652] transition-colors bg-[#FAF7F2]"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-[#EBE6DD] rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-[#706B61]" />
                  </div>
                  <p className="text-[#706B61]">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-[#706B61]">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Or Image URL */}
          <div>
            <label className="block text-[#3D3328] mb-2">Or Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 rounded-xl border border-[#D1C9BC] focus:border-[#D97652] focus:outline-none focus:ring-2 focus:ring-[#D97652]/20 bg-white"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-[#3D3328] mb-2">
              {type === 'gift' ? 'Item Name' : 'Place Name'} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={type === 'gift' ? 'e.g., Cashmere Scarf' : 'e.g., Santorini'}
              className="w-full px-4 py-3 rounded-xl border border-[#D1C9BC] focus:border-[#D97652] focus:outline-none focus:ring-2 focus:ring-[#D97652]/20 bg-white"
            />
          </div>

          {/* Conditional Fields for Gift */}
          {type === 'gift' && (
            <>
              <div>
                <label className="block text-[#3D3328] mb-2">Link</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://example.com/product"
                  className="w-full px-4 py-3 rounded-xl border border-[#D1C9BC] focus:border-[#D97652] focus:outline-none focus:ring-2 focus:ring-[#D97652]/20 bg-white"
                />
              </div>

              <div>
                <label className="block text-[#3D3328] mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#D1C9BC] focus:border-[#D97652] focus:outline-none focus:ring-2 focus:ring-[#D97652]/20 bg-white"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Someday</option>
                  <option value="low">Dreaming</option>
                </select>
              </div>
            </>
          )}

          {/* Conditional Fields for Place */}
          {type === 'place' && (
            <>
              <div>
                <label className="block text-[#3D3328] mb-2">Location *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Greece"
                  className="w-full px-4 py-3 rounded-xl border border-[#D1C9BC] focus:border-[#D97652] focus:outline-none focus:ring-2 focus:ring-[#D97652]/20 bg-white"
                />
              </div>

              <div>
                <label className="block text-[#3D3328] mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#D1C9BC] focus:border-[#D97652] focus:outline-none focus:ring-2 focus:ring-[#D97652]/20 bg-white"
                >
                  <option value="dreaming">Dreaming of</option>
                  <option value="booked">Booked</option>
                  <option value="visited">Visited</option>
                </select>
              </div>

              <div>
                <label className="block text-[#3D3328] mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., 🍴 Foodie, 🌲 Nature, ✈️ Travel"
                  className="w-full px-4 py-3 rounded-xl border border-[#D1C9BC] focus:border-[#D97652] focus:outline-none focus:ring-2 focus:ring-[#D97652]/20 bg-white"
                />
              </div>
            </>
          )}

          {/* Note */}
          <div>
            <label className="block text-[#3D3328] mb-2">
              {type === 'gift' ? 'Why I want this' : 'Why this place'}
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder={
                type === 'gift'
                  ? 'e.g., It matches my winter coat perfectly!'
                  : 'e.g., The sunset views are breathtaking. https://maps.google.com/?q=Santorini,Greece'
              }
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-[#D1C9BC] focus:border-[#D97652] focus:outline-none focus:ring-2 focus:ring-[#D97652]/20 bg-white resize-none"
            />
            {type === 'place' && (
              <p className="text-sm text-[#706B61] mt-1">
                💡 Tip: Include a Google Maps link in your note to show a Map button
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-[#D1C9BC] text-[#3D3328] hover:bg-[#EBE6DD] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-xl ${
                type === 'gift' ? 'bg-[#D97652]' : 'bg-[#7C8B6E]'
              } text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
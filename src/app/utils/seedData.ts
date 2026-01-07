// Sample data for demonstration
export const sampleGifts = [
  {
    name: 'Cashmere Wrap Scarf',
    link: 'https://example.com',
    priority: 'high' as const,
    note: 'The camel color would match my winter coat perfectly. So soft and cozy!',
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800',
  },
  {
    name: 'Leather Bound Journal',
    link: 'https://example.com',
    priority: 'medium' as const,
    note: 'I want to start journaling our adventures together. Love the vintage aesthetic.',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800',
  },
  {
    name: 'Handmade Ceramic Mug Set',
    link: 'https://example.com',
    priority: 'low' as const,
    note: 'These earthy tones are so beautiful. Perfect for our Sunday morning coffee ritual.',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
  },
];

export const samplePlaces = [
  {
    name: 'Santorini',
    location: 'Greece',
    tags: ['✈️ Travel', '🌅 Sunset', '🍴 Foodie'],
    status: 'dreaming' as const,
    note: 'The white buildings and blue domes look like a dream. I want to watch the sunset together in Oia. https://maps.google.com/?q=Santorini,Greece',
    imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200',
    mapLink: 'https://maps.google.com/?q=Santorini,Greece',
  },
  {
    name: 'Kyoto Gardens',
    location: 'Japan',
    tags: ['🌸 Cherry Blossom', '🎎 Culture', '🍜 Food'],
    status: 'dreaming' as const,
    note: 'The temples, gardens, and traditional tea houses. Spring cherry blossom season would be magical. https://maps.google.com/?q=Kyoto,Japan',
    imageUrl: 'https://images.unsplash.com/photo-1592536511117-9d984977e751?w=1200',
    mapLink: 'https://maps.google.com/?q=Kyoto,Japan',
  },
];
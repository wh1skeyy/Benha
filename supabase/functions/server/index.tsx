import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();

// Create Supabase client for storage operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize storage buckets on startup
async function initializeStorage() {
  const bucketName = 'make-ebd4994c-wishlist-images';
  
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (error) {
        console.log(`Error creating bucket: ${error.message}`);
      } else {
        console.log(`Created bucket: ${bucketName}`);
      }
    }
  } catch (error) {
    console.log(`Error initializing storage: ${error}`);
  }
}

// Initialize storage when server starts
initializeStorage();

// Health check endpoint
app.get("/make-server-ebd4994c/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all gifts
app.get("/make-server-ebd4994c/gifts", async (c) => {
  try {
    const gifts = await kv.getByPrefix("gift:");
    
    // Get signed URLs for images
    const giftsWithImages = await Promise.all(
      gifts.map(async (gift) => {
        if (gift.imagePath) {
          const { data } = await supabase.storage
            .from('make-ebd4994c-wishlist-images')
            .createSignedUrl(gift.imagePath, 3600); // 1 hour expiry
          
          return { ...gift, imageUrl: data?.signedUrl || null };
        }
        return gift;
      })
    );
    
    return c.json(giftsWithImages);
  } catch (error) {
    console.log(`Error fetching gifts: ${error}`);
    return c.json({ error: 'Failed to fetch gifts' }, 500);
  }
});

// Get all places
app.get("/make-server-ebd4994c/places", async (c) => {
  try {
    const places = await kv.getByPrefix("place:");
    
    // Get signed URLs for images
    const placesWithImages = await Promise.all(
      places.map(async (place) => {
        if (place.imagePath) {
          const { data } = await supabase.storage
            .from('make-ebd4994c-wishlist-images')
            .createSignedUrl(place.imagePath, 3600); // 1 hour expiry
          
          return { ...place, imageUrl: data?.signedUrl || null };
        }
        return place;
      })
    );
    
    return c.json(placesWithImages);
  } catch (error) {
    console.log(`Error fetching places: ${error}`);
    return c.json({ error: 'Failed to fetch places' }, 500);
  }
});

// Create a new gift
app.post("/make-server-ebd4994c/gifts", async (c) => {
  try {
    const body = await c.req.json();
    const { name, link, priority, note, imageUrl } = body;
    
    const id = crypto.randomUUID();
    const gift = {
      id,
      name,
      link,
      priority,
      note,
      imageUrl,
      imagePath: null,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`gift:${id}`, gift);
    return c.json(gift);
  } catch (error) {
    console.log(`Error creating gift: ${error}`);
    return c.json({ error: 'Failed to create gift' }, 500);
  }
});

// Create a new place
app.post("/make-server-ebd4994c/places", async (c) => {
  try {
    const body = await c.req.json();
    const { name, location, tags, status, note, imageUrl, mapLink } = body;
    
    const id = crypto.randomUUID();
    const place = {
      id,
      name,
      location,
      tags,
      status,
      note,
      imageUrl,
      imagePath: null,
      mapLink,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`place:${id}`, place);
    return c.json(place);
  } catch (error) {
    console.log(`Error creating place: ${error}`);
    return c.json({ error: 'Failed to create place' }, 500);
  }
});

// Upload image
app.post("/make-server-ebd4994c/upload-image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `images/${fileName}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    const { error: uploadError } = await supabase.storage
      .from('make-ebd4994c-wishlist-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });
    
    if (uploadError) {
      console.log(`Error uploading image: ${uploadError.message}`);
      return c.json({ error: 'Failed to upload image' }, 500);
    }
    
    const { data } = await supabase.storage
      .from('make-ebd4994c-wishlist-images')
      .createSignedUrl(filePath, 3600);
    
    return c.json({ 
      imagePath: filePath,
      imageUrl: data?.signedUrl || null 
    });
  } catch (error) {
    console.log(`Error in upload endpoint: ${error}`);
    return c.json({ error: 'Failed to upload image' }, 500);
  }
});

// Delete gift
app.delete("/make-server-ebd4994c/gifts/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const gift = await kv.get(`gift:${id}`);
    
    if (gift?.imagePath) {
      await supabase.storage
        .from('make-ebd4994c-wishlist-images')
        .remove([gift.imagePath]);
    }
    
    await kv.del(`gift:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting gift: ${error}`);
    return c.json({ error: 'Failed to delete gift' }, 500);
  }
});

// Delete place
app.delete("/make-server-ebd4994c/places/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const place = await kv.get(`place:${id}`);
    
    if (place?.imagePath) {
      await supabase.storage
        .from('make-ebd4994c-wishlist-images')
        .remove([place.imagePath]);
    }
    
    await kv.del(`place:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting place: ${error}`);
    return c.json({ error: 'Failed to delete place' }, 500);
  }
});

Deno.serve(app.fetch);
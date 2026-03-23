import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zxzengrqztooblocotxy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4emVuZ3JxenRvb2Jsb2NvdHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MjEwMDcsImV4cCI6MjA4OTE5NzAwN30.qcPIgJmbNgVQYl0nwzsZ5Bskpl2Pb19DlGnooRSN18s'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4emVuZ3JxenRvb2Jsb2NvdHh5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzYyMTAwNywiZXhwIjoyMDg5MTk3MDA3fQ.AX4ZrGn2nhCJd1tt8rEPZR3bs4IswwLStMgb1kh7ONc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export const BUCKET_NAME = 'IMAGE'

export interface SupabaseImage {
  id: string
  path: string
  fullPath: string
  name?: string
  size?: number
  content_type?: string
  created_at?: string
  updated_at?: string
}

export const uploadImage = async (file: File, folder: string = 'templates'): Promise<{ data: SupabaseImage | null; error: Error | null }> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data: data as SupabaseImage, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

export const getImageUrl = (path: string): string => {
  // Use the correct base URL format
  const baseUrl = 'https://zxzengrqztooblocotxy.supabase.co/storage/v1/object/public/IMAGE/';
  return `${baseUrl}${path}`;
}

export const deleteImage = async (path: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([path])

    return { error: error ? new Error(error.message) : null }
  } catch (error) {
    return { error: error as Error }
  }
}

export const findImageByName = async (fileName: string, folder: string = 'templates'): Promise<{ data: SupabaseImage | null; error: Error | null }> => {
  try {
    // First, list all images in the folder
    const { data: images, error } = await listImages(folder);
    
    if (error) {
      return { data: null, error };
    }
    
    if (!images || images.length === 0) {
      return { data: null, error: new Error('No images found in folder') };
    }
    
    // Search for the image by filename (case-insensitive)
    const foundImage = images.find(image => 
      image.name && (
        image.name.toLowerCase() === fileName.toLowerCase() ||
        image.name.toLowerCase().includes(fileName.toLowerCase()) ||
        fileName.toLowerCase().includes(image.name.toLowerCase())
      )
    );
    
    if (foundImage) {
      return { data: foundImage, error: null };
    } else {
      return { data: null, error: new Error(`Image with name "${fileName}" not found in Supabase`) };
    }
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

export const listImages = async (folder: string = 'templates'): Promise<{ data: SupabaseImage[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    // Transform FileObject to SupabaseImage
    const transformedData = data.map(file => ({
      id: file.id,
      path: file.name,
      fullPath: `${folder}/${file.name}`,
      name: file.name,
      size: undefined, // FileObject doesn't have size property
      content_type: file.metadata?.content_type,
      created_at: file.created_at,
      updated_at: file.updated_at
    }));

    return { data: transformedData as SupabaseImage[], error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

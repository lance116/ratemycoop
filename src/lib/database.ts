import { supabase } from './supabase'
import type { Company, Review } from '@/data/companies'

// Company operations
export const getCompanies = async (): Promise<Company[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      company_tags(tag),
      reviews(*)
    `)
    .order('elo', { ascending: false })

  if (error) {
    console.error('Error fetching companies:', error)
    return []
  }

  return data?.map(company => ({
    id: company.id,
    name: company.name,
    logo: company.logo,
    description: company.description,
    elo: company.elo,
    rating: 0, // Calculate from reviews if needed
    tags: company.company_tags?.map((ct: any) => ct.tag) || [],
    reviews: company.reviews?.map((review: any) => ({
      id: review.id,
      author: review.author,
      rating: review.rating,
      content: review.content,
      date: review.created_at,
      program: review.program,
      year: review.year
    })) || []
  })) || []
}

export const getCompany = async (id: number): Promise<Company | null> => {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      company_tags(tag),
      reviews(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching company:', error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    logo: data.logo,
    description: data.description,
    elo: data.elo,
    rating: 0, // Calculate from reviews if needed
    tags: data.company_tags?.map((ct: any) => ct.tag) || [],
    reviews: data.reviews?.map((review: any) => ({
      id: review.id,
      author: review.author,
      rating: review.rating,
      content: review.content,
      date: review.created_at,
      program: review.program,
      year: review.year
    })) || []
  }
}

export const updateCompanyElo = async (id: number, newElo: number): Promise<boolean> => {
  const { error } = await supabase
    .from('companies')
    .update({ elo: newElo, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error updating company ELO:', error)
    return false
  }

  return true
}

// Review operations
export const getReviews = async (companyId?: number): Promise<Review[]> => {
  let query = supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })

  if (companyId) {
    query = query.eq('company_id', companyId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data?.map(review => ({
    id: review.id,
    author: review.author,
    rating: review.rating,
    content: review.content,
    date: review.created_at,
    program: review.program,
    year: review.year
  })) || []
}

export const createReview = async (review: Omit<Review, 'id' | 'date'> & { company_id: number }): Promise<boolean> => {
  const { error } = await supabase
    .from('reviews')
    .insert({
      company_id: review.company_id,
      author: review.author,
      rating: review.rating,
      content: review.content,
      program: review.program,
      year: review.year
    })

  if (error) {
    console.error('Error creating review:', error)
    return false
  }

  return true
}

// Vote operations
export const recordVote = async (winnerId: number, loserId: number): Promise<boolean> => {
  const { error } = await supabase
    .from('votes')
    .insert({
      winner_id: winnerId,
      loser_id: loserId
    })

  if (error) {
    console.error('Error recording vote:', error)
    return false
  }

  return true
}

// Initialize database with sample data
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    // Check if companies already exist
    const { data: existingCompanies } = await supabase
      .from('companies')
      .select('id')
      .limit(1)

    if (existingCompanies && existingCompanies.length > 0) {
      console.log('Database already initialized')
      return true
    }

    // Insert companies
    const companies = [
      { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", description: "Leading technology company with innovative culture", elo: 1600 },
      { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", description: "Global technology leader with diverse opportunities", elo: 1600 },
      { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg", description: "Social technology company building the metaverse", elo: 1600 },
      { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", description: "E-commerce and cloud computing giant", elo: 1600 },
      { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", description: "Consumer technology and innovation leader", elo: 1600 },
      { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", description: "Streaming entertainment and content platform", elo: 1600 },
      { name: "Shopify", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg", description: "E-commerce platform powering businesses worldwide", elo: 1600 },
      { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg", description: "Electric vehicles and sustainable energy", elo: 1600 },
      { name: "Uber", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png", description: "Mobility and delivery technology platform", elo: 1600 },
      { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg", description: "Audio streaming and media services platform", elo: 1600 }
    ]

    const { data: insertedCompanies, error: companyError } = await supabase
      .from('companies')
      .insert(companies)
      .select('id, name')

    if (companyError) {
      console.error('Error inserting companies:', companyError)
      return false
    }

    // Insert tags for each company
    const tags = [
      { company_id: 1, tag: "Search" }, { company_id: 1, tag: "Cloud" }, { company_id: 1, tag: "AI/ML" }, { company_id: 1, tag: "Ads" },
      { company_id: 2, tag: "Azure" }, { company_id: 2, tag: "Office" }, { company_id: 2, tag: "Gaming" }, { company_id: 2, tag: "Enterprise" },
      { company_id: 3, tag: "Social Media" }, { company_id: 3, tag: "VR/AR" }, { company_id: 3, tag: "Mobile" }, { company_id: 3, tag: "AI" },
      { company_id: 4, tag: "AWS" }, { company_id: 4, tag: "E-commerce" }, { company_id: 4, tag: "Logistics" }, { company_id: 4, tag: "Alexa" },
      { company_id: 5, tag: "iOS" }, { company_id: 5, tag: "Hardware" }, { company_id: 5, tag: "Design" }, { company_id: 5, tag: "Consumer" },
      { company_id: 6, tag: "Streaming" }, { company_id: 6, tag: "Content" }, { company_id: 6, tag: "Microservices" }, { company_id: 6, tag: "Data" },
      { company_id: 7, tag: "E-commerce" }, { company_id: 7, tag: "Payments" }, { company_id: 7, tag: "Canadian" }, { company_id: 7, tag: "Ruby" },
      { company_id: 8, tag: "Automotive" }, { company_id: 8, tag: "Energy" }, { company_id: 8, tag: "Autopilot" }, { company_id: 8, tag: "Manufacturing" },
      { company_id: 9, tag: "Rideshare" }, { company_id: 9, tag: "Delivery" }, { company_id: 9, tag: "Maps" }, { company_id: 9, tag: "Payments" },
      { company_id: 10, tag: "Music" }, { company_id: 10, tag: "Audio" }, { company_id: 10, tag: "Recommendations" }, { company_id: 10, tag: "Mobile" }
    ]

    const { error: tagError } = await supabase
      .from('company_tags')
      .insert(tags)

    if (tagError) {
      console.error('Error inserting tags:', tagError)
      return false
    }

    console.log('Database initialized successfully')
    return true
  } catch (error) {
    console.error('Error initializing database:', error)
    return false
  }
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rknogrnkiestmtvftktp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrbm9ncm5raWVzdG10dmZ0a3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0ODQ0NTQsImV4cCI6MjA0NTA2MDQ1NH0.fquFr2nCuJSK0_aLWdw2A3524v-golZcR4dDKTPPT1k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for the twc_a11y_hsbc table
export interface HealthBenefitRequest {
  id?: string
  full_name: string
  email: string
  phone_number: string
  service: string
  description?: string
  contact_method: string
  availability_date?: string
  availability_time?: string
  documents?: any
  status?: string
  created_at?: string
  updated_at?: string
}

// Test function to verify database connection
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('twc_a11y_hsbc')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Database connection error:', error);
      return false;
    }
    
    console.log('Database connection successful!');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Function to get all requests (for testing purposes)
export const getAllRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('twc_a11y_hsbc')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching requests:', error);
    return [];
  }
} 
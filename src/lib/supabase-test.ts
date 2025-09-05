// Simple test to verify Supabase connection
import { supabase } from './supabase';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('companies')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('Supabase connection test successful!');
    return true;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return false;
  }
};

// Auto-run test in development
if (import.meta.env.DEV) {
  testSupabaseConnection();
}

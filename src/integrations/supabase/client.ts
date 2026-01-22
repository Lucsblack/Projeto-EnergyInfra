import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dmuoegzstayjrqvymwyo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtdW9lZ3pzdGF5anJxdnltd3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMDY5NjIsImV4cCI6MjA4NDY4Mjk2Mn0.s__thN7kBCa_DKA_aed6Ll0yxzp8TRVyb7kzJDBbU8U";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

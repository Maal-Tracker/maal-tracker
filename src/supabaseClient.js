// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

// Halkan ku beddel URL-kaaga iyo Key-gaaga
const supabaseUrl = 'https://altkpqjwxpytdpsikcdf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsdGtwcWp3eHB5dGRwc2lrY2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NDQ3NjQsImV4cCI6MjA3OTUyMDc2NH0.9G7XsNoGfeanBEhHRiKMhFJUthmI-TzAsmGeDjXAH0E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
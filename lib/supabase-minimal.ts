import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoTrueClient } from '@supabase/gotrue-js'
import { PostgrestClient } from '@supabase/postgrest-js'
import { StorageClient } from '@supabase/storage-js'
import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create individual clients
const postgrest = new PostgrestClient(`${supabaseUrl}/rest/v1`, {
  headers: {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  },
})

const auth = new GoTrueClient({
  url: `${supabaseUrl}/auth/v1`,
  headers: {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  },
  storage: AsyncStorage,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
})

const storage = new StorageClient(`${supabaseUrl}/storage/v1`, {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
})

// Create a minimal supabase-like interface
export const supabase = {
  from: (table: string) => postgrest.from(table),
  auth,
  storage,
  rpc: (fn: string, args?: any) => postgrest.rpc(fn, args),
}

// Handle session refresh
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    auth.startAutoRefresh()
  } else {
    auth.stopAutoRefresh()
  }
}) 
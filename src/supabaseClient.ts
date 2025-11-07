import { createClient } from '@supabase/supabase-js'

// Read Vite environment variables. Replace values in project `.env` with your real Supabase credentials.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// If env vars missing, export a safe stub so the app doesn't crash at import time.
let _supabase: any = null
if (!supabaseUrl || !supabaseKey) {
	console.warn('Supabase env vars missing: falling back to a no-op supabase stub')

	// Minimal stub implementing the methods used in this repo (auth & from)
	_supabase = {
		auth: {
			async signInWithPassword() {
				return { data: null, error: { message: 'Supabase not configured' } }
			},
			async getSession() {
				return { data: null, error: { message: 'Supabase not configured' } }
			},
			onAuthStateChange() {
				return { data: null }
			}
		},
		from(_table: string) {
			return {
				async select() {
					return { data: null, error: { message: 'Supabase not configured' } }
				}
			}
		}
	}
} else {
	_supabase = createClient(supabaseUrl, supabaseKey)
}

export const supabase = _supabase

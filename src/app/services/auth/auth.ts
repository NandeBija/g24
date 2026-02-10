import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

const SUPABASE_URL = environment.supabaseUrl;
const SUPABASE_ANON_KEY = environment.supabaseKey;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  /* ---------------- LOGIN ---------------- */
  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data.user;
  }

  /* ---------------- REGISTER ---------------- */
  // async register(email: string, password: string, profile: any) {
  //   const { data, error } = await this.supabase.auth.signUp({
  //     email,
  //     password,
  //   });

  //   if (error) throw error;

  //   // Create profile in users table
  //   const { error: profileError } = await this.supabase.from('users').insert({
  //     user_id: data.user?.id,
  //     email,
  //     user_type: profile.user_type ?? 'Customer',
  //     full_name: profile.full_name,
  //     phone: profile.phone,
  //   });

  //   if (profileError) throw profileError;

  //   return data.user;
  // }

  /* ---------------- PROFILE ---------------- */
  async getProfile() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  /* ---------------- LOGOUT ---------------- */
  async logout() {
    await this.supabase.auth.signOut();
  }

  /* ---------------- SESSION ---------------- */
  async isAuthenticated(): Promise<boolean> {
    const { data } = await this.supabase.auth.getSession();
    return !!data.session;
  }
}

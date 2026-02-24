/**
 * Supabase Configuration
 * Handles connection to Supabase for user authentication and data storage.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jbgrchrnhhvzmnwsqtbs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiZ3JjaHJuaGh2em1ud3NxdGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODM0NzksImV4cCI6MjA4NzI1OTQ3OX0.HhQVhE4xHe86YSOY4yYMUksPB1N7Q0f_xggIH-L2ukY';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Sign up a new user
 * @param {string} email - User's email
 * @param {string} password - User's password (min 6 chars)
 * @param {string} displayName - User's display name
 * @param {string} username - User's unique username
 * @returns {Promise} - User data or error
 */
export async function signUp(email, password, displayName, username) {
  try {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || username || email.split('@')[0],
          username: username || email.split('@')[0]
        }
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      const userId = authData.user.id;

      // Create user profile in users table
      const profileData = {
        id: userId,
        email,
        username: username || email.split('@')[0],
        display_name: displayName || username || email.split('@')[0],
        tokens: 100,
        referral_code: userId.substring(0, 8).toUpperCase(),
        is_active: true
      };

      const { error: profileError } = await supabase
        .from('users')
        .insert(profileData);

      if (profileError && !profileError.message.includes('duplicate')) {
        console.error('Profile creation error:', profileError);
      }

      return {
        ok: true,
        user: profileData,
        session: authData.session,
        token: authData.session?.access_token
      };
    }

    return { ok: false, error: 'Signup failed' };
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.message?.includes('already registered')) {
      return { ok: false, error: 'email already registered' };
    }
    if (error.message?.includes('user_username_key')) {
      return { ok: false, error: 'username exists' };
    }
    
    return { ok: false, error: error.message || 'Signup failed' };
  }
}

/**
 * Sign in with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - User data and session or error
 */
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    if (data.user) {
      // Get user profile from users table
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userData = profile || {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username || email.split('@')[0],
        display_name: data.user.user_metadata?.display_name || email.split('@')[0],
        tokens: 100,
        referral_code: data.user.id.substring(0, 8).toUpperCase()
      };

      // Update last_login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);

      return {
        ok: true,
        user: userData,
        token: data.session?.access_token
      };
    }

    return { ok: false, error: 'Login failed' };
  } catch (error) {
    console.error('Login error:', error);
    return { ok: false, error: error.message || 'Invalid credentials' };
  }
}

/**
 * Sign in with username (looks up email first)
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise} - User data and session or error
 */
export async function signInWithUsername(username, password) {
  try {
    // First, find user by username to get email
    const { data: userData, error: lookupError } = await supabase
      .from('users')
      .select('email')
      .eq('username', username)
      .single();

    if (lookupError || !userData) {
      return { ok: false, error: 'User not found' };
    }

    // Now sign in with email
    return signIn(userData.email, password);
  } catch (error) {
    console.error('Username login error:', error);
    return { ok: false, error: 'Login failed' };
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    await supabase.auth.signOut();
    return { ok: true };
  } catch (error) {
    console.error('Signout error:', error);
    return { ok: false, error: error.message };
  }
}

/**
 * Get current session
 */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    // Get profile from users table
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return profile || null;
  }
  
  return null;
}

/**
 * Update user tokens
 * @param {string} userId - User's ID
 * @param {number} tokens - New token balance
 */
export async function updateTokens(userId, tokens) {
  try {
    await supabase
      .from('users')
      .update({ tokens })
      .eq('id', userId);
    return { ok: true, tokens };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

/**
 * Deduct tokens from user
 * @param {string} userId - User's ID
 * @param {number} amount - Amount to deduct
 */
export async function deductTokens(userId, amount = 1) {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('tokens')
      .eq('id', userId)
      .single();

    if (!user || user.tokens < amount) {
      return { ok: false, error: 'Insufficient tokens' };
    }

    const newBalance = user.tokens - amount;
    await supabase
      .from('users')
      .update({ tokens: newBalance })
      .eq('id', userId);

    return { ok: true, tokens: newBalance };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

/**
 * Listen to auth state changes
 * @param {Function} callback - Called when auth state changes
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      callback(event, session, profile);
    } else {
      callback(event, session, null);
    }
  });
}

export default supabase;

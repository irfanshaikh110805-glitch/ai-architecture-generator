import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Make Supabase optional - only initialize if credentials are provided
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Supabase features will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// Helper functions for authentication
export const authHelpers = {
  // Sign up with email and password
  signUp: async (email, password, metadata = {}) => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  getSession: async () => {
    if (!supabase) {
      return null;
    }
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get current user
  getUser: async () => {
    if (!supabase) {
      return null;
    }
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Reset password
  resetPassword: async (email) => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return data;
  },

  // Update user
  updateUser: async (updates) => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    if (!supabase) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Helper functions for database operations
export const dbHelpers = {
  // Architectures
  getArchitectures: async (userId) => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    const { data, error } = await supabase
      .from('architectures')
      .select(`
        *,
        features(*),
        database_tables(*),
        apis(*),
        components(*),
        roadmap_phases(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getArchitectureById: async (id) => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    const { data, error } = await supabase
      .from('architectures')
      .select(`
        *,
        features(*),
        database_tables(*),
        apis(*),
        components(*),
        roadmap_phases(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  createArchitecture: async (architectureData) => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    const { data, error } = await supabase
      .from('architectures')
      .insert(architectureData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateArchitecture: async (id, updates) => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    const { data, error} = await supabase
      .from('architectures')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  deleteArchitecture: async (id) => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    const { error } = await supabase
      .from('architectures')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Usage records
  createUsageRecord: async (usageData) => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    const { data, error } = await supabase
      .from('usage_records')
      .insert(usageData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getUserUsage: async (userId, startDate, endDate) => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    let query = supabase
      .from('usage_records')
      .select('*')
      .eq('user_id', userId);
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Notifications
  getUserNotifications: async (userId, unreadOnly = false, limit = 50) => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId);
    
    if (unreadOnly) {
      query = query.eq('read', false);
    }
    
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  markNotificationRead: async (notificationId) => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);
    
    if (error) throw error;
    return true;
  },

  markAllNotificationsRead: async (userId) => {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }
    const { error } = await supabase
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) throw error;
    return true;
  },
};

// Helper functions for real-time subscriptions
export const realtimeHelpers = {
  // Subscribe to architecture changes
  subscribeToArchitectures: (userId, callback) => {
    if (!supabase) {
      console.warn('Supabase is not configured. Real-time features disabled.');
      return null;
    }
    return supabase
      .channel('architectures')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'architectures',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to notifications
  subscribeToNotifications: (userId, callback) => {
    if (!supabase) {
      console.warn('Supabase is not configured. Real-time features disabled.');
      return null;
    }
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  // Unsubscribe from a channel
  unsubscribe: (channel) => {
    if (!supabase || !channel) {
      return;
    }
    return supabase.removeChannel(channel);
  },
};

export default supabase;

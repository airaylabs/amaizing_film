// Supabase Configuration
// Using IIFE to avoid global namespace pollution

(function() {
  const SUPABASE_URL = 'https://gqinziavjwglevgdntlw.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaW56aWF2andnbGV2Z2RudGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODE2OTAsImV4cCI6MjA4MTM1NzY5MH0.CnDHukxlPrBX64GdRcSJ1WyXIj-EpPsgcQZD_P765wQ';

  // Initialize Supabase Client
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ============ AUTH FUNCTIONS ============
  window.Auth = {
    async getUser() {
      const { data: { user } } = await window.supabaseClient.auth.getUser();
      return user;
    },

    async getSession() {
      const { data: { session } } = await window.supabaseClient.auth.getSession();
      return session;
    },

    async signUpEmail(email, password, fullName) {
      const redirectUrl = window.location.origin.includes('localhost') 
        ? window.location.origin 
        : 'https://amaizingfilm.netlify.app';
      
      const { data, error } = await window.supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: redirectUrl
        }
      });
      if (error) throw error;
      return data;
    },

    async signInEmail(email, password) {
      const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    },

    async signInGoogle() {
      const redirectUrl = window.location.origin.includes('localhost') 
        ? window.location.origin 
        : 'https://amaizingfilm.netlify.app';
      
      const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      if (error) throw error;
      return data;
    },

    async signOut() {
      const { error } = await window.supabaseClient.auth.signOut();
      if (error) throw error;
    },

    onAuthStateChange(callback) {
      return window.supabaseClient.auth.onAuthStateChange((event, session) => {
        callback(event, session);
      });
    }
  };

  console.log('✅ Supabase initialized');
})();

// Supabase Configuration
const SUPABASE_URL = 'https://gqinziavjwglevgdntlw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaW56aWF2andnbGV2Z2RudGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3ODE2OTAsImV4cCI6MjA4MTM1NzY5MH0.CnDHukxlPrBX64GdRcSJ1WyXIj-EpPsgcQZD_P765wQ';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============ AUTH FUNCTIONS ============
const Auth = {
  // Get current user
  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Sign up with email
  async signUpEmail(email, password, fullName) {
    const redirectUrl = window.location.origin.includes('localhost') 
      ? window.location.origin 
      : 'https://amaizingfilm.netlify.app';
    
    const { data, error } = await supabase.auth.signUp({
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

  // Sign in with email
  async signInEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  // Sign in with Google
  async signInGoogle() {
    const redirectUrl = window.location.origin.includes('localhost') 
      ? window.location.origin 
      : 'https://amaizingfilm.netlify.app';
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};

console.log('✅ Supabase initialized');

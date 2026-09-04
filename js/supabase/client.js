/* ============================================================
 * FOURHASH — Supabase Client (Global Singleton via CDN)
 * SDK:  @supabase/supabase-js v2 (carregado por <script> no HEAD)
 * Projeto: psxzgidozduecpaxwcny (FourHash Protocol)
 * URL:     https://psxzgidozduecpaxwcny.supabase.co
 * ANON:    Pública (segura no frontend — respeita RLS policies)
 * ============================================================ */
(function(){
  var SUPABASE_URL = 'https://psxzgidozduecpaxwcny.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeHpnaWRvemR1ZWNwYXh3Y255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MzkyOTcsImV4cCI6MjEwNDAxNTI5N30.a6LneIKWumm3kcdzi2PryNExiHdBw3cgHYphqdvCagY';

  window.SUPABASE_URL       = SUPABASE_URL;
  window.SUPABASE_ANON_KEY  = SUPABASE_ANON_KEY;
  window.SUPABASE_PROJECT_REF = 'psxzgidozduecpaxwcny';
  window.SUPABASE_ENABLED   = true;

  var sb = null;
  try {
    if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
      sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession:       true,
          autoRefreshToken:     true,
          detectSessionInUrl:   true,
          storageKey:           'fourhash.sb.session',
          flowType:             'pkce'
        },
        global: {
          headers: { 'x-fourhash-app': '4h-spa-v1' }
        }
      });
      window.sb = sb;
      window.SUPABASE_CLIENT_OK = true;
    } else {
      window.SUPABASE_CLIENT_OK = false;
      window.sb = null;
    }
  } catch (e) {
    window.SUPABASE_CLIENT_OK = false;
    window.SUPABASE_LAST_ERROR = (e && e.message) ? e.message : String(e);
    window.sb = null;
  }

  window.SupabaseOK = function(){ return !!(window.sb && window.SUPABASE_CLIENT_OK); };
})();

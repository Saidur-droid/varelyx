const BLOCKED_KEYS = new Set(['source','rawEvidence','supplierMessage','prompt','responseText']);
const ALLOWED_EVENTS = new Set([
  'demo_session_started','firebase_connected','gemini_analysis_started','gemini_analysis_verified',
  'evidence_reviewed','decision_ready','proof_passed','proof_blocked','approval_attempted',
  'save_verified','save_failed','reload_restore_verified','shadow_mode_viewed'
]);

function sanitize(properties={}) {
  return Object.fromEntries(Object.entries(properties).filter(([key,value]) =>
    !BLOCKED_KEYS.has(key) && ['string','number','boolean'].includes(typeof value)));
}

export function createAnalyticsAdapter(provider=null) {
  return {
    capture(name, properties={}) {
      if (!ALLOWED_EVENTS.has(name)) return;
      try { provider?.capture?.(name, sanitize(properties)); }
      catch { console.warn('Analytics event dropped:', name); }
    }
  };
}

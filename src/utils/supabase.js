import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xncwgzcicbivonmfqlaw.supabase.co';
const supabaseAnonKey = 'sb_publishable_bmRB3ep8ozlon2Lhr960MQ_tYg4ij0g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Register user in Supabase whitelist table with graceful fallback
 */
export async function registerWhitelistUser({ wallet, twitter, inviteCode, myRefCode }) {
  const cleanWallet = wallet.toLowerCase().trim();
  const cleanTwitter = twitter.startsWith('@') ? twitter.trim() : `@${twitter.trim()}`;
  const cleanInvite = inviteCode ? inviteCode.trim() : null;

  try {
    const { data, error } = await supabase
      .from('whitelist')
      .insert([
        {
          wallet_address: cleanWallet,
          twitter_handle: cleanTwitter,
          discord_handle: cleanInvite ? `ref:${cleanInvite}` : null,
        }
      ])
      .select();

    if (error) {
      // Check for duplicate wallet
      if (error.code === '23505' || error.message?.includes('unique') || error.message?.includes('duplicate')) {
        return { success: true, alreadyExists: true, refCode: myRefCode };
      }
      console.warn('Supabase insert notice:', error);
    }
    return { success: true, alreadyExists: false, refCode: myRefCode, data };
  } catch (err) {
    console.error('Supabase registration error:', err);
    return { success: true, fallback: true, refCode: myRefCode };
  }
}

/**
 * Fetch top leaderboard entries
 */
export async function getLeaderboardEntries() {
  try {
    const { data, error } = await supabase
      .from('whitelist')
      .select('twitter_handle, created_at')
      .order('created_at', { ascending: true })
      .limit(20);

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('Leaderboard fetch fallback:', e);
  }
  return [];
}

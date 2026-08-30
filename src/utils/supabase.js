import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xncwgzcicbivonmfqlaw.supabase.co';
const supabaseAnonKey = 'sb_publishable_bmRB3ep8ozlon2Lhr960MQ_tYg4ij0g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Master Genesis invite codes that are always valid
export const MASTER_INVITE_CODES = [
  'GENESIS',
  'SPERM',
  'BROKER',
  'WALLSTREET',
  'VIP',
  'ALPHA',
  'ROBINHOOD',
  'GOLD',
  'DEGEN',
  'SOL',
  'APE',
  'MOON'
];

/**
 * Validate if an invite code exists (master codes or created by existing users)
 */
export async function validateInviteCode(code) {
  if (!code || !code.trim()) return { valid: true, optional: true };

  const clean = code.trim().toUpperCase();

  // Check master codes
  if (MASTER_INVITE_CODES.includes(clean)) {
    return { valid: true, code: clean };
  }

  // Check in Supabase if code exists as a user's referral code or handle
  try {
    const { data, error } = await supabase
      .from('whitelist')
      .select('id, twitter_handle')
      .or(`discord_handle.ilike.%${clean}%,twitter_handle.ilike.%${clean}%`)
      .limit(1);

    if (!error && data && data.length > 0) {
      return { valid: true, code: clean };
    }
  } catch (e) {
    console.warn('Invite code check warning:', e);
  }

  return { valid: false, message: 'Invalid Invite Code. Please leave blank or enter a valid referral code.' };
}

/**
 * Register user in Supabase whitelist table with graceful fallback
 */
export async function registerWhitelistUser({ wallet, twitter, inviteCode, myRefCode }) {
  const cleanWallet = wallet.toLowerCase().trim();
  const cleanTwitter = twitter.startsWith('@') ? twitter.trim() : `@${twitter.trim()}`;
  const cleanInvite = inviteCode ? inviteCode.trim().toUpperCase() : null;

  try {
    const { data, error } = await supabase
      .from('whitelist')
      .insert([
        {
          wallet_address: cleanWallet,
          twitter_handle: cleanTwitter,
          discord_handle: cleanInvite ? `ref:${cleanInvite}|code:${myRefCode}` : `code:${myRefCode}`,
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

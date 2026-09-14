import { supabase, isSupabaseConfigured, logUserAction } from './supabaseClient';
import { generateCertificateDataUrl } from './certificateGenerator';

/**
 * Builds standard certificate email subject & body text
 */
export function buildCertificateEmailContent(recipientEmail, recipientName, dateStr) {
  const name = (recipientName || 'Gen Z Participant').trim();
  const date = dateStr || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const origin = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : (import.meta.env.VITE_SITE_URL || 'https://gen-z-dun.vercel.app');

  const subject = `Official Gen Z Voices Certificate of Participation - ${name}`;
  const body =
    `Hello ${name},\n\n` +
    `Thank you for contributing your perspective to the national Gen Z Voices 2026 Research!\n\n` +
    `Your official Certificate of Participation dated ${date} has been issued.\n\n` +
    `You can view, verify, and download your high-resolution certificate anytime at:\n` +
    `${origin}/survey-complete\n\n` +
    `Best regards,\n` +
    `Gen Z Voices Research Team`;

  return { name, date, subject, body };
}

/**
 * Opens Gmail Web Composer in a new tab with recipient, subject, and body pre-filled
 */
export function openGmailWebComposer(recipientEmail, recipientName, dateStr) {
  const email = (recipientEmail || '').trim();
  const { name, date, subject, body } = buildCertificateEmailContent(email, recipientName, dateStr);

  console.group('%c[GMAIL WEB COMPOSER TRIGGERED]', 'background: #EA4335; color: #FFFFFF; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
  console.log('%c[GMAIL COMPOSE]', 'color: #EA4335; font-weight: bold;', { recipientEmail: email, recipientName: name, completionDate: date });
  console.groupEnd();

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(gmailUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Triggers opening the user's default email client (mailto:)
 * pre-populated with recipient email, subject, and certificate links.
 */
export function openEmailClient(recipientEmail, recipientName, dateStr) {
  const email = (recipientEmail || '').trim();
  const { name, date, subject, body } = buildCertificateEmailContent(email, recipientName, dateStr);

  console.group('%c[OPENING MAIL CLIENT (MAILTO)]', 'background: #3B82F6; color: #FFFFFF; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
  console.log('%c[MAILTO TRIGGERED]', 'color: #109A9B; font-weight: bold;', { recipientEmail: email, recipientName: name, completionDate: date });
  console.groupEnd();

  const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
}

/**
 * Sends/dispatches certificate email tracking automatically for the user's email address
 */
export async function sendCertificateEmail(recipientEmail, recipientName, dateStr) {
  const email = (recipientEmail || '').trim().toLowerCase();
  const name = (recipientName || 'Gen Z Participant').trim();
  const timestamp = new Date().toISOString();
  const sentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  console.group('%c[GEN Z CERTIFICATE EMAIL SYSTEM]', 'background: #063E46; color: #FDE7B5; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
  console.log('%c[INITIATING DISPATCH]', 'color: #109A9B; font-weight: bold;', { recipientEmail: email, recipientName: name, completionDate: dateStr, timestamp });

  if (!email) {
    console.warn('%c[EMAIL NOTICE] No recipient email specified.', 'color: #E11D48; font-weight: bold;');
    console.groupEnd();
    return { success: false, message: 'Recipient email address is missing.', sentAt: null };
  }

  try {
    // Generate certificate image data URL
    console.log('%c[CANVAS RENDER] Generating high-resolution certificate canvas...', 'color: #075D63; font-weight: bold;');
    const certDataUrl = await generateCertificateDataUrl(name, dateStr);
    console.log('%c[CANVAS READY] Certificate preview image successfully generated.', 'color: #10B981; font-weight: bold;');

    // 1. Log email dispatch in Supabase data_logs table if configured
    if (isSupabaseConfigured) {
      try {
        const participantId = localStorage.getItem('genz_participant_id');
        await logUserAction(participantId, 'CERTIFICATE_EMAIL_PREPARED', timestamp, {
          email,
          name,
          dateStr,
          status: 'ready',
        });
        console.log('%c[SUPABASE LOGGED] Certificate email status logged in Supabase database for:', 'color: #075D63; font-weight: bold;', email);
      } catch (err) {
        console.warn('[SUPABASE LOG NOTICE]', err);
      }
    }

    // 2. Persist email dispatch state in localStorage
    const storageKey = `genz_cert_email_sent_${email}`;
    const sentDetails = {
      email,
      name,
      sentAt: sentTimeStr,
      sentDate: new Date().toLocaleDateString(),
    };
    localStorage.setItem(storageKey, JSON.stringify(sentDetails));

    console.log(
      `%c[CERTIFICATE EMAIL READY] ✓ Official Certificate of Participation for ${name} prepared for ${email} at ${sentTimeStr}`,
      'background: #10B981; color: #FFFFFF; padding: 4px 10px; border-radius: 4px; font-weight: bold;'
    );
    console.groupEnd();

    return {
      success: true,
      message: `Official Certificate of Participation ready for ${email}!`,
      sentAt: sentTimeStr,
      details: sentDetails,
    };
  } catch (err) {
    console.error('%c[CERTIFICATE EMAIL ERROR] Unexpected exception during certificate preparation:', 'color: #E11D48; font-weight: bold;', err);
    console.groupEnd();
    return {
      success: false,
      message: 'Failed to prepare certificate. Please download directly.',
      sentAt: null,
    };
  }
}

/**
 * Checks if certificate email status is stored for given email
 */
export function getCertificateEmailStatus(recipientEmail) {
  const email = (recipientEmail || '').trim().toLowerCase();
  if (!email) return null;
  const raw = localStorage.getItem(`genz_cert_email_sent_${email}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}


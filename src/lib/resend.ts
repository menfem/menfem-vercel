// ABOUTME: Resend email service configuration and utilities
// ABOUTME: Handles email sending with error logging and analytics tracking

import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  react?: React.ReactElement;
  html?: string;
  text?: string;
  replyTo?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@menfem.com',
      replyTo: options.replyTo || process.env.REPLY_TO_EMAIL,
      to: options.to,
      subject: options.subject,
      react: options.react,
      html: options.html,
      text: options.text,
    });

    // Handle Resend response structure
    if (result.error) {
      throw new Error(result.error.message);
    }

    // TODO: Log email event for analytics
    console.log('Email sent successfully:', result.data?.id);
    
    return { success: true, id: result.data?.id };
  } catch (error) {
    // TODO: Log email failure for monitoring
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendEmailBatch = async (emails: EmailOptions[]) => {
  try {
    const results = await Promise.allSettled(
      emails.map(email => sendEmail(email))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Batch email results: ${successful} sent, ${failed} failed`);
    
    return { successful, failed, results };
  } catch (error) {
    console.error('Batch email sending failed:', error);
    throw error;
  }
};
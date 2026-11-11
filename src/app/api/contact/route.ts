// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const ContactSchema = z.object({
  senderName: z.string().min(2, 'Name must be at least 2 characters').max(80),
  senderEmail: z.string().email('Please provide a valid email address'),
  intent: z.enum([
    'Enterprise Role',
    'Digital Transformation / Consulting',
    'Technical Collaboration',
  ]),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

// Lightweight in-memory rate limiter per IP
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 4;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'local-dev';
    const now = Date.now();
    const clientRecord = rateLimitMap.get(ip);

    if (clientRecord && now - clientRecord.timestamp < WINDOW_MS) {
      if (clientRecord.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please wait 60s before sending another dispatch.' },
          { status: 429 }
        );
      }
      clientRecord.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    const body = await request.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed. Please provide a valid email and message (min 10 chars).',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { senderName, senderEmail, intent, message } = parsed.data;
    const dispatchId = `DSP-${Date.now().toString(36).toUpperCase()}`;

    const apiKey = process.env.RESEND_API_KEY;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'quadri.olaniyan.eng@gmail.com';

    // Check if a real Resend API key is configured
    const hasValidKey = apiKey && apiKey.startsWith('re_') && apiKey !== 're_your_actual_api_key_here';

    if (hasValidKey) {
      const resend = new Resend(apiKey);

      const { error: resendError } = await resend.emails.send({
        from: 'QO Portfolio Dispatch <onboarding@resend.dev>',
        to: [receiverEmail],
        replyTo: senderEmail,
        subject: `[${dispatchId}] ${intent} — from ${senderName}`,
        html: `
          <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background-color: #0A0A0C; color: #F3F4F6; padding: 28px; border-radius: 12px; border: 1px solid #26262A;">
            <div style="color: #10B981; font-size: 12px; font-weight: bold; letter-spacing: 1px; margin-bottom: 12px;">
              QO // PORTFOLIO DIRECT DISPATCH [${dispatchId}]
            </div>
            <h2 style="color: #FFFFFF; font-size: 18px; margin: 0 0 16px 0;">
              New Inquiry: ${intent}
            </h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
              <tr>
                <td style="padding: 8px 0; color: #9CA3AF; width: 130px;">Sender Name:</td>
                <td style="padding: 8px 0; color: #FFFFFF; font-weight: bold;">${senderName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9CA3AF;">Reply-To Email:</td>
                <td style="padding: 8px 0; color: #10B981;">${senderEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9CA3AF;">Context:</td>
                <td style="padding: 8px 0; color: #38BDF8;">${intent}</td>
              </tr>
            </table>
            <div style="background-color: #121316; padding: 16px; border-radius: 8px; border: 1px solid #27272A; color: #E4E4E7; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            <div style="margin-top: 20px; font-size: 11px; color: #71717A;">
              Dispatched from Quadri Olaniyan Portfolio Engine • ${new Date().toISOString()}
            </div>
          </div>
        `,
      });

      if (resendError) {
        return NextResponse.json(
          { error: `Email gateway error: ${resendError.message}` },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      mode: hasValidKey ? 'LIVE_RESEND_DELIVERY' : 'LOCAL_SIMULATION_MODE',
      dispatchId,
      receivedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process contact dispatch' },
      { status: 500 }
    );
  }
}
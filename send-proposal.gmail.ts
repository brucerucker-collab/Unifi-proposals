import nodemailer from 'nodemailer';
import type { Handler } from '@netlify/functions';

type ProposalEmailRequest = {
  to: string;
  subject: string;
  proposalId: string;
  shareSlug: string;
  clientName: string;
  projectTotal: string;
  leadTimeDays: number;
};

function validate(body: Partial<ProposalEmailRequest>): string[] {
  const required: Array<keyof ProposalEmailRequest> = ['to', 'subject', 'proposalId', 'shareSlug', 'clientName', 'projectTotal', 'leadTimeDays'];
  return required.filter((key) => body[key] === undefined || body[key] === null || body[key] === '');
}

function buildEmailText(input: ProposalEmailRequest & { shareLink: string }): string {
  return [
    `Hello ${input.clientName},`,
    '',
    'Your proposal is ready for review.',
    '',
    `Proposal ID: ${input.proposalId}`,
    `Estimated project total: ${input.projectTotal}`,
    `Estimated lead time: ${input.leadTimeDays} days`,
    `Review proposal: ${input.shareLink}`,
    '',
    'This message was prepared by the Proposal OS delivery workflow.'
  ].join('\n');
}

function buildEmailHtml(input: ProposalEmailRequest & { shareLink: string }): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
      <p>Hello ${input.clientName},</p>
      <p>Your proposal is ready for review.</p>
      <p>
        <strong>Proposal ID:</strong> ${input.proposalId}<br />
        <strong>Estimated project total:</strong> ${input.projectTotal}<br />
        <strong>Estimated lead time:</strong> ${input.leadTimeDays} days
      </p>
      <p><a href="${input.shareLink}">Open proposal</a></p>
      <p>This message was prepared by the Proposal OS delivery workflow.</p>
    </div>
  `;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, status: 'failed', message: 'Method not allowed. Use POST.' }) };
  }

  let body: ProposalEmailRequest;
  try {
    body = JSON.parse(event.body || '{}') as ProposalEmailRequest;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, status: 'failed', message: 'Invalid JSON payload.' }) };
  }

  const missing = validate(body);
  if (missing.length > 0) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, status: 'failed', message: `Missing required fields: ${missing.join(', ')}` }) };
  }

  const fromEmail = process.env.GMAIL_FROM_EMAIL;
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  const siteUrl = process.env.SITE_URL || process.env.URL || '';

  if (!fromEmail || !appPassword) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, status: 'failed', message: 'Missing Gmail SMTP configuration. Set GMAIL_FROM_EMAIL and GMAIL_APP_PASSWORD.' }) };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: fromEmail, pass: appPassword }
    });

    const shareLink = siteUrl ? `${siteUrl.replace(/\/$/, '')}/p/${body.shareSlug}` : `/p/${body.shareSlug}`;

    await transporter.sendMail({
      from: fromEmail,
      to: body.to,
      subject: body.subject,
      text: buildEmailText({ ...body, shareLink }),
      html: buildEmailHtml({ ...body, shareLink })
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true, status: 'sent', message: 'Proposal email sent through Gmail SMTP.' }) };
  } catch (error) {
    console.error('send-proposal.gmail failed', error);
    return { statusCode: 500, body: JSON.stringify({ ok: false, status: 'failed', message: 'Gmail SMTP send failed.' }) };
  }
};

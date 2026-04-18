import nodemailer from 'nodemailer';

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const body = JSON.parse(event.body || '{}');
  if (!body.to) {
    return { statusCode: 400, body: 'Missing recipient email' };
  }

  const from = process.env.GMAIL_FROM_EMAIL;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!from || !pass) {
    return { statusCode: 500, body: 'Email sender not configured' };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: from, pass },
  });

  const siteUrl = process.env.SITE_URL || process.env.URL || '';
  const shareSlug = body.shareSlug || 'proposal';
  const shareLink = siteUrl ? `${siteUrl}/p/${shareSlug}` : '';

  let html = `<h2>Proposal Ready</h2><p>Hello ${body.clientName || ''},</p><p>Your proposal is ready.</p>`;
  if (shareLink) {
    html += `<p><a href="${shareLink}">View Proposal</a></p>`;
  }

  await transporter.sendMail({
    from,
    to: body.to,
    subject: body.subject || 'Proposal',
    html,
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true }),
  };
};

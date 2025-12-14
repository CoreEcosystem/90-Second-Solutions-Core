import sql from "@/app/api/utils/sql";
import { sendEmail } from "@/app/api/utils/send-email";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : null;
    const email = typeof body?.email === "string" ? body.email.trim() : null;
    const topic =
      typeof body?.topic === "string" ? body.topic.trim() : "General";
    const message =
      typeof body?.message === "string" ? body.message.trim() : null;

    if (!email || !message) {
      return Response.json(
        { error: "Email and message are required" },
        { status: 400 },
      );
    }

    const userId = null; // auth optional for this endpoint

    // Save to DB
    const insertResult = await sql(
      "INSERT INTO contact_messages (user_id, name, email, topic, message) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at",
      [userId, name, email, topic, message],
    );

    const saved = insertResult?.[0];

    // Try to send email via Resend. Don't fail the request if email fails.
    let emailSent = false;
    let emailError = null;
    try {
      const subject = `[${topic}] 90-Second Solutions Support`;
      const text =
        `New contact message` +
        `\n\nFrom: ${name || "(not provided)"} <${email}>` +
        `\nTopic: ${topic}` +
        `\nCreated: ${saved?.created_at}` +
        `\n\nMessage:\n${message}`;
      const html = `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6; color:#0f172a">
          <h2 style="margin:0 0 12px; color:#0f172a">New contact message</h2>
          <p style="margin:0 0 4px"><strong>From:</strong> ${name || "(not provided)"} &lt;${email}&gt;</p>
          <p style="margin:0 0 4px"><strong>Topic:</strong> ${topic}</p>
          <p style="margin:0 0 12px"><strong>Created:</strong> ${saved?.created_at}</p>
          <div style="padding:12px; background:#f1f5f9; border-radius:8px; white-space:pre-wrap">
            ${message.replace(/</g, "&lt;")}
          </div>
        </div>`;

      await sendEmail({
        to: "support@90secondsolutions.com",
        subject,
        text,
        html,
      });
      emailSent = true;
    } catch (err) {
      console.error("Resend email error:", err);
      emailError = err?.message || "Failed to send email";
    }

    // Auto-reply to sender (best-effort, never fails the request)
    let autoReplySent = false;
    let autoReplyError = null;
    try {
      const baseUrl = (process.env.APP_URL || "").replace(/\/$/, "");
      const ref = saved?.id ? `#${saved.id}` : "";
      const replySubject = `We got your message ${ref ? `— ref ${ref}` : ""} | 90-Second Solutions`;
      const safeMsg = message.replace(/</g, "&lt;");

      // Branded styles
      const brandColor = "#538890"; // primary brand teal
      const textColor = "#0f172a";
      const subtleText = "#334155";
      const bgSoft = "#f8fafc";
      const borderSoft = "#e2e8f0";
      const logoUrl =
        "https://ucarecdn.com/3cfbf65a-b402-47be-8ba6-2041dda41592/-/format/auto/";

      const replyText =
        `Hi${name ? ` ${name}` : ""},\n\n` +
        `We got your message${ref ? ` (ref ${ref})` : ""} and will get back to you shortly.\n\n` +
        `Manage billing: ${baseUrl}/api/subscription/portal\n` +
        `Sign in: ${baseUrl}/account/signin\n` +
        `Your profile: ${baseUrl}/profile\n\n` +
        `— 90-Second Solutions Support\n\n` +
        `Your message:\n${message}`;

      const replyHtml = `
        <div style="background:${bgSoft}; padding:24px;">
          <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid ${borderSoft}; border-radius:12px; overflow:hidden; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:${textColor}">
            <!-- Header -->
            <div style="display:flex; align-items:center; gap:12px; padding:18px 20px; border-bottom:1px solid ${borderSoft};">
              <img src="${logoUrl}" alt="90-Second Solutions" width="32" height="32" style="display:block; border-radius:6px" />
              <div style="font-weight:700; font-size:16px; color:${textColor}">90-Second Solutions</div>
            </div>

            <!-- Body -->
            <div style="padding:20px">
              <h1 style="margin:0 0 8px; font-size:20px; color:${textColor}">We got your message${ref ? ` (ref ${ref})` : ""}</h1>
              <p style="margin:0 0 16px; color:${subtleText}">Thanks${name ? `, ${name}` : ""}. Our team will reply as soon as we can.</p>

              <div style="margin:16px 0; padding:14px; background:${bgSoft}; border:1px solid ${borderSoft}; border-radius:8px;">
                <div style="margin:0 0 8px; font-weight:600; color:${textColor}">Your message</div>
                <div style="white-space:pre-wrap; color:${textColor}">${safeMsg}</div>
              </div>

              <div style="margin-top:18px;">
                <div style="margin:0 0 8px; font-weight:600; color:${textColor}">Quick links</div>
                <div>
                  <a href="${baseUrl}/account/signin" style="display:inline-block; margin-right:8px; padding:10px 14px; background:${brandColor}; color:#ffffff; text-decoration:none; border-radius:999px; font-weight:600;">Sign in</a>
                  <a href="${baseUrl}/profile" style="display:inline-block; margin-right:8px; padding:10px 14px; border:1px solid ${brandColor}; color:${brandColor}; text-decoration:none; border-radius:999px; font-weight:600;">Your profile</a>
                  <a href="${baseUrl}/api/subscription/portal" style="display:inline-block; padding:10px 14px; border:1px solid ${borderSoft}; color:${textColor}; text-decoration:none; border-radius:999px;">Manage billing</a>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding:14px 20px; border-top:1px solid ${borderSoft}; font-size:12px; color:${subtleText}">
              © 2025 90-Second Solutions • A CORE Method™ for Emotional Regulation & Clarity
            </div>
          </div>
        </div>`;

      await sendEmail({
        to: email,
        subject: replySubject,
        text: replyText,
        html: replyHtml,
      });
      autoReplySent = true;
    } catch (err) {
      console.error("Auto-reply email error:", err);
      autoReplyError = err?.message || "Failed to send auto-reply";
    }

    return Response.json({
      ok: true,
      id: saved?.id,
      createdAt: saved?.created_at,
      emailSent,
      emailError,
      autoReplySent,
      autoReplyError,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}

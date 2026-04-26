const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"PaySplit" <${process.env.EMAIL_USER}>`,
    to, subject, html,
  });
};

exports.sendInviteEmail = async (to, groupName, inviterName, link) => {
  const html = `
    <h2>You've been invited to a group!</h2>
    <p><strong>${inviterName}</strong> has invited you to join <strong>${groupName}</strong> on PaySplit.</p>
    <a href="${link}" style="background:#6c63ff;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">Join Group</a>
  `;
  await exports.sendEmail({ to, subject: `Join ${groupName} on PaySplit`, html });
};

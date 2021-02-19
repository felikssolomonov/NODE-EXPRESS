const { emailFrom, baseUrl } = require("../keys");

module.exports = function (email, token) {
  return {
    from: emailFrom,
    to: email,
    subject: "Password recovery",
    html: `
        <p>Follow the link below</p>
        <a href="${baseUrl}/auth/password/${token}">Restore password</a>
        <hr/>
        <a href="${baseUrl}">Go to the site</a>
    `,
  };
};

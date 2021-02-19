const { emailFrom, baseUrl } = require("../keys");

module.exports = function (email) {
  return {
    from: emailFrom,
    to: email,
    subject: "Account created!",
    html: `
        <h1>Welcome to our internet shop!</h1>
        <p>Your account by email(${email}) successfully created!</p>
        <hr/>
        <a href="${baseUrl}">Go to the site</a>
    `,
  };
};

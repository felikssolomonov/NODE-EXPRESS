const password = "sviFRrX7Dv3hTUyv";
const dbName = "historyContent";
const connection =
  "mongodb+srv://Daniel:" + password + "@cluster0.paa0o.mongodb.net/" + dbName;

module.exports = {
  connectionDB: connection,
  sessionSecret: "code",
  sendGridKey:
    "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",
  emailFrom: "felikssolomonov@gmail.com",
  baseUrl: "http://localhost:3000",
};

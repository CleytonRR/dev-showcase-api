const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);

function shouldUseSsl() {
  if (process.env.DATABASE_SSL === "true") return true;
  if (process.env.DATABASE_SSL === "false") return false;

  try {
    const host = new URL(process.env.DATABASE_URL).hostname;
    return !localHosts.has(host);
  } catch {
    return false;
  }
}

module.exports = () =>
  shouldUseSsl() ? { ssl: { require: true, rejectUnauthorized: false } } : {};

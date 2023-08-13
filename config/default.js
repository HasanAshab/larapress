module.exports = {
  app: {
    name: "Samer",
    protocol: "http",
    domain: "127.0.0.1",
    port: 8000,
    key: "621f6b72ebfdfdb50d3f20c97515e9454043b9789550b4e913e3847d4fcc5eec",
    state: "up"
  },
  client: {
    domain: "127.0.0.1",
    port: 3000
  },
  stripe: {
    key: "sk_test_51MGknmLkLQPFd1VwBCU9EYKJC6NRwY4Y2pJuuo3nPVJlUCLgUBfbY5sOEpkA8oKJkAQ1XTKRlFboNKGZeTgqoMFw00OfAl908c"
  },
  vapid: {
    publicKey: "BKa4dsG_M6aRjsKYBjW_gKXjfVJ1AwDKTz106fLEaaH9QRykhDn1TSWnYeGN8IEO5N7yso36nbYFPLkk_bHRqOs",
    privateKey: "6zO25rDm7gh3EOiaGiiQ-yA_KXxhGGu1jN5QF-90MfI"
  },
  db: {
    connect: true,
    url: "mongodb+srv://haoronaldo18:Haomao.18205@cluster0.jqufz1a.mongodb.net/?retryWrites=true&w=majority",
    maxPoolSize: 1
  },
  redis: {
    url: "redis://localhost:6379"
  },
  bcrypt: {
    rounds: 10,
  },
  socialite: {
    google: {
      clientId: "574177695590-6ta430f91sjtfmepvjskhvrf81ncbo0c.apps.googleusercontent.com",
      clientSecret: "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",
      redirectUrl: "http://localhost:8000/api/v1/auth/callback/google"
    }
  },
  recaptcha: {
    siteKey: "6LcCwIknAAAAANu-Lsiie8YIRWVLzTRXV9n0Qu-l",
    secretKey: "6LcCwIknAAAAAJ4bLQ5z-56oXcmtK6GQGvhL3r9J"
  },
  mail: {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    username: "28786b42db2778",
    password: "f1f4faf0316dd7",
    fromName: "Samer",
    fromAddress: "noreply@Samer.com",
    encryption: "tls"
  },
  twilio: {
    sid: "AC8a263aa117170b2087eeac0c919ebe6a",
    authToken: "3a915d718cb1ecd3f25112dd3ac38e1b",
    phoneNumber: "+15005550006"
  },
  cache: "redis",
  log: "file"
};

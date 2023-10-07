module.exports = {
  app: {
    name: "Samer",
    protocol: "http",
    domain: "127.0.0.1",
    port: 8000,//env("PORT", 8000),
    key: "foo bar",//env("APP_KEY", null),
    state: "up"
  },
  loadBalancer: {
    enabled: false,
    ports: [3000, 3001, 3002]
  },
  client: {
    protocol: "http",
    domain: "localhost",
    port: 5000
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
    options: {
      maxPoolSize: 1,
    }
  },
  redis: {
    url: "redis://raAjgzb9ceMv8MVUFzSl7cY6DFJC3MR1@redis-12100.c305.ap-south-1-1.ec2.cloud.redislabs.com:12100",
    host: "redis-12100.c305.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 12100,
    password: "raAjgzb9ceMv8MVUFzSl7cY6DFJC3MR1",
    maxRetriesPerRequest: null
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
  notification: {
    channels: ["site", "email"],
    types: ["announcement", "feature", "others"]
  },
  twilio: {
    sid: "AC8a263aa117170b2087eeac0c919ebe6a",
    authToken: "3a915d718cb1ecd3f25112dd3ac38e1b",
    phoneNumber: "+15005550006"
  },
  cache: {
    default: "memory",
    drivers: ["memory", "redis"]
  },
  log: "console",
  errorMessages: {
    404: "Not Found",
    403: "You don't have permission to access this resource",
    401: "Unauthorized"
  },
  urls: {
    "email.verify": "api/v1/auth/verify/:id",
    "file.serve": "api/files/:path",
    "client.password.reset": "/password/reset/:id"
  },
  twoFactorAuth: {
    methods: ["app", "sms", "call"] 
  }
} as const;

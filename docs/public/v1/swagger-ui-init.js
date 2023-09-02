
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "swagger": "2.0",
    "info": {
      "title": "Samer API Docs",
      "version": "v1"
    },
    "host": "http://127.0.0.1:8000/",
    "basePath": "/api/v1",
    "schemes": [
      "http"
    ],
    "paths": {
      "/users/": {
        "get": {
          "summary": "Get all users",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "data": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "example": {
                        "username": "Destini",
                        "email": "Gregorio91@yahoo.com",
                        "phoneNumber": "+15005550006",
                        "password": "$2a$10$GDX4uWSk4bnj5YEde3.LneT1yNyZZFhAXCPO9MkXGEmPJVSIb4jZi",
                        "verified": true
                      }
                    }
                  },
                  "next": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: admin",
          "parameters": []
        }
      },
      "/users/me": {
        "get": {
          "summary": "Get own profile",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "data": {
                    "type": "object",
                    "example": {
                      "username": "Irving",
                      "email": "Hilma.Koch@hotmail.com",
                      "phoneNumber": "+15005550006",
                      "password": "$2a$10$GDX4uWSk4bnj5YEde3.LneT1yNyZZFhAXCPO9MkXGEmPJVSIb4jZi",
                      "verified": true
                    }
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: novice",
          "parameters": []
        },
        "put": {
          "summary": "Update own user details",
          "validationPath": "Auth/UpdateProfile",
          "cached": false,
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: novice",
          "parameters": []
        }
      },
      "/users/{username}/": {
        "get": {
          "summary": "Get a specific users profile",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "data": {
                    "type": "object",
                    "example": {
                      "username": "Maritza",
                      "email": "Jesus_Considine@yahoo.com",
                      "phoneNumber": "+15005550006",
                      "password": "$2a$10$GDX4uWSk4bnj5YEde3.LneT1yNyZZFhAXCPO9MkXGEmPJVSIb4jZi",
                      "verified": true
                    }
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: novice",
          "parameters": []
        },
        "delete": {
          "summary": "Delete user",
          "responses": {
            "204": {
              "description": "User deleted"
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: admin",
          "parameters": []
        }
      },
      "/users/{username}/make-admin": {
        "put": {
          "summary": "Give Admin role to a User",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: admin",
          "parameters": []
        }
      },
      "/settings/app": {
        "get": {
          "summary": "Get app settings (CONFIG)",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "data": {
                    "type": "object",
                    "example": {
                      "app": {
                        "name": "Samer",
                        "protocol": "http",
                        "domain": "127.0.0.1",
                        "port": "8000",
                        "key": "621f6b72ebfdfdb50d3f20c97515e9454043b9789550b4e913e3847d4fcc5eec",
                        "state": "up"
                      },
                      "loadBalancer": {
                        "enabled": false,
                        "ports": [
                          3000,
                          3001,
                          3002
                        ]
                      },
                      "client": {
                        "protocol": "http",
                        "domain": "localhost",
                        "port": 5000
                      },
                      "stripe": {
                        "key": "sk_test_51MGknmLkLQPFd1VwBCU9EYKJC6NRwY4Y2pJuuo3nPVJlUCLgUBfbY5sOEpkA8oKJkAQ1XTKRlFboNKGZeTgqoMFw00OfAl908c"
                      },
                      "vapid": {
                        "publicKey": "BKa4dsG_M6aRjsKYBjW_gKXjfVJ1AwDKTz106fLEaaH9QRykhDn1TSWnYeGN8IEO5N7yso36nbYFPLkk_bHRqOs",
                        "privateKey": "6zO25rDm7gh3EOiaGiiQ-yA_KXxhGGu1jN5QF-90MfI"
                      },
                      "db": {
                        "connect": true,
                        "url": "mongodb+srv://haoronaldo18:Haomao.18205@cluster0.jqufz1a.mongodb.net/?retryWrites=true&w=majority",
                        "maxPoolSize": 1
                      },
                      "redis": {
                        "url": "redis://default:raAjgzb9ceMv8MVUFzSl7cY6DFJC3MR1@redis-12100.c305.ap-south-1-1.ec2.cloud.redislabs.com:12100"
                      },
                      "bcrypt": {
                        "rounds": 10
                      },
                      "socialite": {
                        "google": {
                          "clientId": "574177695590-6ta430f91sjtfmepvjskhvrf81ncbo0c.apps.googleusercontent.com",
                          "clientSecret": "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",
                          "redirectUrl": "http://localhost:8000/api/v1/auth/callback/google"
                        }
                      },
                      "recaptcha": {
                        "siteKey": "6LcCwIknAAAAANu-Lsiie8YIRWVLzTRXV9n0Qu-l",
                        "secretKey": "6LcCwIknAAAAAJ4bLQ5z-56oXcmtK6GQGvhL3r9J"
                      },
                      "mail": {
                        "host": "sandbox.smtp.mailtrap.io",
                        "port": 2525,
                        "username": "28786b42db2778",
                        "password": "f1f4faf0316dd7",
                        "fromName": "Samer",
                        "fromAddress": "noreply@Samer.com",
                        "encryption": "tls"
                      },
                      "twilio": {
                        "sid": "AC8a263aa117170b2087eeac0c919ebe6a",
                        "authToken": "3a915d718cb1ecd3f25112dd3ac38e1b",
                        "phoneNumber": "+15005550006"
                      },
                      "cache": "redis",
                      "log": "file"
                    }
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: admin",
          "parameters": []
        },
        "put": {
          "summary": "Update app settings (CONFIG)",
          "validationPath": "Settings/UpdateAppSettings",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: admin",
          "parameters": []
        }
      },
      "/settings/enable-2fa": {
        "post": {
          "summary": "Enable Two Factor Authentication (2FA)",
          "validationPath": "Settings/EnableTwoFactorAuth",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: novice",
          "parameters": []
        }
      },
      "/settings/": {
        "get": {
          "summary": "Get user settings",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "data": {
                    "type": "object",
                    "example": {
                      "userId": "64f3b90c5250fe4f72ebfd72",
                      "twoFactorAuth": {
                        "enabled": false,
                        "method": "sms"
                      },
                      "notification": {
                        "announcement": {
                          "site": true,
                          "email": true
                        },
                        "feature": {
                          "site": true,
                          "email": true
                        },
                        "others": {
                          "site": true,
                          "email": true
                        }
                      },
                      "_id": "64f3b90c5250fe4f72ebfd73"
                    }
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: novice",
          "parameters": []
        }
      },
      "/settings/notification": {
        "put": {
          "summary": "Update user notification settings",
          "validationPath": "Settings/Notification",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: novice",
          "parameters": []
        }
      },
      "/notifications/": {
        "get": {
          "summary": "Get all notifications",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "data": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "example": {
                        "userId": "64f3b90c5250fe4f72ebfd74",
                        "data": {
                          "text": "Quis expedita architecto natus. Ipsa tenetur ipsa expedita. Reprehenderit aliquam sunt ratione nostrum provident ipsa.\nVel necessitatibus laudantium hic ea nihil rerum repellat dicta tempore. Excepturi et molestiae minus saepe. Qui fugiat quia dolorum voluptates sint aspernatur.\nMolestias architecto aliquam magnam illum nobis ut. Tempora in aspernatur itaque beatae autem exercitationem deleniti ut quidem. Quibusdam atque deleniti repellat molestiae eligendi voluptatum."
                        },
                        "readAt": "2023-09-02T22:37:00.079Z"
                      }
                    }
                  },
                  "next": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: novice",
          "parameters": []
        }
      },
      "/notifications/unread-count": {
        "get": {
          "summary": "Get unread notifications count",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "data": {
                    "type": "object",
                    "properties": {
                      "count": {
                        "type": "number"
                      }
                    }
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: novice",
          "parameters": []
        }
      },
      "/notifications/{id}": {
        "post": {
          "summary": "Mark notification as read",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: novice",
          "parameters": []
        },
        "delete": {
          "summary": "Remove notification",
          "responses": {
            "204": {
              "description": "Notification deleted"
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: novice",
          "parameters": []
        }
      },
      "/files/{id}": {
        "get": {
          "summary": "Serve file",
          "responses": {
            "200": {
              "description": "File"
            }
          },
          "parameters": []
        }
      },
      "/dashboard/admin": {
        "get": {
          "summary": "Get dashboard",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "data": {
                    "type": "object",
                    "properties": {
                      "totalUsers": "number",
                      "newUsersToday": "number"
                    }
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: admin",
          "parameters": []
        }
      },
      "/auth/change-phone-number": {
        "put": {
          "summary": "Set or Update user's phone number",
          "validationPath": "Auth/ChangePhoneNumber",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: novice",
          "parameters": []
        }
      },
      "/auth/register": {
        "post": {
          "summary": "Sign-up a User",
          "description": "Returns api token and verification email will be sent to user",
          "validationPath": "Auth/Register",
          "responses": {
            "201": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "message": {
                    "type": "string"
                  },
                  "data": {
                    "type": "object",
                    "properties": {
                      "token": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          },
          "parameters": []
        }
      },
      "/auth/send-otp": {
        "post": {
          "summary": "Send One Time Password (OTP) code to user's phone number",
          "validationPath": "Auth/SendOtp",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "parameters": []
        }
      },
      "/auth/verify/resend": {
        "post": {
          "summary": "Resend account verification email",
          "validationPath": "Auth/ResendEmailVerification",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "parameters": []
        }
      },
      "/auth/password/change": {
        "put": {
          "summary": "Change password",
          "validationPath": "Auth/ChangePassword",
          "cached": false,
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: novice",
          "parameters": []
        }
      },
      "/auth/password/reset/": {
        "put": {
          "summary": "Reset password",
          "validationPath": "Auth/ResetPassword",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "parameters": []
        }
      },
      "/auth/password/reset/send-email": {
        "post": {
          "summary": "Forgot password",
          "description": "This will sent an password reset email if user is exist on the app",
          "validationPath": "Auth/SendPasswordResetEmail",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "parameters": []
        }
      },
      "/auth/login/google": {
        "get": {
          "summary": "Login a User (Google)",
          "responses": {
            "302": {
              "schema": {
                "type": "object",
                "description": "User is redirected to google auth"
              }
            }
          },
          "parameters": []
        }
      },
      "/auth/login/": {
        "post": {
          "summary": "Login a User",
          "description": "Returns api token if credentials match",
          "validationPath": "Auth/Login",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "message": {
                    "type": "string"
                  },
                  "data": {
                    "type": "object",
                    "properties": {
                      "token": {
                        "type": "string"
                      }
                    }
                  },
                  "twoFactorAuthRequired": {
                    "type": "boolean",
                    "description": "if its true then you need to pass otp also"
                  }
                }
              }
            }
          },
          "parameters": []
        }
      },
      "/admin/categories/": {
        "get": {
          "summary": "Get all categories",
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "data": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "example": {
                        "name": "Fantastic Frozen Pizza",
                        "slug": "ea-quo-nisi"
                      }
                    }
                  },
                  "next": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: admin",
          "parameters": []
        }
      },
      "/admin/categories/{id}": {
        "get": {
          "summary": "Get a specific category",
          "cached": false,
          "responses": {
            "200": {
              "schema": {
                "type": "object",
                "properties": {
                  "success": {
                    "type": "boolean"
                  },
                  "data": {
                    "type": "object",
                    "example": {
                      "name": "Tasty Metal Mouse",
                      "slug": "eaque-praesentium-quidem"
                    }
                  }
                }
              }
            }
          },
          "description": "Need Authentication (Bearer Token).\n Role: admin",
          "parameters": []
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.preauthorizeApiKey) {
    const key = customOptions.preauthorizeApiKey.authDefinitionKey;
    const value = customOptions.preauthorizeApiKey.apiKeyValue;
    if (!!key && !!value) {
      const pid = setInterval(() => {
        const authorized = ui.preauthorizeApiKey(key, value);
        if(!!authorized) clearInterval(pid);
      }, 500)

    }
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}

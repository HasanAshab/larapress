
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
      "title": "undefined API Docs",
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
                        "username": "Claude",
                        "email": "Hilda.Ernser@gmail.com",
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
                      "username": "Zoe",
                      "email": "Immanuel.Lebsack83@yahoo.com",
                      "phoneNumber": "+15005550006",
                      "password": "$2a$10$GDX4uWSk4bnj5YEde3.LneT1yNyZZFhAXCPO9MkXGEmPJVSIb4jZi",
                      "verified": true
                    }
                  }
                }
              }
            }
          },
          "parameters": []
        },
        "put": {
          "summary": "Update own user details",
          "validationPath": "Auth/UpdateProfile",
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
                      "username": "Monserrate",
                      "email": "Rex_Green73@gmail.com",
                      "phoneNumber": "+15005550006",
                      "password": "$2a$10$GDX4uWSk4bnj5YEde3.LneT1yNyZZFhAXCPO9MkXGEmPJVSIb4jZi",
                      "verified": true
                    }
                  }
                }
              }
            }
          },
          "parameters": []
        },
        "delete": {
          "summary": "Delete user",
          "responses": {
            "204": {
              "description": "User deleted"
            }
          },
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
          "parameters": []
        }
      },
      "/settings/app": {
        "get": {
          "summary": "Get app settings (ENV)",
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
                        "port": 8000,
                        "key": "621f6b72ebfdfdb50d3f20c97515e9454043b9789550b4e913e3847d4fcc5eec",
                        "state": "up"
                      },
                      "client": {
                        "domain": "127.0.0.1",
                        "port": 3000
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
                        "url": "redis://localhost:6379"
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
          "parameters": []
        },
        "put": {
          "summary": "Update app settings (ENV)",
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
          "parameters": [
            {
              "name": "app",
              "in": "body",
              "type": "object",
              "required": false,
              "properties": {
                "name": {
                  "type": "string"
                },
                "protocol": {
                  "type": "string"
                },
                "domain": {
                  "type": "string"
                },
                "port": {
                  "type": "string"
                },
                "key": {
                  "type": "string"
                },
                "state": {
                  "type": "string"
                }
              }
            },
            {
              "name": "client",
              "in": "body",
              "type": "object",
              "required": false,
              "properties": {
                "domain": {
                  "type": "string"
                },
                "port": {
                  "type": "string"
                }
              }
            },
            {
              "name": "stripe",
              "in": "body",
              "type": "object",
              "required": false,
              "properties": {
                "key": {
                  "type": "string"
                }
              }
            },
            {
              "name": "vapid",
              "in": "body",
              "type": "object",
              "required": false,
              "properties": {
                "publicKey": {
                  "type": "string"
                },
                "privateKey": {
                  "type": "string"
                }
              }
            },
            {
              "name": "db",
              "in": "body",
              "type": "object",
              "required": false,
              "properties": {
                "connect": {
                  "type": "string"
                },
                "url": {
                  "type": "string"
                },
                "maxPoolSize": {
                  "type": "string"
                }
              }
            },
            {
              "name": "redis",
              "in": "body",
              "type": "object",
              "required": false,
              "properties": {
                "url": {
                  "type": "string"
                }
              }
            },
            {
              "name": "bcrypt",
              "in": "body",
              "type": "object",
              "required": false,
              "properties": {
                "rounds": {
                  "type": "string"
                }
              }
            },
            {
              "name": "socialite",
              "in": "body",
              "type": "object",
              "required": false,
              "properties": {
                "google": {
                  "type": "object"
                }
              }
            },
            {
              "name": "recaptcha",
              "in": "body",
              "type": "object",
              "required": false,
              "properties": {
                "siteKey": {
                  "type": "string"
                },
                "secretKey": {
                  "type": "string"
                }
              }
            },
            {
              "name": "mail",
              "in": "body",
              "type": "object",
              "required": false,
              "properties": {
                "host": {
                  "type": "string"
                },
                "port": {
                  "type": "string"
                },
                "username": {
                  "type": "string"
                },
                "password": {
                  "type": "string"
                },
                "fromName": {
                  "type": "string"
                },
                "fromAddress": {
                  "type": "string"
                },
                "encryption": {
                  "type": "string"
                }
              }
            },
            {
              "name": "twilio",
              "in": "body",
              "type": "object",
              "required": false,
              "properties": {
                "sid": {
                  "type": "string"
                },
                "authToken": {
                  "type": "string"
                },
                "phoneNumber": {
                  "type": "string"
                }
              }
            },
            {
              "name": "cache",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "log",
              "in": "body",
              "type": "string",
              "required": false
            }
          ]
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
          "parameters": [
            {
              "name": "method",
              "in": "body",
              "type": "string",
              "required": true
            },
            {
              "name": "otp",
              "in": "body",
              "type": "number",
              "required": true
            }
          ]
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
                      "userId": "64d96082d9dcd3494e92c645",
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
                      "_id": "64d96082d9dcd3494e92c646"
                    }
                  }
                }
              }
            }
          },
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
          "parameters": [
            {
              "name": "announcement",
              "in": "body",
              "type": "object",
              "required": false,
              "properties": {
                "site": {
                  "type": "boolean"
                },
                "email": {
                  "type": "boolean"
                }
              }
            },
            {
              "name": "feature",
              "in": "body",
              "type": "object",
              "required": false,
              "properties": {
                "site": {
                  "type": "boolean"
                },
                "email": {
                  "type": "boolean"
                }
              }
            },
            {
              "name": "others",
              "in": "body",
              "type": "object",
              "required": false,
              "properties": {
                "site": {
                  "type": "boolean"
                },
                "email": {
                  "type": "boolean"
                }
              }
            }
          ]
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
                        "notifiableId": "64d96082d9dcd3494e92c647",
                        "notifiableType": "User",
                        "data": {
                          "text": "Commodi ea voluptates voluptas commodi ut autem. Dolore iusto qui ratione. Ipsa temporibus repellat ab.\nSapiente vero libero. Architecto excepturi commodi. Quidem maxime debitis praesentium error sint iure esse ipsum.\nNemo dolor vero optio alias quod quae corporis corrupti eveniet. Laboriosam consequuntur facilis veniam unde. Rerum libero tempora facere corrupti."
                        },
                        "readAt": "2023-08-13T23:00:18.119Z"
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
          "parameters": []
        },
        "delete": {
          "summary": "Remove notification",
          "responses": {
            "204": {
              "description": "Notification deleted"
            }
          },
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
          "parameters": []
        }
      },
      "/auth/change-phone-number": {
        "Put": {
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
          "parameters": [
            {
              "name": "phoneNumber",
              "in": "body",
              "type": "string",
              "required": true
            }
          ]
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
          "parameters": [
            {
              "name": "username",
              "in": "body",
              "type": "string",
              "required": true
            },
            {
              "name": "email",
              "in": "body",
              "type": "string",
              "required": true
            },
            {
              "name": "password",
              "in": "body",
              "type": "string",
              "required": true
            }
          ],
          "consumes": [
            "multipart/form-data"
          ]
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
          "parameters": [
            {
              "name": "userId",
              "in": "body",
              "type": "string",
              "required": true
            },
            {
              "name": "method",
              "in": "body",
              "type": "string",
              "required": true
            }
          ]
        }
      },
      "/auth/verify/resend": {
        "get": {
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
          "parameters": [
            {
              "name": "email",
              "in": "body",
              "type": "string",
              "required": true
            }
          ]
        }
      },
      "/auth/verify/{id}": {
        "get": {
          "summary": "Verify User account",
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
          "parameters": [
            {
              "name": "oldPassword",
              "in": "body",
              "type": "string",
              "required": true
            },
            {
              "name": "password",
              "in": "body",
              "type": "string",
              "required": true
            }
          ]
        }
      },
      "/auth/password/forgot": {
        "post": {
          "summary": "Forgot password",
          "description": "This will sent an password reset email if user is exist on the app",
          "validationPath": "Auth/ForgotPassword",
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
          "parameters": [
            {
              "name": "email",
              "in": "body",
              "type": "string",
              "required": true
            }
          ]
        }
      },
      "/auth/password/reset": {
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
          "parameters": [
            {
              "name": "id",
              "in": "body",
              "type": "string",
              "required": true
            },
            {
              "name": "password",
              "in": "body",
              "type": "string",
              "required": true
            },
            {
              "name": "token",
              "in": "body",
              "type": "string",
              "required": true
            }
          ]
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
          "parameters": [
            {
              "name": "email",
              "in": "body",
              "type": "string",
              "required": true
            },
            {
              "name": "password",
              "in": "body",
              "type": "string",
              "required": true
            },
            {
              "name": "otp",
              "in": "body",
              "type": "number",
              "required": false
            }
          ]
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
                        "name": "Rustic Frozen Mouse",
                        "slug": "voluptatum-possimus-voluptatem"
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
          "parameters": []
        }
      },
      "/admin/categories/{id}": {
        "get": {
          "summary": "Get a specific category",
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
                      "name": "Refined Concrete Salad",
                      "slug": "nemo-non-consectetur"
                    }
                  }
                }
              }
            }
          },
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

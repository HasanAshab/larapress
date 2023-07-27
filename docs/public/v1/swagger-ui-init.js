
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
          "description": "need auth-token, admin",
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
                        "username": "Filiberto",
                        "email": "Orland40@hotmail.com",
                        "phoneNumber": "+15005550006",
                        "password": "$2a$10$GDX4uWSk4bnj5YEde3.LneT1yNyZZFhAXCPO9MkXGEmPJVSIb4jZi",
                        "emailVerified": true
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
      "/users/{username}": {
        "get": {
          "summary": "Get a specific users profile",
          "description": "need auth-token",
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
                      "username": "Sven",
                      "email": "Lue16@yahoo.com",
                      "phoneNumber": "+15005550006",
                      "password": "$2a$10$GDX4uWSk4bnj5YEde3.LneT1yNyZZFhAXCPO9MkXGEmPJVSIb4jZi",
                      "emailVerified": true
                    }
                  }
                }
              }
            }
          },
          "parameters": []
        }
      },
      "/users/{id}/": {
        "delete": {
          "summary": "Delete user",
          "description": "need auth-token, admin",
          "responses": {
            "204": {
              "description": "User deleted"
            }
          },
          "parameters": []
        }
      },
      "/users/{id}/make-admin": {
        "put": {
          "summary": "Give Admin role to a User",
          "description": "need auth-token, admin",
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
          "description": "need auth-token, admin",
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
                      "appName": "Samer",
                      "appProtocol": "http",
                      "appDomain": "127.0.0.1",
                      "appPort": "8000",
                      "appKey": "621f6b72ebfdfdb50d3f20c97515e9454043b9789550b4e913e3847d4fcc5eec",
                      "appState": "up",
                      "stripeKey": "sk_test_51MGknmLkLQPFd1VwBCU9EYKJC6NRwY4Y2pJuuo3nPVJlUCLgUBfbY5sOEpkA8oKJkAQ1XTKRlFboNKGZeTgqoMFw00OfAl908c",
                      "publicVapidKey": "BKa4dsG_M6aRjsKYBjW_gKXjfVJ1AwDKTz106fLEaaH9QRykhDn1TSWnYeGN8IEO5N7yso36nbYFPLkk_bHRqOs",
                      "privateVapidKey": "6zO25rDm7gh3EOiaGiiQ-yA_KXxhGGu1jN5QF-90MfI",
                      "clientDomain": "127.0.0.1",
                      "clientPort": "3000",
                      "nodeEnv": "development",
                      "dbConnect": "true",
                      "dbUrl": "mongodb+srv://haoronaldo18:Haomao.18205@cluster0.jqufz1a.mongodb.net/?retryWrites=true&w=majority",
                      "redisUrl": "redis://default:raAjgzb9ceMv8MVUFzSl7cY6DFJC3MR1@redis-12100.c305.ap-south-1-1.ec2.cloud.redislabs.com:12100",
                      "tokenLifespan": "2592000",
                      "bcryptRounds": "10",
                      "mailHost": "sandbox.smtp.mailtrap.io",
                      "mailPort": "2525",
                      "mailUsername": "28786b42db2778",
                      "mailPassword": "f1f4faf0316dd7",
                      "mailFromName": "Samer",
                      "mailFromAddress": "noreply@Samer.com",
                      "mailEncryption": "tls",
                      "twilioSid": "AC8a263aa117170b2087eeac0c919ebe6a",
                      "twilioAuthToken": "3a915d718cb1ecd3f25112dd3ac38e1b",
                      "twilioVerifyServiceSid": "VA512d3c99748262ac86f6a3d137c1ec53",
                      "twilioPhoneNumber": "+15005550006",
                      "cache": "redis",
                      "tracePerformance": "false",
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
          "description": "need auth-token, admin",
          "validationPath": "Settings/Update",
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
      "/settings/enable-2fa": {
        "post": {
          "summary": "Enable Two Factor Authentication (2FA) for a user",
          "description": "need auth-token",
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
              "required": false
            },
            {
              "name": "phoneNumber",
              "in": "body",
              "type": "string",
              "required": false
            }
          ]
        }
      },
      "/settings/": {
        "get": {
          "summary": "Get user settings",
          "description": "need auth-token",
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
                      "userId": "64c1c4ba9af2eae259a98798",
                      "notification": {
                        "enabled": true,
                        "email": true,
                        "push": true
                      },
                      "twoFactorAuth": {
                        "enabled": false,
                        "method": "sms"
                      },
                      "_id": "64c1c4ba9af2eae259a98799"
                    }
                  }
                }
              }
            }
          },
          "parameters": []
        }
      },
      "/notifications/": {
        "get": {
          "summary": "Get all notifications",
          "description": "need auth-token",
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
                        "notifiableId": "64c1c4ba9af2eae259a9879a",
                        "notifiableType": "User",
                        "data": {
                          "text": "Iure dolore fugiat quis numquam eveniet neque quo. Praesentium possimus eligendi magnam culpa modi asperiores blanditiis. Quae dolorem distinctio pariatur dolore commodi tempore quas consectetur perspiciatis.\nDolore odio culpa id sequi dolorem maxime. Architecto dignissimos veritatis. Consequuntur fugiat reprehenderit fuga quo.\nSimilique eveniet illum. Ea suscipit odio expedita enim. Quidem voluptate ea adipisci officia iure fuga iusto."
                        },
                        "readAt": "2023-07-27T01:13:30.384Z"
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
          "description": "need auth-token",
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
          "description": "need auth-token",
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
          "description": "need auth-token",
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
          "description": "need signature",
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
          "description": "need auth-token, admin",
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
      "/auth/login": {
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
      "/auth/profile": {
        "get": {
          "summary": "Get user details",
          "description": "need bearer token",
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
                      "username": "Dayton",
                      "email": "Antoinette40@hotmail.com",
                      "phoneNumber": "+15005550006",
                      "password": "$2a$10$GDX4uWSk4bnj5YEde3.LneT1yNyZZFhAXCPO9MkXGEmPJVSIb4jZi",
                      "emailVerified": true
                    }
                  }
                }
              }
            }
          },
          "parameters": []
        },
        "put": {
          "summary": "Update user details",
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
          "parameters": [
            {
              "name": "username",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "email",
              "in": "body",
              "type": "string",
              "required": false
            }
          ],
          "consumes": [
            "multipart/form-data"
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
            },
            {
              "name": "password_confirmation",
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
          "description": "Need Signature",
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
      "/auth/send-otp/{id}": {
        "post": {
          "summary": "Send One Time Password (OTP) code to user's phone number",
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
          "description": "need bearer token",
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
      "/admin/categories/": {
        "get": {
          "summary": "Get all categories",
          "description": "need auth-token, admin",
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
                        "name": "Electronic Fresh Car",
                        "slug": "dolorem-blanditiis-magni"
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
          "description": "need auth-token, admin",
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
                      "name": "Unbranded Wooden Soap",
                      "slug": "inventore-ducimus-sunt"
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


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
                        "username": "Fannie",
                        "email": "Devyn66@yahoo.com",
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
                      "username": "Ethyl",
                      "email": "Adaline0@hotmail.com",
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
                        "notifiableId": "64bdeadb6f37922ce0fa2c31",
                        "notifiableType": "User",
                        "data": {
                          "text": "Harum suscipit nostrum et. Suscipit natus beatae earum at incidunt ea mollitia velit. Quos voluptatem numquam repellendus.\nLabore quaerat aliquam porro similique veritatis incidunt ipsum. Atque eligendi sunt modi nihil. Aliquid qui cupiditate.\nAtque est veniam fugit. Eum magni animi aliquid saepe fugiat voluptatem hic incidunt quis. Harum perferendis commodi sapiente debitis velit aliquam quasi eius doloribus."
                        },
                        "readAt": "2023-07-24T03:07:07.487Z"
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
                      "username": "Aliyah",
                      "email": "Pamela.McGlynn58@yahoo.com",
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
              "name": "old_password",
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
      "/admin/dashboard": {
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
      "/admin/settings": {
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
                      "cache": "redis",
                      "testCache": "memory",
                      "log": "console"
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
          "parameters": [
            {
              "name": "appName",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "appProtocol",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "appDomain",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "appPort",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "appKey",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "appState",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "stripeKey",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "publicVapidKey",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "privateVapidKey",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "clientDomain",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "clientPort",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "nodeEnv",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "dbConnect",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "dbUrl",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "redisUrl",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "tokenLifespan",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "bcryptRounds",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "mailHost",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "mailPort",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "mailUsername",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "mailPassword",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "mailFromName",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "mailFromAddress",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "mailEncryption",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "cache",
              "in": "body",
              "type": "string",
              "required": false
            },
            {
              "name": "testCache",
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
                        "name": "Practical Frozen Salad",
                        "slug": "quos-dolore-quidem"
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
                      "name": "Fantastic Granite Tuna",
                      "slug": "error-recusandae-vel"
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

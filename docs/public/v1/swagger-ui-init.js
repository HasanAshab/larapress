
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
      "title": "SamerBlog API Docs",
      "version": "v1"
    },
    "host": "http://127.0.0.1:8000",
    "basePath": "/api/v1",
    "schemes": [
      "http"
    ],
    "paths": {
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
                  "message": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "parameters": []
        },
        "put": {
          "summary": "Update user details",
          "validationPath": "/data/data/com.termux/files/home/js/express/Packages/ExpressExtended/Api/app/http/validations/Auth/UpdateProfile",
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
              "name": "name",
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
            },
            {
              "name": "logo",
              "in": "formData",
              "type": "image/jpeg, image/png",
              "required": false
            }
          ],
          "consumes": [
            "multipart/form-data"
          ]
        }
      },
      "/auth/verify": {
        "get": {
          "summary": "Verify User account",
          "description": "Generally this endpoint will sent to user email with a token. user can use the token here to verify their account. After verification they will redirect to Frontend app",
          "validationPath": "Auth/VerifyEmail",
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
              "in": "query",
              "type": "string",
              "required": true
            },
            {
              "name": "token",
              "in": "query",
              "type": "string",
              "required": true
            }
          ]
        }
      },
      "/auth/verify/resend": {
        "get": {
          "summary": "Resend account verification email",
          "description": "need bearer token",
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

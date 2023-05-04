
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
      "version": "0.6.0",
      "title": "SamerBlog API Docs"
    },
    "host": "http://127.0.0.1:8000",
    "basePath": "/api",
    "schemes": [
      "http"
    ],
    "paths": {
      "/auth/register": {
        "post": {
          "summary": "Sign-up a User",
          "description": "Returns api token and verification email will be sent to user",
          "validationPath": "/data/data/com.termux/files/home/js/express/Packages/ExpressExtended/Api/app/http/validations/Auth/Register",
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
                  "token": {
                    "type": "string"
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
              "type": "image/jpeg || image/png",
              "required": false
            }
          ],
          "consumes": [
            "multipart/form-data"
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

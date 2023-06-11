import { Application } from 'express';
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Human Reports API',
      version: '1.0.0',
      description: 'API documentation for your project',
    },
    paths: {
      "/api/auth/login": {
        "post": {
          "tags": ["Users"],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserLogin"
                }
              }
            }
          },
        }
      },
      "/api/auth/register": {
        "post": {
          "tags": ["Users"],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserRegister"
                }
              }
            }
          },
        }
      },
      "/api/auth/logout": {
        "get": {
          "tags": ["Users"],
        }
      },
      "/api/reports/list": {
        "get": {
          "tags": ["Reports"],
          "summary": "Get all reports",
          "responses": {
            "200": {
              "description": "Successful operation",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Report"
                  }
                }
              }
            }
          }
        },
      },
      "/api/reports/create": {
        "post": {
          "tags": ["Reports"],
          "summary": "Create a  report",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Report"
                }
              }
            }
          },
        },
      },
      "/api/reports/:id": {
        "put": {
          "tags": ["Reports"],
          "summary": "Update a report",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Report"
                }
              }
            }
          },
        },
        "delete": {
          "tags": ["Reports"],
          "summary": "Delete a report",
          "responses": {
            "200": {
              "description": "Successful operation",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Report"
                  }
                }
              }
            }
          }
        },
      }
      
    },
    "components": {
      "schemas": {
        "UserRegister": {
          "type": "object",
          "properties": {
            "first_name": {
              "type": "string"
            },
            "last_name": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "description": {
              "type": "string"
            }
          }
        },
        "UserLogin": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "description": {
              "type": "string"
            }
          }
        },
        "Report": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  apis: ['./src/**/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

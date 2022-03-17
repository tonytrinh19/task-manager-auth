const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

require("./db/mongoose.js");
const userRouter = require("./routers/user-router");
const taskRouter = require("./routers/task-router");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "A simple express library API",
    },
    servers: [
      {
        url: `http://localhost:1234`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routers/**.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(cors());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;

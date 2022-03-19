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
app.use(express.urlencoded());
app.use(express.json());
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "POST, PUT, PATCH, GET, DELETE, OPTIONS"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });
app.use(userRouter);
app.use(taskRouter);

module.exports = app;

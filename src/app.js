const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// const swaggerOptions = {
//     swaggerDefinition: {
//         info: {
//             title: 'Task Manager API',
//             description: 'Task Manager API Infomation',
//             contact: {
//                 email: 'tony@trinh.in'
//             },
//             version: 'v1.0'
//         }
//     },
//     apis: ['app.js']
// }

const publicDirectory = path.join(__dirname, "../public");
const viewsDirectory = path.join(__dirname, "../templates/views");

app.use(express.static(publicDirectory));
app.use(cors());
// app.set("view engine", "ejs");
// app.set("views", viewsDirectory);

require("./db/mongoose.js");
const appRouter = require("./routers/app-router");
const userRouter = require("./routers/user-router");
const taskRouter = require("./routers/task-router");

// const swaggerDocs = swaggerJsDoc(swaggerOptions)

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
// console.log(swaggerDocs)
/**
 * @swagger
 * /hey:
 *  get:
 *      description: Use to register new users
 *      responses:
 *          '200':
 *              description: Successful created new user
 */
// app.get('/hey', (req, res) => {
//     res.status(200).send()
// })

app.use(express.json());
app.use(express.urlencoded());
app.use(appRouter);
app.use(userRouter);
app.use(taskRouter);

module.exports = app;

import  express, { type NextFunction }  from "express";
import { type Application, type Request,type Response } from "express";
import router from "./routes/notes.routes.js"
import AppError from "./utils/app.error.js"
import { globalErrorHandler } from "./middlewares/error.middleware.js";
const app:Application = express();




app.use(express.json())


// Register routes
app.use("/notes",router)


//Global error handler


app.use(globalErrorHandler)

export default app;
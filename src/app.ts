import  express, { type NextFunction }  from "express";
import { type Application, type Request,type Response } from "express";
import router from "./routes/noteRouters.js"
import AppError from "./models/AppError.js"
import { globalErrorHandler } from "./middlewares/errorHandlerMiddleware.js";
const app:Application = express();




app.use(express.json())


// Register routes
app.use("/notes",router)


//Global error handler


app.use(globalErrorHandler)

export default app;
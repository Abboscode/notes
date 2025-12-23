import  express from "express";
import { type Application} from "express";
import router from "./routes/note.routes.js";

import { globalErrorHandler } from "./middlewares/error.middleware.js";
import AppError from "./utils/app.error.js";
const app:Application = express();




app.use(express.json())


// Register routes
app.use("/notes",router)


//Global error handler

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404, 'fail'));
});
app.use(globalErrorHandler)

export default app;
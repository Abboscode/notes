import  express from "express";
import { type Application} from "express";
import router from "./routes/note.routes.js";

import { globalErrorHandler } from "./middlewares/error.middleware.js";
const app:Application = express();




app.use(express.json())


// Register routes
app.use("/notes",router)


//Global error handler


app.use(globalErrorHandler)

export default app;
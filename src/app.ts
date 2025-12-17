import  express  from "express";
import { type Application, type Request,type Response } from "express";
import router from "./routes/noteRouters.js"

const app:Application = express();

app.use(express.json())


// Register routes
app.use("/notes",router)

//Global error handler
app.use((err:Error, req:Request, res:Response,next:Function)=>{
res.status(500).json({message:err.message});

});

export default app;
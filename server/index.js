import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import DalleRoutes from "./routes/dalle.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit:'50mb'}));
app.use('/api/v1/dalle', DalleRoutes);

app.get("/",(res,req)=>{
    res.status(200).json({
        message:"Hello from Dalle"
    })
})

app.listen(8000,()=>console.log("Server has started at 8000"))
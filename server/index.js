import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import DalleRoutes from "./routes/dalle.routes.js";
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 30 minutes
	max: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({limit:'50mb'}));
app.use(limiter);


app.use('/api/v1/dalle', DalleRoutes);


app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Hello from Dalle"
    })
})

app.listen(8000,()=>console.log("Server has started at 8000"))
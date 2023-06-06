import express from "express";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const router = express.Router();

const config = new Configuration({
    apiKey:process.env.OPENAI_API_KEY_2,
})

const openai = new OpenAIApi(config);

router.route("/").get((req,res,next)=>{
    return res.status(200).json({
        message:"Hello from DELL.E routes"
    })
});

router.route("/").post(async (req,res)=>{
    try{
        const {prompt} = req.body;

        const response = await openai.createImage({
            prompt,
            n:1,
            size:'1024x1024',
            response_format:"b64_json"
        });

        const image = response.data.data[0].b64_json;

        return res.status(200).json({photo:image});
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Ops! Something went wrong"
        })
    }
})

export default router;
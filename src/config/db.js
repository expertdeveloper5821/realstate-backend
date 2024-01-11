// database
import mongoose from "mongoose";
import envConfig from "./envConfig.js";

mongoose.connect(
    envConfig.DB_URL
).then(()=>{
    console.log('database is connected')
})
.catch(()=>{
    console.log('database is not connected')
})


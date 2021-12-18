require ('dotenv').config();
const express=require('express')
const links=require("./routes/links")
let corsOption={
    origin:'*'
}

let app=express();
const cors=require('cors');
const { request, response } = require('express');

app.use(cors(corsOption));
app.use(express.json());

app.use(links)

app.get('/',(req,res)=>{
    res.status(200).json( 
        {
            hola:"mundo"
        }
    )
})



const PORT = process.env.PORT || 3001

app.listen(PORT,()=>{
    console.log(`La api esta en http://localhost:${PORT}`);
})

module.exports={app};



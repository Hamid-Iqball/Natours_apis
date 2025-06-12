const express = require("express")

const app = express()

app.get('/', (req,res)=>{
 res.status(200).json({messge:"Hello from the server side"})
})

const PORT =3000
app.listen(PORT, ()=>{
    console.log(`Server successfully started at ${PORT}`)
})
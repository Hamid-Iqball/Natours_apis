const express = require("express")
const fs = require("fs")


const app = express()
app.use(express.json()) //middleware
//In Node.js, __dirname is a global variable that represents the directory name of the current module (the current file being executed). It gives you the absolute path to the directory where the current script is located.
const tours =JSON.parse( fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/api/v1/tours', (req,res)=>{
 res.status(200).json({
    status:'success',
    results:tours.length,
    data:{
        tours
    }
 })
})

app.post('/api/v1/tours', (req,res)=>{
   
    const newId = tours[tours.length-1].id+1
    const newTour = Object.assign({id:newId}, req.body) //merging two objects
    tours.push(newTour)

    fs.writeFile(
   `${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours),
    err=>{
        res.status(201).json({
            status:"success",
            data:{
                tour:newTour
            }
        })
    }
    )


    

})

const PORT =3000
app.listen(PORT, ()=>{
    console.log(`Server successfully started at ${PORT}`)
})
const express = require("express")
const fs = require("fs")
const { get } = require("http")


const app = express()
app.use(express.json()) 

//middleware
app.use((req,res,next)=>{
console.log('Helo from the middleware 👋')
next()
})


app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next()
})
//In Node.js, __dirname is a global variable that represents the directory name of the current module (the current file being executed). It gives you the absolute path to the directory where the current script is located.
const tours =JSON.parse( fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

const getAllTours =  (req,res)=>{
 res.status(200).json({
    status:'success',
    requestedAt: req.requestTime,
    results:tours.length,
    data:{
        tours
    }
 })
}

const createTour =  (req,res)=>{
   
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
}

const getSingleTour =(req,res)=>{
    const id = req.params.id*1
    const tour = tours.find((el)=>el.id===id)

    if(id>tours.length){
        return res.status(401).json({
            status:'fail',
            message:"Invalid ID"
        })
    }

        res.status(200).json({
        status:'success',
        data:{
            tour
        }
    })
}

//

const updateTour = (req,res)=>{
     if(req.params.id>tours.length){
        return res.status(401).json({
            status:'fail',
            message:"Invalid ID"
        })
    }
}


const deleteTour = (req,res)=>{
   if(req.params.id>tours.length){
        return res.status(401).json({
            status:'fail',
            message:"Invalid ID"
        })
    }

    res.status(204)
}


// app.get('/api/v1/tours',getAllTours)
// app.post('/api/v1/tours',createTour)
// app.get('/api/v1/tours/:id', getSingleTour )
// app.patch("api/v1/tours/:id",updateTour )
// app.delete("/api/v1/tour/:id" ,deleteTour )


//another best way for routing

app.route('/api/v1/tours').get(getAllTours).post(createTour)
app.route('/api/v1/tours/:id').get(getSingleTour).patch(updateTour).delete(deleteTour)


const PORT =3000
app.listen(PORT, ()=>{
    console.log(`Server successfully started at ${PORT}`)
})
const app =  require('./app')

//In this file we will add the stuff that is not related to the express and is mainly related to the server

const PORT =3000
app.listen(PORT, ()=>{
    console.log(`Server successfully started at ${PORT}`)
})


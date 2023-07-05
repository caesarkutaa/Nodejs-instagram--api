// @ts-nocheck
require('dotenv').config();
require('express-async-errors');



const express = require('express');
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const  connectDB = require('./DB/connect')
const authH = require('./middleware.js/auth')
const userRouter = require('./router/User')
const postRouter = require('./router/Post')

app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.get('/home',(req,res)=>{
  res.send('helloo node')
})
app.use('/user', userRouter)
app.use('/post', postRouter)

const options = {
    definition: {
    openapi:"3.0.0",
    info:{
        title:"Instagram Media API",
        version:"1.0",
        description:"This is a simple instagram media api"
     },
    servers:[
        {
            url:"http://localhost:8800/",
        }
      ]
  },
  apis:["./router/*.js"]
}

const spacs = swaggerJsdoc(options)
app.use(
  '/api-doc',
  swaggerUi.serve,
  swaggerUi.setup(spacs)
)

const port = process.env.PORT || 8800;



const start = async () => { 
    try {
         await connectDB (process.env.MONGO_URL)
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error); 
    }
  };
  
  start();
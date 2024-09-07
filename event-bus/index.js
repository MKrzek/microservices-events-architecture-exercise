import express from 'express'
import bodyParser from 'body-parser'
import axios from 'axios'

const app = express();
app.use( bodyParser.json() )

app.post( '/events', ( req, res ) => {
  const event = req.body
  axios.post( 'http://localhost:4000/events', event ).catch(err=>{console.log(err)})
  axios.post( 'http://localhost:4001/events', event ).catch(err=>{console.log(err)})
  axios.post( 'http://localhost:4002/events', event ).catch(err =>{console.log(err)})
  axios.post( 'http://localhost:4003/events', event ).catch(err=>{console.log(err)})
  res.send({status: 'OK'})
})


app.listen( 4005, () => {
  console.log('Event bus service is up')
})

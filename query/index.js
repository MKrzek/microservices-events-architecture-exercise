import express from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';
import cors from 'cors'
import axios from 'axios'


const app = express()
app.use( bodyParser.json() )
app.use( cors() );

const posts = {}


app.get( '/posts', ( req, res ) => {
   res.send(posts)
} )

app.post( '/events', ( req, res ) => {
  const { type, data } = req.body


  if ( type === 'PostCreated' ) {
    const { id, title } = data
    posts[id]={id, title, comments:[]}

  }
  if ( type === 'CommentCreated' ) {
    const { id, content, postId } = data

    const post = posts[ postId ]
    post.comments.push({id, content})

  }
   console.log('posts', posts)
  res.send({})
})


app.listen( 4002, () => {
  console.log('query service on')
})
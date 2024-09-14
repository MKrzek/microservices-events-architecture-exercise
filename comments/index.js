import express from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';
import cors from 'cors'
import axios from 'axios'


const app = express()
app.use( bodyParser.json() )
app.use(cors())

const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res)=>{
 res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async(req, res)=>{
  const commentId = randomBytes(4).toString('hex')
  const { content } = req.body
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({id: commentId, content, status:'pending'})
  commentsByPostId[ req.params.id ] = comments
  await axios.post( 'http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      postId: req.params.id,
      content,
      status: 'pending'
    }
  })
 res.status(201).send(comments)
} )

app.post( '/events', async( req, res ) => {
  const { type, data } = req.body
  console.log('Moderation received', type)
  if ( type === 'CommentModerated' ) {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[ postId ];
    const comment = comments.find( comment => comment.id === id );
    comment.status = status;

    await axios.post( 'http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: { id, status, postId, content }
    } );
  }
  res.send({})
})


app.listen(4001, ()=>{
  console.log('Comments service is up')
})
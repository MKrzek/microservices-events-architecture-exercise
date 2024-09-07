import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import axios from 'axios';

const app = express()
app.use( bodyParser.json() )
app.use( cors() );

const posts = {}

const handleEvent = (type, data) => {
  if ( type === 'PostCreated' ) {
    const { id, title } = data;
    posts[ id ] = { id, title, comments: [] };
  }

  if ( type === 'CommentCreated' ) {
    const { id, content, postId, status } = data;

    const post = posts[ postId ];
    console.log('In comment created', posts, post)
    post.comments.push( { id, content, status } );
  }

  if ( type === 'CommentUpdated' ) {
    const { id, postId, status, content } = data
    const post = posts[ postId ]
    const comment = post.comments.find( comment => comment.id === id )
    comment.status = status
    comment.content = content
  }
}

app.get( '/posts', ( req, res ) => {
   res.send(posts)
} )

app.post( '/events', ( req, res ) => {
  const { type, data } = req.body;
  handleEvent(type, data)
  res.send({})
})


app.listen( 4002, async() => {

  console.log( 'Query service is up' )
  try {
    const res = await axios.get( 'http://localhost:4005/events' )
    console.log(res)
    for ( let event of res.data ) {
      console.log( 'Processing event', event.type )
      console.log('data', event.data)
      handleEvent(event.type, event.data)
    }
  } catch ( error ) {
    console.log(error.message)
  }
})
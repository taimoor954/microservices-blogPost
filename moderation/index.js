const express = require('express')
const axios = require('axios');


const app = express()
app.use(
    express.json({
      limit: '10kb', //size of req.body can be upto 10kb
    })
  ); //BODY PARSER
  app.use(
    express.urlencoded({
      extended: true,
      limit: '10kb',
    })
  );

app.post('/events', async(request , response)=>{
const {type,data} = request.body
if(type == 'CommentCreated')
{
    console.log(data.status)
    const status = data.content.includes('orange') ? 'rejected' : 'approved'
    await axios.post('http://localhost:4005/events', {
        type : 'CommentModerated',
        data : {
            id : data.id,
            postId : data.postId,
            status,
            content :data.content
        }
    })
}
response.status(200).send({})


})

const port =4006 
app.listen(port , () => {
    console.log(`listening at port ${port}`)
})
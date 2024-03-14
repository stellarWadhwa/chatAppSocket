const express=require('express')
const app=express();
const http=require('http');
const cors=require('cors')
const {Server} = require('socket.io')




app.use(cors());


const server= http.createServer(app);
// const allowedOrigins=['http://localhost:3000/','https://chat-lemon-gamma.vercel.app']
const io=new Server(server,{
    cors:{
        origin:'*'
    }
});


io.on("connection",(socket)=>{
console.log(socket.id);
socket.on("join_room",(data)=>{
  socket.join(data);
  console.log(`User  with id ${socket.id} joined the room ${data}`);
     
})
socket.on("send_message",(data)=>{
    socket.to(data.room).emit("recieve_message",data)})




socket.on("disconnect",()=>{
    console.log("User disconnected: " + socket.id);
})
})


// Route for "/server" path
app.get('/server', (req, res) => {
    setTimeout(()=>{
        res.send('Success');

    },5000)
});
// app.get ('/server', (req, res) => {
//     res.send('Success');
// })


server.listen(3001,()=>{
    console.log("Server started on 3001");
})

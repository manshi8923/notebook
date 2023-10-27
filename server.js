const connectDB=require('./config/db.js');
connectDB();

const express=require('express');
const app=express();
const PORT=3030
var cors=require('cors');
//middlewares
app.use(express.json());
app.use(cors());
//available routes
app.use('/api/auth',require('./routes/auth.js'));
app.use('/api/notes',require('./routes/notes.js'));
//listen to the port
app.listen(PORT,()=>{
    console.log(`Server is running on the ${PORT}`);
})
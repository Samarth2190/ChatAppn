const express= require('express');
const app= express();
const mongoose= require('mongoose');
const path= require('path');
app.set("views",path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ExpressError = require('./ExpressError.js');
const Chat=require('./models/chat.js');
const { error } = require('console');
async function main() { 
    await mongoose.connect('mongodb://localhost:27017/whatsapp');
}

let chat= new Chat({
    from: "John",
    to: "Doe",
    msg: "Hello",
    createdAt: new Date(),
});

// chat.save().then((res)=>{
//     console.log(res);
// }).catch(err=>console.log(err));

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch(err=>console.log(err));        

app.listen(3000,()=>{   
    console.log("Server is running on port 3000");
}); 

app.get('/',(req,res)=>{
    res.send("Root World");
});


app.get('/chat', asyncWrap(async (req,res)=>{
    console.log("GET /chat route hit");
    let chats= await Chat.find();
    res.render('index.ejs',{chats});
}));

app.get('/chat/new', asyncWrap(async(req,res)=>{   
    console.log("GET /chat/new route hit");
    res.render('new.ejs');
}));

// app.post('/chat', async (req,res)=>{
//     console.log("POST /chat route hit");
//     console.log(req.body);
//     let chat= new Chat({
//         from: req.body.from,
//         to: req.body.to,
//         msg: req.body.msg,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//     });
//     await chat.save().catch(err=>res.status(400).send(`<script>alert("${err.errors.msg.properties.message}"); window.location.href='/chat';</script>`));
//     res.redirect('/chat');
// });
app.post('/chat', asyncWrap(async (req, res) => {
    console.log("POST /chat route hit");
    console.log(req.body);

        let chat = new Chat({
            from: req.body.from,
            to: req.body.to,
            msg: req.body.msg,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await chat.save();
        res.redirect('/chat');
 
}));

app.get('/chat/:id/edit', asyncWrap(async (req,res,next)=>{
    console.log("GET /chat/:id/edit route hit");
    let chat= await Chat.findById(req.params.id);
    console.log(chat);
    res.render('edit.ejs',{chat});
}));


app.put('/chat/:id',asyncWrap(async (req,res)=>{
    console.log("PUT /chat/:id route hit");
    console.log(req.body);
    let chat= await Chat.findByIdAndUpdate(req.params.id,{
        msg: req.body.msg,
        updatedAt: new Date(),
    },{
        new: true,
        runValidators: true,    
    });
    res.redirect('/chat');
}));

app.delete('/chat/:id', asyncWrap(async (req,res)=>{
    console.log("DELETE /chat/:id route hit");
    let chat= await Chat.findByIdAndDelete(req.params.id);
    res.redirect('/chat');
}));
function asyncWrap(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch((err) =>next(err));    
    };
}
const handleValidationError = (err) => {
    console.log("THis is a validation error");
    console.dir(err.message);
    return err;
}


app.use((err, req, res, next) => {
    console.log(err.name);
    if(err.name==="ValidationError"){
       err= handleValidationError(err);
    }
    next(err);
});

app.use((err,req,res,next)=>{
    console.log(err.message);
    let {status=500,message="Something went wrong"}=err;          
    res.status(status).send(message);
});
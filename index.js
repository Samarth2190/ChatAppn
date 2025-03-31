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
const Chat=require('./models/chat.js');
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


app.get('/chat', async (req,res)=>{
    console.log("GET /chat route hit");
    let chats= await Chat.find();
    // console.log(chats);
    res.render('index.ejs',{chats});
})

app.get('/chat/new', (req,res)=>{   
    console.log("GET /chat/new route hit");
    res.render('new.ejs');
}      );

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
app.post('/chat', async (req, res) => {
    console.log("POST /chat route hit");
    console.log(req.body);

    try {
        let chat = new Chat({
            from: req.body.from,
            to: req.body.to,
            msg: req.body.msg,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await chat.save();
        res.redirect('/chat');
    } catch (err) {
        // console.error(err);
        res.status(400).send(`<script>alert("${err.errors?.msg?.properties?.message || 'An error occurred'}"); window.location.href='/chat/new';</script>`);
    }
});

app.get('/chat/:id/edit', async (req,res)=>{
    console.log("GET /chat/:id/edit route hit");
    let chat= await Chat.findById(req.params.id);
    console.log(chat);
    res.render('edit.ejs',{chat});
}
);


app.put('/chat/:id', async (req,res)=>{
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
// }
});
app.delete('/chat/:id', async (req,res)=>{
    console.log("DELETE /chat/:id route hit");
    let chat= await Chat.findByIdAndDelete(req.params.id);
    res.redirect('/chat');
});
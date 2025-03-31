const mongoose= require('mongoose');
const path= require('path');
const Chat= require('./models/chat.js');

async function main() { 
    await mongoose.connect('mongodb://localhost:27017/whatsapp');
}

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch(err=>console.log(err));

let chats=[
    {
        from: "Neha",
        to: "Varun",
        msg: "Namaste!",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        from: "Jonas",
        to: "Smith",
        msg: "Hi there!",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        from: "Alice",
        to: "Bob",
        msg: "How are you?",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        from: "Charlie",
        to: "Dave",
        msg: "Good morning!",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        from: "Eve",
        to: "Frank",
        msg: "What's up?",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

Chat.insertMany(chats).then((res)=>{
    console.log("Inserted chats successfully:", res);
}).catch(err=>console.log("Error inserting chats:", err));
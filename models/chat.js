const mongoose= require('mongoose');

const chatSchema= new mongoose.Schema({
    from:{
        type: String,
        required: true,
    },
    to:{
        type: String,
        required: true,
    },
    msg:{
        type: String,
        maxlength: 50,
    },
    createdAt:{
        type: Date,
        required: true,
        // default: Date.now,
    },
    updatedAt:{
        type: Date,
        // default: Date.now,
    },
});
const Chat= mongoose.model('Chat',chatSchema);
module.exports= Chat;
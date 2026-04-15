import mongoose from "mongoose";
const fileSchema = new mongoose.Schema({
    fileName:{
        type:String,
        required:true,
        trim: true,
    },
    fileURL:{
        type:String,
        required:true
    },
    publicId:{
        type:String,
        required:true,
        enum:['image', 'pdf', 'doc', 'audio', 'other']
    },
    fileSize:{
        type:String,
        required:true
    },
    deleteCode:{
        type:String,
        require:true
    }
}, {
    timeStamps: true
})

const File = mongoose.model("File", fileSchema);

export default File;
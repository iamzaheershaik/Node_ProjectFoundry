import axios from "axios";
import cloudinary from "../config/cloudinary";  
import streamifier from "streamifier"
import fileModel from "../models/fileModel"

const getFileType = (mimeType) => {
    if(mimeType.startsWith('image')) return "image";
    if(mimeType === "application/pdf") return "pdf";
    return "other"

}
export const uploadFile = async (req, res) => {
    try{
        const file = req.file;
        if(!file){
            return res.status(400).json({message:"No file is Uploaded"})
        }
        const {originalName, mimeType, size, buffer} = file; 
        const fileType = getFileType(mimeType);
        const deleteCode = Math.floor(1000 + Math.random() * 9000).toString();   
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.update_stream(
                {resource_type: "auto"},
                (error, result) => {
                    if(error) reject(error)
                        else resolve(result);
                }
            );
            streamifier.createReadStream(buffer).pipe(stream)
        })
    }catch(error){

    }
}

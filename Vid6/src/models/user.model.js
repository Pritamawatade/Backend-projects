import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim:true,
            index: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim:true,
            
        },
        fullname:{
            type: String,
            required: true,
            trim:true,
            index: true
        },
        avatar:{
            type: String, // coudinary url
            required: true,

        },
        covnerImage:{
            typeof: String, // coudinary url

        },
        watchHistory:[
           {
             type: Schema.Types.ObjectId,
             ref: "Video"
           }
        ],
        
        password:{
            type: String,
            required: [true,'Password is required']
        },

        refreshToken:{
            typeof: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function(next){
    if(!this.Modified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return  jwt.sign(
        {
            _id : this._id,
            email : this.email,
            fullname: this.fullname,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return  jwt.sign(
        {
            _id : this._id
       
        },
        process.env.REFRESH_TOKEN_SECRET,
        { 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
        }
    )
}
export const User = mongoose.model("User", userSchema)

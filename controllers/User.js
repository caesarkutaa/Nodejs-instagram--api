// @ts-nocheck
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes');
const { BadRequestError,UnauthenticatedError} = require('../errors')
const nodemailer = require("nodemailer")

//env stuff
require("dotenv").config()
//nodemalier stuff
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user:process.env.AUTH_EMAIL,
    pass:process.env.AUTH_PASSWORD
  }
})


//testing success
transporter.verify((err,success)=>{
  if(err){
    console.log(err.message);
  }else{
    console.log("ready for messages")
    console.log(success)
  }
})

 
//create user
const createUser = async(req,res)=>{
  const { email } = req.body
  // Check we have an email
  if (!email) {
     return res.status(422).send({ message: "Missing email." });
  }
  try{
     // Check if the email is in use
     const existingUser = await User.findOne({ email }).exec();
     if (existingUser) {
        return res.status(409).send({ 
              message: "Email is already in use."
        });
      }
     // Step 1 - Create and save the user
     const user = await  User.create({
        _id: new mongoose.Types.ObjectId,
        ...req.body
     });
     // Step 2 - Generate a verification token with the user's ID
     const verificationToken = user.createjwt();
     // Step 3 - Email the user a unique verification link
     const url = `http://localhost:3023/api/v1//user/verify/${verificationToken}`
     console.log(verificationToken);
     transporter.sendMail({
       to:email,
       subject: 'Verify Account',
       html: `Click <a href = '${url}'>here</a> to confirm your email.`
     })
     return res.status(201).send({
       message: `Sent a verification email to ${email}`
     });
 } catch(err){
  console.log(err);
     return res.status(500).send(err);
 }
}

 const  loginUser = async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(StatusCodes.BAD_REQUEST).send('invalid email and password')
    }
    const user = await User.findOne({ email  })
    //checking if there is a user
    if(!user){
   return res.status(StatusCodes.UNAUTHORIZED).send('invalid email')
    }
    //compare password using bycrypt in the models    
    const ispasswordcorrect = await user.comparepassword(password)
    if(!ispasswordcorrect){
        return res.status(StatusCodes.UNAUTHORIZED).send('invalid password')
    }
    //creating a token and geting the user name (code found in models.user)
    const accesstoken = user.createjwt()
    res.status(StatusCodes.OK).json({user,accesstoken})
  
 }



 const verifyUser = async(req,res)=>{
  const {id} =  req.params
  console.log(id)
  // Check we have an id
  if (!id) {
      return res.status(422).send({ 
           message: "Missing token" 
      });
  }
  // Step 1 -  Verify the token from the URL
  let payload = null
  try {
      payload = jwt.verify(
      id,
         process.env.JWT_SECRET
      );
  } catch (err) {
    console.log(err);
      return res.status(500).send(err);
  }
  try{
      // Step 2 - Find user with matching ID
      const user = await User.findOne({ _id: payload.userId })
      console.log(payload.userId);
      if (!user) {
         return res.status(404).send({ 
            message: "User does not  exists" 
         });
      }
      // Step 3 - Update user verification status to true
       await User.findByIdAndUpdate( user,{ verified: true },{new:true});
      return res.status(200).send({
            message: "Account Verified"
      });
   } catch (err) {
    console.log(err);
      return res.status(500).send(err);
   }
}

const forgetpassword = async(req,res)=>{
  try {
    const { email } = req.body;

    // Check we have an email
  if (!email) {
    return res.status(422).send({ message: "Missing email." });
 }
    
 
 const user = await User.findOne({ email });
 
 if (!user) {
   res.status(404).json({ message: 'User not found' });
   return;
  }
  
  // Generate reset token
  const resetToken = user.createjwt();

      const URL = `http://localhost:3023/api/v1//user/reset-password/${resetToken}`
       console.log(URL);
         transporter.sendMail({
           to:email,
           subject: 'Password Reset',
           html: `<p>You requested a password reset. Click the link below to reset your password:</p>
           <a href="${URL}">Reset Password</a>`
         })
         return res.status(201).send({
          message: `Sent a password reset  email to ${email}`
        });
    
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }

}
const restpassword = async(req,res)=>{
  const { id } = req.params
// console.log(id);
 // Check we have an token
  if (!id) {
      return res.status(422).send({ 
           message: "Missing token" 
      });
    }
    let payload = null
    try {
      payload = jwt.verify(
        id,
          process.env.JWT_SECRET
        );
        res.status(200).send({
          message: "token Verified"
    });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

const resetuserpassword =async(req,res)=>{
try {
  
  const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");


        user.password = req.body.password;
        await user.save();
    
        res.status(200).send({
          message: "password reset sucessfully"
        })
  
} catch (error) {
        res.send("An error occured");
        console.log(error);
}
}








   const getUser = async(req,res)=>{
    const user = await User.findById(req.params.id)
    //this will not dispaly these propertise
    const {password,createdAt,updatedAt, ...other} = user._doc
    res.status(200).json(other)
   }

   const updateUser = async(req,res)=>{
         if(req.body.userId === req.params.id || req.body.isAdmin){
             const user = await User.findByIdAndUpdate(req.params.id,{$set: req.body})
                res.status(StatusCodes.OK).json('acct updated')
             }else{
                return res.status(403).json('ypu can only dee your acc')
            }
   }
   const deleteUser = async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        const user = await User.findByIdAndRemove(req.params.id)
           res.status(StatusCodes.OK).json('remove succeess')
    }else{
        return res.status(403).json('ypu can only delete your acc')
    }
}

const followUser = async(req,res)=>{
    // firstly check whether this users are the same
  if(req.body.userId !== req.params.id){
  try {
    //the user with the id
     const user = await User.findById(req.params.id)
     //the user try to make the request
     const currentUser = await User.findById(req.body.userId)
     if(!user.followers.includes(req.body.userId)){
        //pushes to the user  to unfollow fellowers
   await user.updateOne({$push:{followers:req.body.userId}})
   //pushes to your unfollow
   await currentUser.updateOne({$push:{following:req.params.Id}})
   res.status(200).json('user has been followed')
     }else{
        res.status(403).json('you are already fellowing user')
     }
  } catch (error) {
    res.status(500).json(error)
  }
  }else{
    //if the user are the same send this
    res.status(StatusCodes.FORBIDDEN).json('you cant fellow yourself')
  }


}


const unfollowUser = async(req,res)=>{
    // firstly check whether this users are the same
  if(req.body.userId !== req.params.id){
  try {
    //the user with the id
     const user = await User.findById(req.params.id)
     //the user try to make the request
     const currentUser = await User.findById(req.body.userId)
     if(user.followers.includes(req.body.userId)){
        //pushes to the user followers
   await user.updateOne({$pull:{followers:req.body.userId}})
   //pushes to your following
   await currentUser.updateOne({$pull:{following:req.params.id}})
   res.status(200).json('user has been unfollowed')
     }else{
        res.status(403).json('you dont fellow user')
     }
  } catch (error) {
    res.status(500).json(error)
  }
  }else{
    //if the user are the same send this
    res.status(StatusCodes.FORBIDDEN).json('you cant unfellow yourself')
  }


}





module.exports ={
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getUser,
    followUser,
    unfollowUser,
    verifyUser,
    forgetpassword,
    restpassword,
    resetuserpassword
}
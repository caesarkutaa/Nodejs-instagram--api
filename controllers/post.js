
const Post = require('../models/post')


//create posst
const createpost = async(req,res)=>{
    const post = await Post.create(req.body)
    res.status(201).json(post)
    
}
//get user post
const getpost = async(req,res)=>{
  
    const mypost = await Post.findById(req.params.id)
    res.status(200).json(mypost)
}
//update post
const updatePost = async (req,res)=>{
    const post = await Post.findById(req.params.id)
    // @ts-ignore
    if(post.userId === req.body.userId){
        // @ts-ignore
        await post.updateOne({$set:req.body})
        res.status(200).json('your post has been updated')
    }else{
       return res.status(403).json('you can only update your post')
    }
}

//delete post
const deletePost = async(req,res)=>{
    const post = await Post.findById(req.params.id)
    // @ts-ignore
    if(post.userId === req.body.userId){
        // @ts-ignore
        await post.deleteOne()
        res.status(200).json('your post has been deleted')
    }else{
       return res.status(403).json('you can only delete your post')
    }
}
//like or dislike post
const likePost = async(req,res)=>{
  const post = await Post.findById(req.params.id)
  // firstly checking if 
  // @ts-ignore
  if(!post.likes.includes(req.body.userId)){
    // @ts-ignore
    await post.updateOne({$push:{likes:req.body.userId}})
    res.status(200).json('this post has been liked')
  }else{
    // @ts-ignore
    await post.updateOne({$pull:{likes:req.body.userId}})
    res.status(200).json('this post has been disliked')
  }
}

//get all timeline post
const gettimelinePost = async(req,res)=>{
    // @ts-ignore
    const currentuser =  await User.findById(req.body.userId)
    const userpost = await Post.find({userId:currentuser._id})
    const friendsposts =  await Promise.all (currentuser.following.map((friendId)=>{
       // @ts-ignore
       return  post.find({userId: friendId})
    }))
    res.json(userpost.concat(...friendsposts))
}


module.exports = {
    createpost,
    getpost,
    updatePost,
    deletePost,
    likePost,
    gettimelinePost
}
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const postSchema = new Schema({
title:String,
summary:String,
content:String,
cover: String,
author:{type: Schema.Types.ObjectId, ref:'User'}
  },{timestamps:true}
);
const Post = model('Post',postSchema)
export default Post
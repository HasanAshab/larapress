import "reflect-metadata";
import "dotenv/config";

if(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "loadTest") {
  require('module-alias/register');
}
import "~/vendor/autoload";
import "Config/load";
import Config from "Config";
import app from "~/main/app";
import DB from "DB";


// Connecting to database
if(Config.get("database.connect")) {
  DB.connect().then(() => {
    console.log("Connected to Database!");
  }).catch(err => {
    console.log("Couldn't connect to Database. reason: " + err);
  });
}

const port = Config.get<number>("app.port");

app.assertRunningInWeb();

app.server.listen(port, () => {
  console.log(`Server running on [http://127.0.0.1:${port}] ...`);
});

app.server.on("connection", () => {
  const time = new Date().toLocaleTimeString("en-US", { hour12: true });
  console.log(`*New connection: [${time}]`);
});

/*
import User, { UserDocument } from "~/app/models/User";
import Media from "~/app/models/Media";
import URL from "URL";

import { model, Schema, Types } from "mongoose";

const blogSchema = new Schema({
  content: { type: String, required: true },
  author: { 
    type: Types.ObjectId,
    required: true,
    ref: "User"
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const commentSchema = new Schema({
  text: { type: String, required: true },
  author: { 
    type: Types.ObjectId,
    required: true,
    ref: "User"
  },
  blog: {
    type: Types.ObjectId,
    required: true,
    ref: "Blog"
  }
});


blogSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blog'
});

const Blog = model("Blog", blogSchema);
const Comment = model("Comment", commentSchema);


(async () => {
  const comments = await Comment.find().populate({
    path: "author",
      populate: {
        path: "profile",
       // select: "path"
       
      }
  })
  return console.log(comments)
  
  const blogs = await Blog.find().populate({
    path: "comments",
    populate: {
      path: "author",
      populate: {
        path: "profile",
       // select: "path"
      }
    }
  })
  console.log(blogs[3].comments[0])
 return;
  const user = await User.findOne() as UserDocument

  const b1 = await Blog.create({
    author: user._id,
    content: "bla bla bla1"
  })
  const b2 = await Blog.create({
    author: user._id,
    content: "bla bla bla2"
  })
  
  const comment = await Comment.create({
    author: user._id,
    blog: b1._id,
    text: "vala hoise"
  })
  
 // URL.signedRoute()
 return;
  const file = {
    name: "test.png",
    data: "jsejdjejdjdjdbdudh"
  }
  console.log(
    await user.media(),
   // await user.media().withTag("profile").first(),
  // await user.media().withTag("profile").attach(file, "profiles"),
    await user.media().withTag("profile").attach(file, "profiles").asPrivate()
   // await user.media().withTag("profile").detach()
    //await user.media().withTag("profile").replaceBy(file)
  )
})()
*/
import * as authServices from "../services/authServices.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
import {sendEmail} from "../helpers/sendEmail.js"

const avatarsPath = path.resolve("public", "avatars");


import { createToken } from "../helpers/jwt.js";
import { nanoid } from "nanoid";
const {SENDGRID_EMAIL} = process.env;

const signup = async(req, res) => { 
  const { email } = req.body;

  const user = await authServices.findUser({ email });

  if (user) { 
    throw HttpError(409, "Email in use");
  }
  const verificationToken = nanoid();

  
  const newUser = await authServices.saveUser({ ...req.body, avatarURL: gravatar.url(req.body.email, { s: "250", r: "pg", d: "identicon" },
  false),verificationToken });
  
  const verifyEmail = {
    from: SENDGRID_EMAIL,
    to:email,
    subject: "Verify email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click verify email</a>`,
  };
  
  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL : newUser.avatarURL,
    }
    
  });
}

const verify = async(req, res)=>{
  const {verificationToken} = req.params;
    const user = await authServices.findUser({verificationToken});

  if(!user){
    throw HttpError(404, "User not found");
  }
  await authServices.updateUser({_id:user._id}, {verify:true, verificationToken:null});
  res.json({message:"Verification successful"});

}

const resendVerify = async(req, res)=>{
const {email} = req.body;
const user = await authServices.findUser({email});
if(!user){
  throw HttpError(404, "Not found");
}
if(user.verify){
 throw HttpError(400,"Verification has already been passed"); 
}
const verifyEmail = {
  from: SENDGRID_EMAIL,
  to:email,
  subject: "Verify email",
  html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click verify email</a>`,
};

await sendEmail(verifyEmail);

res.json({
  message: "Verification email sent"
})
}

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.findUser({ email });
  
  if (!user) { 
    throw HttpError(401, "Email or password is wrong");
  }
  if(!user.verify){
    throw HttpError(401, "Email is not verified");
  }
  const comparePassword = await compareHash(password, user.password);
  if (!comparePassword) { 
    throw HttpError(401, "Email or password is wrong");
  }

  const { id: id } = user;
  const payload = {
    id,
  }

  const token = createToken(payload);

  await authServices.updateUser({ _id: id }, { token });


  res.json({
    token, user: {
      email: user.email,
      subscription: user.subscription
  } })
}
 
const getCurrent = (req, res) => { 
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription

  })
}

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const result = await authServices.updateUser({ _id }, { ...req.body});
  const { email, subscription } = result;
  res.status(200).json({ email, subscription });
}

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }
  const { path: tempFilePath, filename, mimetype } = req.file;
if (
      !["image/bmp", "image/jpeg", "image/png", "image/jpg"].includes(mimetype)
    ) {
      throw HttpError(400, "Invalid image format, must be jpeg, png, bmp");
    }

  
  const avatar = await Jimp.read(tempFilePath);
  const avatarName = `${_id}_${Date.now()}.jpg`
  const newAvatarPath = path.join(avatarsPath, avatarName);
  await avatar.cover(250,250).writeAsync(newAvatarPath);
  await fs.unlink(tempFilePath);
  const avatarRelativePath = path.join('avatars', filename);
   const result =  await authServices.updateUser({ _id }, { avatarURL: avatarRelativePath });

  res.status(200).json(
    {
     avatarUrl:result.avatarURL
    }
  )
}

const signout = async (req, res) => { 
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });
  res.status(204).json("No content");
}
export default {
  signup: controllerWrapper(signup),
  signin: controllerWrapper(signin),
  getCurrent: controllerWrapper(getCurrent),
  signout: controllerWrapper(signout),
  updateSubscription: controllerWrapper(updateSubscription),
  updateAvatar:controllerWrapper(updateAvatar),
  verify:controllerWrapper(verify),
  resendVerify:controllerWrapper(resendVerify)

}
import * as authServices from "../services/authServices.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";

const avatarsPath = path.resolve("public", "avatars");


import { createToken } from "../helpers/jwt.js";

const signup = async(req, res) => { 
  const { email } = req.body;

  const user = await authServices.findUser({ email });

  if (user) { 
    throw HttpError(409, "Email in use");
  }

  const newUser = await authServices.saveUser({ ...req.body, avatarURL: gravatar.url(req.body.email, { s: "250", r: "pg", d: "identicon" },
    false) });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL : newUser.avatarURL
    }
    
  });
}

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.findUser({ email });
  
  if (!user) { 
    throw HttpError(401, "Email or password is wrong");
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
  const { path: tempFilePath, filename, mimetype } = req.file;

if (
      !["image/bmp", "image/jpeg", "image/png", "image/jpg"].includes(mimetype)
    ) {
      throw HttpError(400, "Invalid image format, must be jpeg, png, bmp");
    }

    if (!tempFilePath) {
      throw HttpError(400, "No file uploaded");
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
  updateAvatar:controllerWrapper(updateAvatar)
}
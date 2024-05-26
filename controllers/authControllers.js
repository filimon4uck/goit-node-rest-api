import * as authServices from "../services/authServices.js";
import controllerWrapper from "../decorators/controllerWrapper.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";

import { createToken } from "../helpers/jwt.js";

const signup = async(req, res) => { 
  const { email } = req.body;

  const user = await authServices.findUser({ email });

  if (user) { 
    throw HttpError(409, "Email in use");
  }

  const newUser = await authServices.saveUser(req.body);

  res.status(201).json({
    email: newUser.email,
    ssubscription: newUser.subscription,
    
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
  updateSubscription: controllerWrapper(updateSubscription)
}
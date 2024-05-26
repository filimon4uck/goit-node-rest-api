import express from "express";
import authControllers from "../controllers/authControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js"
import isValidBody from "../middlewares/isValidBody.js"; 
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, isValidBody.authSignupValid, authControllers.signup);
authRouter.post("/login", isEmptyBody, isValidBody.authSigninValid, authControllers.signin);
authRouter.get("/current", authenticate, authControllers.getCurrent);
authRouter.post("/logout", authenticate, authControllers.signout);
authRouter.patch("/", authenticate, isEmptyBody, isValidBody.updateSubscriptionValid, authControllers.updateSubscription);


export default authRouter;
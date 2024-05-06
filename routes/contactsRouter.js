import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import isValidBody from "../middlewares/isValidBody.js";


const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", contactsControllers.getOneContact);

contactsRouter.delete("/:id", contactsControllers.deleteContact);

contactsRouter.post("/",isEmptyBody, isValidBody.createValid ,contactsControllers.createContact);

contactsRouter.put("/:id",isEmptyBody, isValidBody.updateValid, contactsControllers.updateContact);

export default contactsRouter;

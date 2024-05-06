import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import isBodyValid from "../middlewares/isBodyValid.js";


const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", contactsControllers.getOneContact);

contactsRouter.delete("/:id", contactsControllers.deleteContact);

contactsRouter.post("/",isBodyValid.createValid ,contactsControllers.createContact);

contactsRouter.put("/:id",isEmptyBody,isBodyValid.updateValid, contactsControllers.updateContact);

export default contactsRouter;

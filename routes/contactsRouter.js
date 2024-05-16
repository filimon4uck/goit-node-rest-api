import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import isValidBody from "../middlewares/isValidBody.js";
import isValidId from "../middlewares/isValidId.js";


const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.delete("/:id", contactsControllers.deleteContact);

contactsRouter.patch("/:id/favorite", isValidId, isEmptyBody, isValidBody.updateValid, contactsControllers.updateContact)

contactsRouter.post("/",isEmptyBody ,isValidBody.createValid,contactsControllers.createContact);

contactsRouter.put("/:id",isEmptyBody, isValidBody.updateValid, contactsControllers.updateContact);

export default contactsRouter;

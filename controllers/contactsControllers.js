import * as contactsServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js"
import controllerWrapper from "../decorators/controllerWrapper.js";

const  getAllContacts = async (req, res) => {
  const result = await contactsServices.listContacts();
  res.status(200).json(result);
};

const getOneContact = async(req, res) => {
  
    const { id } = req.params;
    const result = await contactsServices.getContactById(id);
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.status(200).json(result);
};

const deleteContact = async(req, res) => {
  
    const { id } = req.params;
    const result = await contactsServices.removeContact(id);
    console.log(result);
    if (!result) { 
      throw HttpError(404, `Not found`);
    }
    res.status(200).json(result);
};

const createContact = async(req, res) => {
    const result = await contactsServices.addContact(req.body);
    res.status(201).json(result);
};

const updateContact = async(req, res) => {
    const { id } = req.params;
    const result = await contactsServices.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, "Not found")
     }
    res.status(200).json(result);
};

export default {
  getAllContacts: controllerWrapper(getAllContacts),
  getOneContact: controllerWrapper(getOneContact),
  deleteContact: controllerWrapper(deleteContact),
  createContact: controllerWrapper(createContact),
  updateContact: controllerWrapper(updateContact),
};
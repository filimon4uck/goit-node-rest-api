import * as contactsServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js"
import controllerWrapper from "../decorators/controllerWrapper.js";

const getAllContacts = async (req, res) => {
  const { id: owner } = req.user;
  const { page = 1, limit = 10, favorite} = req.query;
  const skip = (page - 1) * limit;
  const settings = { skip, limit};
  const filter = { owner, ...(favorite && { favorite }) };
  const fields = "";

  const result = await contactsServices.listContacts({ filter, fields, settings });
  const total = await contactsServices.countContacts();
  res.status(200).json({result, total});
};

const getOneContact = async(req, res) => {
  
  const { id : _id } = req.params;
  const { _id: owner } = req.user;
    const result = await contactsServices.getContact({_id,owner});
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.status(200).json(result);
};

const deleteContact = async(req, res) => {
  
  const { id : _id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsServices.removeContact({_id, owner});
    if (!result) { 
      throw HttpError(404, `Not found`);
    }
    res.status(200).json(result);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await contactsServices.addContact({ ...req.body, owner});
    res.status(201).json(result);
};

const updateContact = async(req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsServices.updateContact({_id,owner}, req.body);
    if (!result) {
      throw HttpError(404, "Not found")
     }
    res.status(200).json(result);
};
const updateStatusContact = async (req, res) => {
  const { id } = req.params;
    const result = await contactsServices.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, "Not found")
     }
    res.status(200).json(result);
 }

export default {
  getAllContacts: controllerWrapper(getAllContacts),
  getOneContact: controllerWrapper(getOneContact),
  deleteContact: controllerWrapper(deleteContact),
  createContact: controllerWrapper(createContact),
  updateContact: controllerWrapper(updateContact),
  updateStatusContact:controllerWrapper(updateStatusContact),
};
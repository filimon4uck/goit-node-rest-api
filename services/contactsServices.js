import Contact from "../models/Contact.js"


const listContacts = () => Contact.find();

 

const getContactById = async _id => {
  const result = await Contact.findById(_id)
  return result;
 };
const addContact = data =>  Contact.create(data);
  
const updateContact =  (id, data) => Contact.findByIdAndUpdate(id, data);

const removeContact =  (contactId) => Contact.findByIdAndDelete(contactId);


export { listContacts, getContactById, removeContact, addContact, updateContact };  
 

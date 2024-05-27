import Contact from "../models/Contact.js"


const listContacts = (search = {}) => { 
  const { filter = {}, fields = "", settings = {} } = search;
  return Contact.find(filter, fields, settings)
};

const countContacts = filter => Contact.countDocuments(filter);
 

const getContact = async filter => Movie.findOne(filter);

const addContact = data =>  Contact.create(data);
  
const updateContact =  (filter, data) => Contact.findOneAndUpdate(filter, data);

const removeContact =  filter => Contact.findOneAndDelete(filter);


export { listContacts, getContact, removeContact, addContact, updateContact, countContacts };  
 

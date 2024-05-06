import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

const updateContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts,null,2));
}
 
const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

 const getContactById = async (contactId) => {
  const contact = await listContacts();
  return contact.find(item => item.id === contactId)||null
}
const updateContact = async (id, data) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(item => item.id === id);
  if (contactIndex === -1) {
    return null;
  }
  contacts[contactIndex] = { ...contacts[contactIndex], ...data };
  await updateContacts(contacts);
  return contacts[contactIndex];
 }

 const removeContact = async(contactId)=> {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(item => item.id === contactId);
  if (contactIndex === -1) {
    return null;

  }
  const [removedContact] = contacts.splice(contactIndex, 1);
  await updateContacts(contacts);
  return removedContact;
}

 const addContact = async (data) => {
  const id = nanoid();
  const newContact = { id, ...data };
  const contacts = await listContacts();
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
}

export { listContacts, getContactById, removeContact, addContact, updateContact };  
 

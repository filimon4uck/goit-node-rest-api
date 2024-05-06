import path from "path";
import fs from "fs/promises";

const contactsPath = path.resolve("db", "contacts.json");

const updateContacts = async (contacts) => {
  await fs.writeFile(path, JSON.stringify(contacts,null,2));
}
 
const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

export const getContactById = async (contactId) => {
  const contact = await listContacts();
  return contact.find(item => item.id === contactId)||null
  }

export const removeContact = async(contactId)=> {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(item => item.id === contactId);
  if (contactIndex === -1) {
    return null;

  }
  const [removedContact] = contacts.splice(contactIndex, 1);
  await updateContacts(contacts);
  return removedContact;
}

export const addContact = async (data) => {
  const id = nanoid();
  const newContact = { id, ...data };
  const contacts = await listContacts();
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
}
 

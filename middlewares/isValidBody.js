import validateBody from "../helpers/validateBody.js"
import * as contactsSchemas from "../schemas/contactsSchemas.js"

const createValid = validateBody(contactsSchemas.createContactSchema); 
const updateValid = validateBody(contactsSchemas.updateContactSchema);
const updateStatusValid = validateBody(contactsSchemas.updateStatusContactSchema);
 
export default { createValid, updateValid, updateStatusValid };
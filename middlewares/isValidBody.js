import validateBody from "../helpers/validateBody.js"
import * as authSchemas  from "../schemas/authSchema.js";
import * as contactsSchemas from "../schemas/contactsSchemas.js"

const createValid = validateBody(contactsSchemas.createContactSchema); 
const updateValid = validateBody(contactsSchemas.updateContactSchema);
const updateStatusValid = validateBody(contactsSchemas.updateStatusContactSchema);

const authSignupValid = validateBody(authSchemas.authSignupSchema);
const authSigninValid = validateBody(authSchemas.authSigninSchema);

const updateSubscriptionValid = validateBody(authSchemas.updateSubscriptionSchema);
 
export default { createValid, updateValid, updateStatusValid, authSignupValid, authSigninValid, updateSubscriptionValid};
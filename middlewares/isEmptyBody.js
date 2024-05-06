import HttpError from "../helpers/HttpError.js";
const isEmptyBody = (req, res, next) => {
  const { length } = Object.keys(req.body);

  if (!length) {
    switch (req.method) {
      case "POST": {
        return next(HttpError(400, "Body must have all fields"));
      }
      case "PUT": {
        return next(HttpError(400, "Body must have at least one field"));
        
       }
    }
    
  }
  next();

}
export default isEmptyBody;
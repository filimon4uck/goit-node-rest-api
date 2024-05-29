import mongoose from "mongoose";
import  request  from "supertest";
import app from "../app.js";
import { ENUM_SUBSCRIPTIONS } from "../constants/user-constants.js";

import { deleteAllUsers} from "../services/authServices.js";

const {DB_HOST, PORT=3000} = process.env;

describe("test /api/users/login", ()=>{
  let server = null;
  const loginUserData = {
    email:"filimon4uck.yura@gmail.com",
    password:"123456"
  };

  beforeAll(async()=>{
    await mongoose.connect(DB_HOST);
    server = app.listen(PORT);
  })
  
  afterAll(async()=>{
    await deleteAllUsers();
    await mongoose.connection.close();
    server.close();
  })

  test("test login with correct data", async()=>{
    
    const {statusCode, body} = await request(app).post("/api/users/login").send(loginUserData);
    expect(statusCode).toBe(200);
    expect(body.token).toEqual(expect.any(String));
    expect(body.user.email).toBe(loginUserData.email);
    expect(ENUM_SUBSCRIPTIONS).toContain(body.user.subscription);
  })

  test("test login with empty body", async()=>{
    
    const {statusCode, body} = await request(app).post("/api/users/login").send({});
    expect(statusCode).toBe(400);
    expect(body.message).toBe("Body must have at least one field");
  })

  test("test login without email", async()=>{
    
    const {statusCode, body} = await request(app).post("/api/users/login").send({password:"123456"});
    expect(statusCode).toBe(400);
    expect(body.message).toBe('"email" is required');
  })
  test("test login without password", async()=>{
    
    const {statusCode, body} = await request(app).post("/api/users/login").send({email:"filimon4uck.yura@gmail.com"});
    expect(statusCode).toBe(400);
    expect(body.message).toBe('"password" is required');
  })

  test("test login with wrong email", async()=>{
    
    const {statusCode, body} = await request(app).post("/api/users/login").send({email:"filimon4uck.yuragmail@d.com", password:"123456"});
    expect(statusCode).toBe(401);
    expect(body.message).toBe('Email or password is wrong');
  })
  test("test login with wrong password", async()=>{
    
    const {statusCode, body} = await request(app).post("/api/users/login").send({email:"filimon4uck.yura@gmail.com", password:"1234567"});
    expect(statusCode).toBe(401);
    expect(body.message).toBe('Email or password is wrong');
  })
})

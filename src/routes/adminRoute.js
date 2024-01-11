import express from "express";
const roleRoutes = express();

import { createRole, createAdmin } from "../controller/adminControler.js";

roleRoutes.post("/createRole", createRole);
roleRoutes.post("/createAdmin", createAdmin);

export default roleRoutes;

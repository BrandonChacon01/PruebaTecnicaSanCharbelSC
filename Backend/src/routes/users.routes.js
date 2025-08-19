import { Router } from "express";
import { 
    postNewUser
} from "../controllers/users.controllers.js";

const router = Router();

router.post("/users", postNewUser);


export default router;
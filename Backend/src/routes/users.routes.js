import { Router } from "express";
import { 
    postNewUser
} from "../controllers/users.controllers.js";

const router = Router();

router.post("/user/new", postNewUser);


export default router;
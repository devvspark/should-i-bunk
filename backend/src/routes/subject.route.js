import express from "express";
import { addSubject, shouldIBunk } from "../controller/subject.controller.js";
import isauthenticated from "../middleware/isAuthenticate.js";
const router = express.Router();

router.post("/", isauthenticated, addSubject);
router.get("/:id/bunk", isauthenticated, shouldIBunk);

export default router;

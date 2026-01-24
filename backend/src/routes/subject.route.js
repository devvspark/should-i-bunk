import express from "express";
import { addSubject, updateSubject,shouldIBunk,deleteSubject } from "../controller/subject.controller.js";
import isauthenticated from "../middleware/isAuthenticate.js";

const router = express.Router();

router.post("/", isauthenticated, addSubject);
router.put("/:id", isauthenticated, updateSubject);
router.get("/:id/bunk", isauthenticated, shouldIBunk);
router.delete("/:id", isauthenticated, deleteSubject);
export default router;

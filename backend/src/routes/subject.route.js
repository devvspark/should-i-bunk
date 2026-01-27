import express from "express";
import { addSubject, updateSubject,shouldIBunk,deleteSubject,getSubjects,getSubjectById } from "../controller/subject.controller.js";
import isauthenticated from "../middleware/isAuthenticate.js";

const router = express.Router();

router.post("/", isauthenticated, addSubject);
router.get("/", isauthenticated, getSubjects);
router.get("/:id", isauthenticated, getSubjectById);
router.put("/:id", isauthenticated, updateSubject);
router.get("/:id/bunk", isauthenticated, shouldIBunk);
router.delete("/:id", isauthenticated, deleteSubject);
export default router;

import express from 'express'
import getRoot from '../controllers/root/getRoot'
import postRoot from '../controllers/root/postRoot'
import multer from "multer";

const root = express.Router()

const upload = multer({ dest: "uploads/" });

root.get('/', getRoot)
root.post("/upload", upload.single("file"), postRoot);

export default root
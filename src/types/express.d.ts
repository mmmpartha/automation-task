// src/types/express.d.ts
import * as Multer from "multer";

declare global {
    namespace Express {
        interface Request {
            file?: Multer.File;
            files?: Multer.File[]; // If multiple files are supported
        }
    }
}

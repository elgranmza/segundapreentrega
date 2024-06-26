import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default __dirname;


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));


export const validatePassword = (user, password) => bcrypt.compareSync(password, user.password);


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `${__dirname}/public/images`);
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); 
    }
});


export const uploader = multer({ storage });

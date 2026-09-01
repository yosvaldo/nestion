import { v2 as Cloudinary } from "cloudinary";
import { CLOUDINARY_URL } from "../configs/env.config.js";

if (CLOUDINARY_URL) {
  Cloudinary.config({
    cloudinary_url: CLOUDINARY_URL,
  });
}

export default Cloudinary;
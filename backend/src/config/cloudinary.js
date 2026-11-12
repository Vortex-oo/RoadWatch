const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const cloudinary = require("cloudinary").v2;

const requiredConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};

const missingConfig = Object.entries(requiredConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

if (missingConfig.length) {
    throw new Error(
        `Missing Cloudinary environment variables: ${missingConfig.join(", ")}. ` +
        "Add them to backend/src/.env"
    );
}

cloudinary.config(requiredConfig);

module.exports = cloudinary;

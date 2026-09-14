import buildUploader from "../factories/build-uploader.factory.js";

export const avatarUploader = () => {
  return buildUploader(
    ["image/png", "image/jpeg", "image/jpg", "image/gif"],
    1 
  );
};

export const paymentProofUploader = () => {
  return buildUploader(
    ["image/png", "image/jpeg", "image/jpg"],
    1
  );
};

export const propertyImageUploader = () => {
  return buildUploader(
    ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    2
  );
};
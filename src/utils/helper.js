import { Connection } from "@solana/web3.js";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

const { NET_URL } = process.env;

export const uploadMiddleware = (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.uploadDir = "./public/uploads";
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject({ err });
      }

      const filePath = files.photo.filepath;
      const newFilePath = path.join(
        form.uploadDir,
        files.photo.originalFilename
      );

      fs.renameSync(filePath, newFilePath);

      resolve({
        fields,
        image: `/uploads/${files.photo.originalFilename}`,
      });
    });
  });
};

export const connection = new Connection(NET_URL, "confirmed");

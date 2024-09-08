import { Connection } from "@solana/web3.js";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";

const { NET_URL } = process.env;

export const uploadMiddleware = (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.uploadDir = "./public/uploads";
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject({ err: "Dosya yükleme hatası: " + err.message });
      }

      const uploadedFile = files.image && files.image[0];
      if (!uploadedFile) {
        return reject({ err: "Resim yüklenmedi" });
      }

      const filePath = uploadedFile.filepath || uploadedFile.path;
      const originalFilename =
        uploadedFile.originalFilename || uploadedFile.name;

      const uniqueFilename = `${uuidv4()}-${originalFilename}`;
      const newFilePath = path.join(form.uploadDir, uniqueFilename);

      try {
        fs.renameSync(filePath, newFilePath);

        const relativeFilePath = path.relative("public", newFilePath);

        resolve({
          fields,
          image: `/${relativeFilePath.replace(/\\+/g, "/")}`,
        });
      } catch (renameErr) {
        return reject({ err: renameErr.message });
      }
    });
  });
};

export const connection = new Connection(NET_URL, "confirmed");

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

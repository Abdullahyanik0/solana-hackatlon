import { Connection } from "@solana/web3.js";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Configuration, OpenAIApi } from "openai";
import dayjs from "dayjs";

const { NET_URL } = process.env;

export const removeUnknownCharacters = (character) => {
  return character?.replaceAll("&quot;", `"`).replaceAll("&amp;", `&`).replaceAll("&lt", `<`).replaceAll("&gt", `>`).replaceAll("&#039", `'`);
};

export function formatRelativeTime(date) {
  const now = dayjs();
  const diffInSeconds = now.diff(date, "second");

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  } else if (diffInSeconds < 3600) {
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    return `${diffInMinutes}m`;
  } else if (diffInSeconds < 86400) {
    const diffInHours = Math.floor(diffInSeconds / 3600);
    return `${diffInHours}h`;
  } else if (diffInSeconds < 2592000) {
    const diffInDays = Math.floor(diffInSeconds / 86400);
    return diffInDays < 28 ? `${diffInDays}d` : `${Math.floor(diffInDays / 7)}w`;
  } else {
    const diffInMonths = Math.floor(diffInSeconds / 2592000);
    return diffInMonths < 12 ? `${diffInMonths}m` : `${Math.floor(diffInMonths / 12)}y`;
  }
}


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
      const originalFilename = uploadedFile.originalFilename || uploadedFile.name;

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

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);


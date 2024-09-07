import clientPromise from "@/lib/mongodb";
import { uploadMiddleware } from "@/utils/helper";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("MemeMaster");

  if (req.method === "POST") {
    try {
      const { fields, image } = await uploadMiddleware(req);

      await db.collection("memes").insertOne({
        ...fields,
      });

      res.status(200).json({ message: "Success" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

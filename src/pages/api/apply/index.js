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

      const outputObject = Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [key, value[0]])
      );

      await db.collection("applies").insertOne({
        ...outputObject,
        image,
        like: [],
        unlike: [],
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

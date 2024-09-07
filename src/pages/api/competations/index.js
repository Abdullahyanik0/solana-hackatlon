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

      await db.collection("competitions").insertOne({
        ...fields,
        image,
        status: "Pending",
      });

      res.status(200).json({ message: "Success" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    try {
      const data = await db
        .collection("competitions")
        .find({ status: "Pending" })
        .toArray();

      res.status(200).json({ message: "Success", data });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

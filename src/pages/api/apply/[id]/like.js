import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("MemeMaster");

  if (req.method === "PUT") {
    const { id: _id } = req.query;
    const { address } = req.body;
    try {
      const apply = await db
        .collection("applies")
        .findOne({ _id: new ObjectId(_id) });

      if (apply.unlike.includes(address)) {
        await db
          .collection("applies")
          .updateOne(
            { _id: new ObjectId(_id) },
            { $pull: { unlike: address } }
          );
      }

      await db
        .collection("applies")
        .updateOne({ _id: new ObjectId(_id) }, { $push: { like: address } });

      res.status(200).json({ message: "Success" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

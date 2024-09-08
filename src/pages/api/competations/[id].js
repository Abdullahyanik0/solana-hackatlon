import { ObjectId } from "mongodb";
//local imports
import clientPromise from "@/lib/mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("MemeMaster");

  if (req.method === "GET") {
    const { id: _id } = req.query;
    try {
      const competitionDetail = await db
        .collection("competitions")
        .findOne({ _id: new ObjectId(_id) });

      const applies = await db
        .collection("applies")
        .find({ competationsId: String(competitionDetail?._id) })
        .toArray();

      res
        .status(200)
        .json({ message: "Success", data: { competitionDetail, applies } });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

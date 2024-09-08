import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("MemeMaster");

  if (req.method === "GET") {
    try {
      const competitions = await db
        .collection("competitions")
        .find({ status: "complete", winner: { $exists: true, $ne: null } })
        .toArray();

      const data = await Promise.all(
        await competitions.map(async (competition) => {
          const applies = await db.collection("applies").countDocuments({ competationsId: competition?._id });

          return { ...competition, applies };
        })
      );

      res.status(200).json({ message: "Success", data });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

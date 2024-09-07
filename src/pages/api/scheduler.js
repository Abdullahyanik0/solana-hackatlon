/* eslint-disable import/no-anonymous-default-export */
import cron from "node-cron";
import {
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  Metaplex,
  bundlrStorage,
  keypairIdentity,
} from "@metaplex-foundation/js";
import {
  createCreateMetadataAccountV2Instruction,
  Metadata,
  createMintToInstruction,
} from "@metaplex-foundation/mpl-token-metadata";
//localhost
import clientPromise from "@/lib/mongodb";
import connection from "../../lib/solana";

const { TEST_PRIVATE_KEY } = process.env;

const createAndTransferNfts = async (
  _metaplex,
  payer,
  mint,
  competition,
  winnerAddress
) => {
  const metadata = await Metadata.getPDA(mint);

  const creators = [
    {
      address: new PublicKey(winnerAddress),
      verified: true,
      share: 10000,
    },
  ];

  const metadataTransaction = new Transaction().add(
    createCreateMetadataAccountV2Instruction(
      {
        metadata,
        mint,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: payer.publicKey,
      },
      {
        createMetadataAccountArgsV2: {
          data: {
            name: `${competition.name}-winner`,
            symbol: "",
            uri: competition.image,
            sellerFeeBasisPoints: 500,
            creators: creators.length > 0 ? creators : null,
          },
          isMutable: true,
        },
      }
    )
  );

  await sendAndConfirmTransaction(connection, metadataTransaction, [payer]);

  const recipientTokenAccount = await _metaplex
    .tokens()
    .getAssociatedTokenAddress({
      mint,
      owner: new PublicKey(winnerAddress),
    });

  const transferTransaction = new Transaction().add(
    createMintToInstruction(mint, recipientTokenAccount, payer.publicKey, 1)
  );

  await sendAndConfirmTransaction(connection, transferTransaction, [payer]);
};

cron.schedule("* * * * *", async () => {
  try {
    const client = await clientPromise;
    const db = client.db("MemeMaster");
    const now = new Date();

    const expiredCompetitions = await db
      .collection("competitions")
      .find({ expireTime: { $lt: now }, status: { $ne: "complete" } })
      .toArray();

    if (expiredCompetitions.length > 0) {
      for (const competition of expiredCompetitions) {
        await db
          .collection("competitions")
          .updateOne(
            { _id: competition._id },
            { $set: { status: "complete" } }
          );

        const winner = await db
          .collection("applies")
          .find({
            competitionId: competition._id,
          })
          .sort({ "like.length": -1 })
          .limit(1)
          .toArray();

        const privateKey = Uint8Array.from(TEST_PRIVATE_KEY);
        const senderKeypair = Keypair.fromSecretKey(privateKey);

        const metaplex = Metaplex.make(connection)
          .use(keypairIdentity(senderKeypair))
          .use(bundlrStorage());

        const mint = await metaplex.nfts().create({
          uri: competition.image,
          name: `${competition.name}-winner`,
          sellerFeeBasisPoints: 500,
        });

        await createAndTransferNfts(
          metaplex,
          senderKeypair,
          mint.mintAddress,
          competition,
          winner[0].creator
        );
      }
    }
  } catch (error) {
    console.error("Error running the scheduled task:", error);
  } finally {
    await client.close();
  }
});

export default (req, res) => {
  res.status(200).json({ message: "Scheduler is running" });
};

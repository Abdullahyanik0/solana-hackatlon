/* eslint-disable import/no-anonymous-default-export */
import cron from "node-cron";
import {
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  Metaplex,
  bundlrStorage,
  keypairIdentity,
} from "@metaplex-foundation/js";
import {
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import clientPromise from "@/lib/mongodb";
import connection from "../../lib/solana";

const { TEST_PRIVATE_KEY } = process.env;

const transferReward = async (payer, winnerAddress, rewardAmount) => {
  const recipientPublicKey = new PublicKey(winnerAddress);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: recipientPublicKey,
      lamports: rewardAmount * 1000000000,
    })
  );

  await sendAndConfirmTransaction(connection, transaction, [payer]);
};

const mintAndTransferNft = async (
  metaplex,
  payer,
  mintAddress,
  winnerAddress
) => {
  const recipientTokenAccount = await metaplex
    .tokens()
    .getAssociatedTokenAddress({
      mint: mintAddress,
      owner: new PublicKey(winnerAddress),
    });

  const createTokenAccountTx = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      payer.publicKey,
      recipientTokenAccount,
      new PublicKey(winnerAddress),
      mintAddress
    )
  );

  await sendAndConfirmTransaction(connection, createTokenAccountTx, [payer]);

  const mintToTx = new Transaction().add(
    createMintToInstruction(
      mintAddress,
      recipientTokenAccount,
      payer.publicKey,
      1
    )
  );

  await sendAndConfirmTransaction(connection, mintToTx, [payer]);
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

        if (winner.length === 0) continue;

        const privateKey = Uint8Array.from(TEST_PRIVATE_KEY);
        const senderKeypair = Keypair.fromSecretKey(privateKey);

        const metaplex = Metaplex.make(connection)
          .use(keypairIdentity(senderKeypair))
          .use(bundlrStorage());

        const { nft } = await metaplex.nfts().create({
          uri: competition.image,
          name: `${competition.name}-winner`,
          sellerFeeBasisPoints: 500,
          creators: [
            {
              address: new PublicKey(winner[0].creator),
              verified: true,
              share: 10000,
            },
          ],
        });

        const rewardAmount = competition.reward;
        await transferReward(senderKeypair, winner[0].creator, rewardAmount);

        await mintAndTransferNft(
          metaplex,
          senderKeypair,
          nft.mintAddress,
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

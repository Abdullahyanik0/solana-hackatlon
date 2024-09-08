import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";

import { connection } from "@/utils/helper";

const { TEST_PRIVATE_KEY } = process.env;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { fileName, name, creator } = req.body;
    try {
      const privateKeyArray = JSON.parse(TEST_PRIVATE_KEY);
      const privateKey = new Uint8Array(privateKeyArray);
      const senderKeypair = Keypair.fromSecretKey(privateKey);

      const metaplex = Metaplex.make(connection).use(
        keypairIdentity(senderKeypair)
      );

      //ımage upload doesnt work!!
      const { nft } = await metaplex.nfts().create({
        uri: "https://miro.medium.com/v2/resize:fit:1200/0*32FMZrTapTYRrKoc.jpeg",
        name: `${name}-winner`,
        sellerFeeBasisPoints: 500,
        creators: [
          {
            address: new PublicKey(creator),
            verified: true,
            share: 100,
          },
        ],
      });

      const recipientTokenAddress = await getAssociatedTokenAddress(
        nft.mint.address,
        new PublicKey(creator)
      );

      const createTokenAccountIx = createAssociatedTokenAccountInstruction(
        senderKeypair.publicKey,
        recipientTokenAddress,
        new PublicKey(creator),
        nft.mint.address
      );

      const transferIx = createTransferInstruction(
        await getAssociatedTokenAddress(
          nft.mint.address,
          senderKeypair.publicKey
        ),
        recipientTokenAddress,
        senderKeypair.publicKey,
        1,
        []
      );

      console.log(
        "Transaction Instructions:",
        createTokenAccountIx,
        transferIx
      );

      const transaction = new Transaction()
        .add(createTokenAccountIx)
        .add(transferIx);

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderKeypair.publicKey;

      await transaction.sign(senderKeypair);

      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [senderKeypair]
      );

      res.status(200).json({ message: "Success", signature });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: error.message || error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

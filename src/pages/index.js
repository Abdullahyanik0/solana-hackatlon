import { Button, Modal, TextInput, NumberInput, Textarea, FileInput, Loader } from "@mantine/core";
import CompetitionCard from "@/components/CompetitionCard";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { DateTimePicker } from "@mantine/dates";
import Masonry from "react-masonry-css";
import { createCompetitionService, getCompetitionService } from "@/service/competition";
import { useQuery } from "react-query";
import { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { errorNotify } from "@/components/Notification";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

const breakpointColumnsObj = { default: 4, 1000: 2, 750: 1 };

const Competition = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const [loading, setLoading] = useState(false);

  const { connection } = useConnection();
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const walletAdress = publicKey?.toBase58();

  const fetchCompetitions = async () => {
    const data = await getCompetitionService();
    return data?.data?.data;
  };

  const { data, error, isLoading, refetch } = useQuery(["competitions"], fetchCompetitions);

  console.log(connection);
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      reward: "",
      expireTime: "",
      image: "",
    },

    validate: {
      name: (value) => (value.length > 0 ? null : "Contest name is required"),
      description: (value) => (value.length > 0 ? null : "Description is required"),
      reward: (value) => (value && value > 0 ? null : "Reward amount must be a positive value"),
      expireTime: (value) => {
        const now = new Date();
        const expireDate = new Date(value);
        return expireDate > now ? null : "Expiration date must be in the future";
      },
    },
  });

  const formOnSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    try {
      await handleTransfer();
      await createCompetitionService({ ...values, creator: walletAdress });
      form.reset();
      close();
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  });
  const handleTransfer = useCallback(async () => {
    const recipientAddress = "HehJjPEkBkCehC3qhSdcbDS9okKXZPpZTxjLFN8C7Sft";
    const recipientPubKey = new PublicKey(recipientAddress);
    const lamports = 0.1 * 1000000000;

    try {
      const connection = new Connection("https://api.testnet.solana.com", "confirmed");

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports,
        })
      );

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signedTransaction = await signTransaction(transaction);

      const signature = await sendTransaction(signedTransaction, connection);
    } catch (error) {
      console.error("Transfer işlemi başarısız:", error);
      alert("Transfer işlemi başarısız oldu.");
    }
  }, [publicKey, sendTransaction, signTransaction, connection]);

  console.log(data);
  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center gap-4">
        <h1>Competition</h1>
        <Button
          onClick={() => {
            walletAdress ? open() : errorNotify("Please log in");
          }}
        >
          Create Competition
        </Button>
      </div>
      {data && (
        <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid w-full" columnClassName="my-masonry-grid_column">
          {data?.map((item, i) => (
            <CompetitionCard key={i} item={item} />
          ))}
        </Masonry>
      )}
      {!data ||
        (data?.length == 0 && (
          <div className="flex justify-center items-center">
            <h2> No task has been added yet.</h2>
          </div>
        ))}
      {isLoading && (
        <div className="flex justify-center items-center">
          <Loader size="lg" />
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center">
          <h2>An error has occurred</h2>
        </div>
      )}

      <Modal size="md" centered opened={opened} onClose={close} title="Create Competition">
        <form className="space-y-4" onSubmit={formOnSubmit}>
          {form.values.image ? (
            <div className="relative">
              <img src={URL.createObjectURL(form.values.image)} alt="image" />
              <button
                onClick={() => form.setFieldValue("image", null)}
                type="button"
                className="absolute top-2 right-2 bg-red-400 border-red-600 w-6 h-6 rounded-full"
              >
                x
              </button>
            </div>
          ) : (
            <FileInput label="Upload image" placeholder="Upload image" {...form.getInputProps("image")} accept="image/png,image/jpeg" />
          )}

          <TextInput label="Competition Name" placeholder="Competition name" {...form.getInputProps("name")} />
          <TextInput type="decimal" label="Reward" placeholder="Reward amount" {...form.getInputProps("reward")} min={0} />
          <Textarea label="Description" placeholder="Competition description" {...form.getInputProps("description")} />
          <DateTimePicker
            minDate={new Date()}
            valueFormat="DD/MM/YYYY HH:mm:ss"
            label="Expiration Time"
            placeholder="Expiration time (e.g., 12.02.2024)"
            {...form.getInputProps("expireTime")}
          />

          <Button disabled={!form.values.image} loading={loading} fullWidth mt="md" type="submit">
            Submit
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Competition;

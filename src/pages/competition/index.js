import { Button, Group, Modal, TextInput, NumberInput, Textarea, FileButton, FileInput } from "@mantine/core";
import CompetitionCard from "@/components/CompetitionCard";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { competitionArr } from "@/data";
import { DateInput } from "@mantine/dates";
import Masonry from "react-masonry-css";
import { useEffect } from "react";

const Competition = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const breakpointColumnsObj = { default: 4, 1000: 2, 750: 1 };

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      reward: "",
      expireTime: "",
      creator: "",
      image: "",
    },

    validate: {
      name: (value) => (value.length > 0 ? null : "Contest name is required"),
      description: (value) => (value.length > 0 ? null : "Description is required"),
      reward: (value) =>
        value && value > 0 ? null : "Reward amount must be a positive value",
      expireTime: (value) => {
        const now = new Date();
        const expireDate = new Date(value);
        return expireDate > now ? null : "Expiration date must be in the future";
      },
      creator: (value) => (value.length > 0 ? null : "Creator information is required"),
      image: (value) => (value.length > 0 ? null : "Image link is required"),
    },
  });

  const formOnSubmit = form.onSubmit(async (values) => {
    console.log("Yarışma verileri", values);
  });

  /* const getCompetitions = async()=>{
    try {
      await 
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCompetitions()
  }, []) */

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center gap-4">
        <h1>Competition</h1>
        <Button onClick={open}>Create Competition</Button>
      </div>
      <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid w-full" columnClassName="my-masonry-grid_column">
        {competitionArr?.map((item, i) => (
          <CompetitionCard key={i} item={item} />
        ))}
      </Masonry>

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
          <TextInput type="number" label="Reward" placeholder="Reward amount" {...form.getInputProps("reward")} min={0} />
          <Textarea label="Description" placeholder="pCompetition description" {...form.getInputProps("description")} />
          <DateInput
            valueFormat="YYYY MMM DD"
            label="Expiration Time"
            placeholder="Expiration time (e.g., 12.02.2024)"
            {...form.getInputProps("expireTime")}
          />
          <TextInput label="Creator" placeholder="Competition creator" {...form.getInputProps("creator")} />

          <Button fullWidth mt="md" type="submit">
            Submit
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Competition;

import { Button, Group, Modal, TextInput, NumberInput, Textarea, FileButton, FileInput } from "@mantine/core";
import CompetitionCard from "@/components/CompetitionCard";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { competitionArr } from "@/data";
import { DateInput } from "@mantine/dates";

const Competition = () => {
  const [opened, { open, close }] = useDisclosure(false);

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
      name: (value) => (value.length > 0 ? null : "Yarışma ismi gereklidir"),
      description: (value) => (value.length > 0 ? null : "Açıklama gereklidir"),
      reward: (value) => (value > 0 ? null : "Ödül miktarı pozitif bir değer olmalıdır"),
    },
  });

  const formOnSubmit = form.onSubmit(async (values) => {
    console.log("Yarışma verileri", values);
  });

  return (
    <div className="mt-4 w-full">
      <div className="mb-4 flex justify-between items-center gap-4">
        <h1>Competition</h1>
        <Button onClick={open}>Create Competition</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
        {competitionArr?.map((item, i) => (
          <CompetitionCard key={i} item={item} />
        ))}
      </div>

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
          <Textarea label="Description" placeholder="Competition description" {...form.getInputProps("description")} />
          <TextInput type="number" label="Reward" placeholder="Reward amount" {...form.getInputProps("reward")} min={0} />
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

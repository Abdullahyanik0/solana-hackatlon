/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { LuMousePointerClick } from "react-icons/lu";
import SingleMemeComponent from "@/components/SingleMemeComponent";
import { getMemeTemplate } from "@/service/meme";
import { Button, TextInput } from "@mantine/core";
import { useRouter } from "next/router";

const Generate = () => {
  const router = useRouter()
  const [file, setFile] = useState("");
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fileTypes = ["JPG", "PNG", "GIF"];

  const fetchTemplates = async () => {
    if (!imageName) return;
    if (!file) return;
    setLoading(true);
    try {
      const res = await getMemeTemplate(imageName);
      setData([]);
      setData(res?.data?.data.map((item) => ({ ...item, image_name: URL.createObjectURL(file) })));
      router.replace("/generate#gallery");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (file) => {
    setFile(file);
  };

  const handleClearClick = () => {
    setFile("");
  };

  return (
    <div>
      <div className="flex flex-col items-center mt-24 w-full">
        <h1 className="font-display text-jacarta-700  text-3xl text-center dark:text-white">
          {file ? "Make a meme" : "Upload an image to get started"}
        </h1>
        <div className="mt-6">
          <div className="mb-6">
            {file && <img src={URL.createObjectURL(file)} alt="meme" className="w-[500px] h-[300px] object-cover" />}

            {!file && (
              <div className="sm:w-[500px] h-[300px] group bg-black px-2  group relative flex max-w-md rounded-lg border-2 border-dashed  text-center">
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 group-hover:hidden">
                  <div className="relative z-10 cursor-pointer">
                    <LuMousePointerClick size={32} />
                  </div>
                  <p className=" mx-auto text-xs text-white ">JPG, PNG Max size: 5 MB</p>
                </div>
                <FileUploader handleChange={handleChange} name="file" types={fileTypes} classes="file-drag" maxSize={100} minSize={0} />
              </div>
            )}
            {file && (
              <button onClick={handleClearClick} className="mt-4 text-sm text-jacarta-700 dark:text-white hover:underline">
                Delete image
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-center w-full">
          <div className="flex items-center  w-full max-w-md">
            <TextInput
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchTemplates();
                }
              }}
              className="!w-full"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="Tell me about your dream meme"
            />
            <Button className="-ml-1" loading={loading} onClick={fetchTemplates}>
              Send
            </Button>
          </div>
        </div>
        <div id="gallery" className="pt-16 mt-4 w-full">
          {data?.map((_, i) => (
            <SingleMemeComponent key={i} data={[data[i]]} img={file && URL.createObjectURL(file)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Generate;

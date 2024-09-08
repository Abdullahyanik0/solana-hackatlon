/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { LuMousePointerClick } from "react-icons/lu";
import SingleMemeComponent from "@/components/SingleMemeComponent";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";

const MemeMaker = () => {
  const [file, setFile] = useState("");
  const [files, setFiles] = useState("");
  const [img, setImg] = useState(null);
  const [imgQuery, setImgQuery] = useState(false);

  const { publicKey } = useWallet();

  const fileTypes = ["JPG", "PNG", "GIF"];

  const handleChange = (file) => {
    setFile(file);
    setFiles(file);
    setImg(URL.createObjectURL(file));
  };

  const handleClearClick = () => {
    setFile("");
    setImg(null);
  };
  const [memeData, setMemeData] = useState([
    {
      width: 500,
      image_name: img,
      captions: [
        {
          x: 75,
          y: 50,
          borderColor: "#000",
          fontColor: "#ffffff",
          fontSize: 20,
          fontFamily: null,
          text: "Meme text goes here",
          width: 350,
          height: 41,
        },
        {
          x: 75,
          y: 200,
          borderColor: "#000",
          fontColor: "#ffffff",
          fontSize: 20,
          fontFamily: null,
          text: "Meme text goes here",
          width: 350,
          height: 41,
        },
      ],
    },
  ]);


  const { query, isReady, push } = useRouter();

  const newData = memeData.map((item) => {
    return { ...item, image_name: query.image };
  });

  useEffect(() => {
    setMemeData(newData);
    setImgQuery(!!query.image ? true : false);
    setFile(query.image);
    setFiles(query.image);
    setImg(query.image);
    if (isReady) {
      push({}, undefined, { shallow: true });
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center mt-24 w-full">
        <h1 className="font-display text-jacarta-700  text-3xl text-center dark:text-white">
          {file ? "Make a meme" : "Upload an image to get started"}
        </h1>
        <div className="mt-6">
          <div className="mb-6">
            {file && <SingleMemeComponent file={imgQuery ? null : files} data={memeData} img={img} />}

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
      </div>
    </div>
  );
};

export default MemeMaker;

/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { toPng } from "html-to-image";
import { BsDownload } from "react-icons/bs";
import { successNotify, errorNotify } from "./Notification";
import { useDisclosure } from "@mantine/hooks";
import Loading from "@/components/Loading";
import FitTextDiv from "@/components/FitTextDiv";

const MemeComponent = ({ data, setData, file }) => {
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const imageRef = useRef();

  const [border, setBorder] = useState(false);
  const handleResize = (item, index) => {
    setData((prevState) => {
      const newData = [...prevState];
      newData[index].captions[item.j].width = item.width;
      newData[index].captions[item.j].height = item.height;
      newData[index].captions[item.j].x = item.x;
      newData[index].captions[item.j].y = item.y;
      return newData;
    });
  };

  const handleWidth = (item, index) => {
    setData((prevState) => {
      const newData = [...prevState];
      newData[index].captions[item.j].x = item.x;
      newData[index].captions[item.j].y = item.y;
      return newData;
    });
  };

  const handleDownload = async (i) => {
    setLoading(true);
    setBorder(true);

    if (data?.[i]?.image_name.includes(".gif")) {
      await downloadGifMemeService(data?.[i])
        .then((response) => {
          const url = URL.createObjectURL(new Blob([response.data], { type: "image/gif" }));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "");
          document.body.appendChild(link);
          link.click();
          setLoading(false);
          setBorder(false);
        })
        .catch(() => {
          setLoading(false);
          setBorder(false);
        });
    } else {
      const element = document.querySelectorAll(".meme-box")[i];

      let random = Math.floor(100000 + Math.random() * 900000);
      const img = new Image();

      if (!data[i]?._id && !file) {
        const imgElement = element.querySelector("img");
        imgElement.src = data[i]?.image_name;
      } else if (file) {
        const {
          data: { fileName },
        } = await savePictureService(file);

        const imgElement = element.querySelector("img");
        imgElement.src = fileName;
      }
      img.onload = () => {
        toPng(element, { crossOrigin: "Anonymous" })
          .then(function (dataUrl) {
            const link = document.createElement("a");
            link.download = `meme${random}.png`;
            link.href = dataUrl;
            link.click();
            successNotify("Success", "Meme Downloaded Successfully");
            setLoading(false);
          })
          .catch(function (error) {
            console.error("oops, something went wrong!", error);
            errorNotify("Failed", "Something went wrong!");
            setLoading(false);
          });
      };
      setTimeout(() => {
        setBorder(false);
      }, 2500);
      img.src = element.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, "$2");
    }
  };

  return (
    <>
      {data?.map((item, i) => {
        return (
          <div className="relative lg:min-w-[500px] max-w-[500px]" key={i}>
            <div
              className=" bg-cover bg-center meme-box relative overflow-hidden"
              style={{
                backgroundImage: `url(${item?.image_name})`,
                maxWidth: 500,
              }}
            >
              <img
                ref={imageRef}
                className="overflow-hidden bg-cover bg-center  w-full h-full"
                src={item?.image_name}
                alt="meme"
                styles="visibility: hidden;"
              />
              {item?.captions?.map((caption, j) => (
                <Rnd
                  maxWidth={imageRef?.current?.width}
                  minWidth={100}
                  minHeight={20}
                  key={j}
                  bounds="parent"
                  className={`text-center uppercase ${
                    !border && "meme-resize"
                  }  border-dashed  border-2 border-transparent !flex !justify-center !items-center`}
                  position={{
                    x: caption.x,
                    y: caption.y,
                    width: caption.width,
                    height: caption.height,
                  }}
                  onDragStop={(e, d) => {
                    handleWidth({ x: d.x, y: d.y, j }, i);
                  }}
                  onResize={(e, direction, ref, delta, position) => {
                    handleResize(
                      {
                        width: ref.offsetWidth,
                        height: ref.offsetHeight,
                        ...position,
                        j,
                      },
                      i
                    );
                  }}
                >
                  <FitTextDiv
                    className="text-fit resizable"
                    style={{
                      width: caption.width,
                      height: caption.height,
                      color: caption.fontColor,
                    }}
                  >
                    {caption.text}
                  </FitTextDiv>
                </Rnd>
              ))}
            </div>
            <div className="my-10 flex flex-wrap justify-center gap-4">
              <button
                className="flex items-center gap-1 justify-center disabled:bg-accent/50 bg-accent shadow-accent-volume hover:bg-accent-dark w-40 rounded-full py-3 px-8  text-center font-semibold text-white transition-all"
                disabled={loading}
                onClick={() => handleDownload(i)}
              >
                Download
                <span className="pl-1">{loading ? <Loading color="white" variant="oval" size="sm" /> : <BsDownload size={22} />}</span>
              </button>
            </div>

            <p className="dark:text-jacarta-300 mb-12 text-center text-sm">Drag and drop meme text to change text position and size</p>
          </div>
        );
      })}
    </>
  );
};

export default MemeComponent;

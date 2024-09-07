/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { toPng } from "html-to-image";
import { AiOutlinePlus } from "react-icons/ai";
import { BsDownload } from "react-icons/bs";
import { successNotify, errorNotify } from "@/components/Notification";
import FitTextDiv from "@/components/FitTextDiv";
import { Loading } from "@/components/Loading";
import { Button } from "@mantine/core";

const SingleMemeComponent = ({ data: newData, img, refetch, file, handleClose }) => {
  const [border, setBorder] = useState(false);
  const [loading, setLoading] = useState(false);

  const imageRef = useRef();

  const [data, setData] = useState(newData);
  console.log(data);
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

  const handleCaptionUpdate = (e, i, j) => {
    const { name, value } = e.target;
    setData((prevState) => {
      const newData = [...prevState];
      newData[i].captions[j] = { ...newData[i].captions[j], [name]: value };
      return newData;
    });
  };
  const heightRef = useRef();
  const footerHeight = heightRef?.current?.offsetHeight - 65;

  const handleAddCaption = (defaultY, defaultText) => {
    setData((prevState) => {
      const newData = prevState.map((item) => {
        return {
          ...item,
          captions: [
            ...item.captions,
            {
              x: 20,
              y: defaultY || data[0]?.captions?.length * 30,
              borderColor: "#000",
              fontColor: "#ffffff",
              fontSize: 18,
              fontFamily: null,
              text: defaultText || "Meme text goes here",
              width: 400,
              height: 41,
            },
          ],
        };
      });
      return newData;
    });
  };

  const handleDeleteCaption = (i, j) => {
    const newData = [...data];
    const newCaptions = newData[i].captions.filter((_, index) => index !== j);
    newData[i].captions = newCaptions;
    setData(newData);
  };

  const handleHeaderUpdate = (e) => {
    const { value } = e.target;
    setData((prevState) => prevState.map((item) => ({ ...item, header: value })));
  };
  const handleFooterUpdate = (e) => {
    const { value } = e.target;
    setData((prevState) => prevState.map((item) => ({ ...item, footer: value })));
  };

  const handleHeaderDelete = () => {
    setData((prevState) => prevState.map((item) => ({ ...item, header: "" })));
  };
  const handleFooterDelete = () => {
    setData((prevState) => prevState.map((item) => ({ ...item, footer: "" })));
  };

  const handleDownload = async (i) => {
    setLoading(true);
    setBorder(true);

    if (data?.[i]?.image_name?.includes(".gif")) {
      await downloadGifMemeService(data?.[i])
        .then((response) => {
          console.log(response);
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
      const element = document.querySelectorAll(".meme-box-single")[i];

      let random = Math.floor(100000 + Math.random() * 900000);
      const newImage = new Image();

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

      newImage.onload = () => {
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
      newImage.src = element.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, "$2");

      setTimeout(() => {
        setBorder(false);
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row-reverse xl:items-start items-center justify-center w-full  mt-10 gap-x-10  relative ">
      {data?.map((item, i) => {
        return (
          <div className="lg:min-w-[500px] max-w-[500px]w-full " key={i}>
            <p className="text-lg font-semibold mb-1">{item.header}</p>
            <div
              ref={heightRef}
              className=" bg-cover bg-center  relative meme-box-single overflow-hidden"
              style={{
                backgroundImage: img ? `url(${img})` : `url(${item?.image_name})`,
                maxWidth: 500,
              }}
            >
              <img ref={imageRef} src={img || item?.image_name} alt="meme" className="w-full h-full overflow-hidden" styles="visibility: hidden;" />
              {item?.captions?.map((caption, j) => (
                <Rnd
                  maxWidth={imageRef?.current?.width}
                  minWidth={100}
                  minHeight={20}
                  key={j}
                  bounds="parent"
                  className={`text-center uppercase ${
                    !border && "meme-resize"
                  }  border-dashed hover:bg-red-100/20 border-2 border-transparent !flex !justify-center !items-center absolute group`}
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
                    textLength={caption.text.length}
                    className="text-fit resizable"
                    style={{
                      width: caption.width,
                      height: caption.height,
                      color: caption.fontColor,
                    }}
                  >
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-0 left-0 w-2 h-2 group-hover:bg-accent "></div>
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-0 -right-2 w-2 h-2 group-hover:bg-accent "></div>
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 -bottom-2 left-0 w-2 h-2 group-hover:bg-accent "></div>
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 -bottom-2 -right-2 w-2 h-2 group-hover:bg-accent "></div>
                    {caption.text}
                  </FitTextDiv>
                </Rnd>
              ))}

              <div
                style={{
                  textShadow: `-1px 0 ${"#000"}, 0 1px ${"#000"}, 1px 0 ${"#000"}, 0 -1px ${"#000"}`,
                }}
                className="absolute bottom-[2px] right-1 font-semibold select-none text-white flex items-center gap-1 text-[10px] "
              >
                <img className="w-4" src="/icon.png" alt="Yufin ai" />
                yufin.ai
              </div>
            </div>
            <p className="text-lg font-semibold">{item.footer}</p>
            <div className="my-10 flex flex-wrap justify-center gap-4 ">
              <Button onClick={() => handleDownload(i)} disabled={loading}>
                Download
                <span className="pl-1">{loading ? <Loading color="white" variant="oval" size="sm" /> : <BsDownload size={22} />}</span>
              </Button>
            </div>
          </div>
        );
      })}

      <div className="flex flex-col gap-4 w-full px-4">
        {!newData?.[0]?.image_name?.includes(".gif") && (
          <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-4">
            <button
              className="flex w-full whitespace-nowrap justify-center items-center gap-2 bg-accent shadow-accent-volume hover:bg-accent-dark  rounded-full py-3 px-8  text-center font-semibold text-white transition-all"
              onClick={() => handleAddCaption()}
            >
              New Text
              <span className="pl-1">
                <AiOutlinePlus size={20} />
              </span>
            </button>
            <button
              className="flex w-full justify-center items-center gap-2 bg-accent shadow-accent-volume hover:bg-accent-dark  rounded-full py-3 px-8  text-center font-semibold text-white transition-all"
              onClick={() => handleAddCaption(1, "Meme header goes here")}
            >
              Header
              <span className="pl-1">
                <AiOutlinePlus size={20} />
              </span>
            </button>
            <button
              className="flex w-full justify-center items-center gap-2 bg-accent shadow-accent-volume hover:bg-accent-dark  rounded-full py-3 px-8  text-center font-semibold text-white transition-all"
              onClick={() => handleAddCaption(footerHeight, "Meme footer goes here")}
            >
              Footer
              <span className="pl-1">
                <AiOutlinePlus size={20} />
              </span>
            </button>
          </div>
        )}

        {data?.map((item, i) => (
          <div className="flex flex-col gap-4" key={i}>
            {item?.header && !item?.image_name.includes(".gif") && (
              <div className="w-full relative flex h-10  ">
                <input
                  onChange={(e) => handleHeaderUpdate(e)}
                  className="w-full rounded-l-lg border-jacarta-200 py-4 hover:ring-1 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder:text-jacarta-300 h-10  border-[1px] pl-3"
                  type="text"
                  name="header"
                  defaultValue={item?.header}
                  placeholder="Generate memes from any text"
                />
                <button
                  className="bg-gray-100  border-gray-500 border-[1px] px-2 rounded-r-lg h-full p-1 text-black font-semibold "
                  onClick={() => handleHeaderDelete()}
                >
                  X
                </button>
              </div>
            )}

            {item?.footer && !item?.image_name.includes(".gif") && (
              <div className="w-full relative flex h-10  ">
                <input
                  type="text"
                  name="footer"
                  defaultValue={item?.footer}
                  onChange={(e) => handleFooterUpdate(e)}
                  className="w-full rounded-l-lg border-jacarta-200 py-4 hover:ring-1 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder:text-jacarta-300 h-10 border-[1px] pl-3"
                  placeholder="Generate memes from any text"
                />
                <button
                  className="bg-gray-100  border-gray-500 border-[1px] px-2 rounded-r-lg h-full p-1 text-black font-semibold "
                  onClick={() => handleFooterDelete()}
                >
                  X
                </button>
              </div>
            )}

            {item?.captions?.map((caption, j) => (
              <div className="flex flex-col gap-2" key={j}>
                <div className="w-full relative flex h-10  ">
                  <input
                    className="w-full rounded-l-lg border-jacarta-200 py-4 hover:ring-1 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:text-white dark:placeholder:text-jacarta-300 h-10 border-[1px] pl-3"
                    type="text"
                    name="text"
                    defaultValue={caption?.text}
                    onChange={(e) => handleCaptionUpdate(e, i, j)}
                    placeholder="Generate memes from any text"
                  />

                  <div className=" flex items-center  justify-center  h-full transform  bg-transparent text-center font-semibold text-white transition-all">
                    {!newData?.[0]?.image_name?.includes(".gif") && (
                      <input
                        className="bg-white h-full p-1 border-[1px] border-gray-500"
                        type="color"
                        name="fontColor"
                        defaultValue={caption?.fontColor}
                        onChange={(e) => handleCaptionUpdate(e, i, j)}
                      />
                    )}

                    <button
                      className="bg-gray-100  border-gray-500 border-[1px] px-2 rounded-r-lg h-full p-1 text-black"
                      onClick={() => handleDeleteCaption(i, j)}
                    >
                      X
                    </button>
                  </div>
                </div>

                {/*   <label>
                  Font Size:
                  <input type="number" name="fontSize" defaultValue={caption?.fontSize} onChange={(e) => handleCaptionUpdate(e, i, j)} />
                </label> */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleMemeComponent;

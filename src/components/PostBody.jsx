/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { Rnd } from "react-rnd";
import FitTextDiv from "@/components/FitTextDiv";

const PostBody = ({ postObj, handleOpen }) => {
  const imageRef = useRef();

  return (
    <div>
      {postObj?.text && <div className="">{postObj?.text}</div>}

      <div className="relative overflow-hidden">
        <div className="flex justify-center items-center w-full h-full">
          <img
            ref={imageRef}
            className="object-contain w-full max-w-[500px]  h-full overflow-hidden"
            src={postObj?.image}
            alt={postObj?.user?.account_name}
            styles="visibility: hidden;"
          />
        </div>
        {postObj?.captions?.map((caption, j) => (
          <Rnd
            maxWidth={imageRef?.current?.width}
            minWidth={100}
            minHeight={50}
            key={j}
            bounds="parent"
            enableResizing={false}
            disableDragging={true}
            className={`text-center uppercase !cursor-default !select-none !flex !justify-center !items-center `}
            position={{
              x: caption.x,
              y: caption.y,
              width: caption.width,
              height: caption.height,
            }}
          >
            <FitTextDiv
              className="text-fit"
              style={{
                width: caption.width,
                height: caption.height,
                color: caption.fontColor,
              }}
              mode="multiple"
            >
              {caption.text}
            </FitTextDiv>
          </Rnd>
        ))}
      </div>
    </div>
  );
};

export default PostBody;

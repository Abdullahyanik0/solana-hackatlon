import { IoStatsChart } from "react-icons/io5";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { TbMessageShare } from "react-icons/tb";
import { likePostService, unlikePostService } from "../service/meme";
import { useWallet } from "@solana/wallet-adapter-react";
import { errorNotify } from "./Notification";

const PostFooter = ({ postObj, refetch, handleOpen, modal, handleClose }) => {
  const { publicKey } = useWallet();
  const walletAdress = publicKey?.toBase58();

  const handleLike = async (upOrDown) => {
    if(!walletAdress)  return errorNotify("Please log in")
    upOrDown !== "up"
      ? await unlikePostService(postObj?._id, walletAdress)
      : await likePostService(postObj?._id, walletAdress);
    try {
      if (refetch) refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between w-full text-sm pt-2 border-t border-color p-2">
      <div className="flex gap-2.5 items-center">
        <div
          onClick={() =>
            !postObj?.like?.includes(walletAdress) && handleLike("up")
          }
          className="flex items-center cursor-pointer group"
        >
          <div className="flex items-center justify-center group-hover:bg-green-600/20 p-2 rounded-full transition-all">
            {postObj?.like?.includes(walletAdress) ? (
              <BiSolidLike size="24px" color="green" className="scale-effect" />
            ) : (
              <BiLike size="24px" />
            )}
          </div>
          <p className="select-none">{postObj?.like?.length || 0}</p>
        </div>
        <div
          onClick={() =>
            !postObj?.unlike?.includes(walletAdress) && handleLike("down")
          }
          className="flex items-center cursor-pointer group"
        >
          <div className="flex items-center justify-center group-hover:bg-red-600/20 p-2 rounded-full transition-all">
            {postObj?.unlike?.includes(walletAdress) ? (
              <BiSolidDislike
                size="24px"
                color="red"
                className="scale-effect"
              />
            ) : (
              <BiDislike size="24px" />
            )}
          </div>
          <p className="select-none">{postObj?.unlike?.length || 0}</p>
        </div>

        <div className="flex items-center cursor-pointer group">
          <div className="flex items-center justify-center group-hover:bg-orange-600/20 p-2 rounded-full transition-all">
            <TbMessageShare size="22px" />
          </div>
        </div>
      </div>

      <div className="flex sm:gap-2.5 items-center">
        {walletAdress === postObj?.user?._id && (
          <div className="flex items-center cursor-pointer group">
            <div className="flex items-center justify-center group-hover:bg-gray-600/20 p-2 rounded-full transition-all">
              <IoStatsChart size="20px" />
            </div>
            <p className="select-none">{postObj?.view || 0}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostFooter;

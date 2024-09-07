import { IoStatsChart } from "react-icons/io5";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { TbMessageShare } from "react-icons/tb";
import { likePostService, unlikePostService } from "../service/meme";
import { useWallet } from "@solana/wallet-adapter-react";

const PostFooter = ({ postObj, refetch, handleOpen, modal, handleClose }) => {
  const mainUser = {};
  
  const { publicKey } = useWallet();
  const walletAdress = publicKey?.toBase58();

  const handleLike = async (upOrDown) => {
    upOrDown !== "up" ? await unlikePostService(postObj?._id,walletAdress) : await likePostService(postObj?._id,walletAdress);
    try {
      if (refetch) refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between w-full text-sm pt-2 border-t border-color p-2">
      <div className="flex gap-2.5 items-center">
        <div onClick={() => handleLike("up")} className="flex items-center cursor-pointer group">
          <div className="flex items-center justify-center group-hover:bg-green-600/20 p-2 rounded-full transition-all">
            {postObj?.upvote?.includes(mainUser?.user?._id) ? (
              <BiSolidLike size="24px" color="green" className="scale-effect" />
            ) : (
              <BiLike size="24px" />
            )}
          </div>
          <p className="select-none">{postObj?.upvote?.length || 0}</p>
        </div>
        <div onClick={() => handleLike("down")} className="flex items-center cursor-pointer group">
          <div className="flex items-center justify-center group-hover:bg-red-600/20 p-2 rounded-full transition-all">
            {postObj?.downvote?.includes(mainUser?.user?._id) ? (
              <BiSolidDislike size="24px" color="red" className="scale-effect" />
            ) : (
              <BiDislike size="24px" />
            )}
          </div>
          <p className="select-none">{postObj?.downvote?.length || 0}</p>
        </div>

        <div className="flex items-center cursor-pointer group">
          <div className="flex items-center justify-center group-hover:bg-orange-600/20 p-2 rounded-full transition-all">
            <TbMessageShare size="22px" />
          </div>
        </div>
      </div>

      <div className="flex sm:gap-2.5 items-center">
        {mainUser?._id === postObj?.user?._id && (
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

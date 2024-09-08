import { Text } from "@mantine/core";
import UserAvatar from "./UserAvatar";
import { useClipboard } from "@mantine/hooks";
import { useRouter } from "next/router";
import { formatRelativeTime } from "@/utils/formatter";
import { BsThreeDotsVertical } from "react-icons/bs";

const PostHeader = ({ postObj, isWinner, padding }) => {
  const user = postObj?.user;

  return (
    <div className={`flex justify-between items-center   ${padding ? "p-3 px-4" : ""} `}>
      <div className="cursor-pointer">
        <div className="flex items-center gap-2 sm:gap-3 group">
          <UserAvatar user={user} />

          <div className="flex flex-col justify-between gap-2">
            <div className="flex items-center rounded-none justify-start w-full gap-4">
              <div className="flex flex-col items-start">
                <div className="flex gap-2 items-center">
                  <Text className="group-hover:!text-first-color transition-all !font-semibold tracking-wide capitalize">
                    {/* {user?.fullName} {user?.lastName}{" "} */}
                    {isWinner ? isWinner : "SuperTeamTr"}
                  </Text>
                  <Text c="dimmed" className="!font-light !text-xs !pt-1 cursor-default">
                    {formatRelativeTime("07-09-2024")}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cursor-pointer">
        <BsThreeDotsVertical />
      </div>
    </div>
  );
};

export default PostHeader;

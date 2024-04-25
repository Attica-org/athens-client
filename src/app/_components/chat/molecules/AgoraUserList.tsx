import UserImage from "../../atoms/UserImage";

type UserList = {
  id: number;
  name: string;
  position: "pro" | "con";
};

type Props = {
  position: string;
  userList: UserList[];
};

export default function AgoraUserList({ position, userList }: Props) {
  return (
    <div className="pb-1rem">
      <div className="text-sm pb-1rem">
        {position === "pro" ? "찬성측" : "반대측"}
      </div>
      <ul className="flex flex-col justify-center items-start">
        {userList.map((user) => (
          <li className="flex justify-start items-center pb-1rem" key={user.id}>
            <UserImage className="w-40 h-40" name={user.name} w={40} h={40} />
            <div className="ml-0.5rem text-sm">{user.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

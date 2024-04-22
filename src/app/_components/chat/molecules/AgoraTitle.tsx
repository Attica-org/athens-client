import SpeakerIcon from "@/assets/icons/SpeakerIcon";

export default function AgoraTitle() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <p className="text-base font-semibold flex justify-center items-center p-5">
        <SpeakerIcon className="w-18 mr-0.5rem" fill="#10AE5D" />
        국가 발전에는 유능한 독재자가 필요한 시기가 있다.
      </p>
      <div className="flex justify-around items-center w-full text-xs p-6">
        <div className="text-blue-400">찬성 10</div>
        <div className="text-red-400">반대 10</div>
      </div>
    </div>
  );
}

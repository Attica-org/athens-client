import SpeakerIcon from "@/assets/icons/SpeakerIcon";

export default function AgoraTitle() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <h3
        aria-label="토론 주제"
        className="text-base under-mobile:text-xs break-keep text-center font-semibold flex justify-center items-center p-5"
      >
        <SpeakerIcon
          className="w-18 mr-0.5rem under-mobile:w-14"
          fill="#10AE5D"
        />
        국가 발전에는 유능한 독재자가 필요한 시기가 있다.
      </h3>
      <p
        aria-label="현재 참여 인원"
        className="flex justify-around items-center w-full text-sm under-mobile:text-xxs p-6"
      >
        <div className="text-blue-600">찬성 10</div>
        <div className="text-red-600">반대 10</div>
      </p>
    </div>
  );
}

"use client";

import CategoryButtonList from "@/app/_components/home/molecules/CategoryButtonList";
import CheckIcon from "@/assets/icons/CheckIcon";
import NotificationIcon from "@/assets/icons/NotificationIcon";
import { ChangeEventHandler, useState } from "react";
import PageTitle from "@/app/_components/home/atoms/PageTitle";

const DEFAULT_PARTICIPANTS_CNT = 5;
const MAX_PARTICIPANTS_CNT = 5;
const MIN_PARTICIPANTS_CNT = 1;
const DEFAULT_TIME = 60;

type Message = {
  participants: string | null;
  time: string | null;
};

export default function CreateAgora() {
  const [message, setMessage] = useState<Message>({
    participants: null,
    time: null,
  });
  const [participants, setParticipants] = useState<number>(
    DEFAULT_PARTICIPANTS_CNT
  );
  const [time, setTime] = useState<number | null>(DEFAULT_TIME);
  const [timeCheck, setTimeCheck] = useState<boolean>(false);

  const handleMessage = (value: number, state?: "INCREASE" | "DECREASE") => {
    if (state === "INCREASE" || value < MIN_PARTICIPANTS_CNT) {
      setMessage({
        ...message,
        participants: "최소 참여 인원은 각 1명입니다.",
      });
      return;
    }
    if (state === "DECREASE" || value > MAX_PARTICIPANTS_CNT) {
      setMessage({
        ...message,
        participants: "최대 참여 인원은 각 5명입니다.",
      });
      return;
    }

    setMessage({
      ...message,
      participants: null,
    });

    setParticipants(value);
  };

  const handleAgoraTime: ChangeEventHandler<HTMLInputElement> = (e) => {
    let value = parseInt(e.target.value);

    if (value < 0) {
      setMessage({
        ...message,
        time: "최소 제한시간은 30분입니다.",
      });
      return;
    }
    setTime(value);
    setMessage({
      ...message,
      time: null,
    });
  };

  const inputParticipants: ChangeEventHandler<HTMLInputElement> = (e) => {
    let value = parseInt(e.target.value);
    handleMessage(value);
  };

  const clickParticipantsBtn = (action: "DECLEASE" | "INCREASE") => {
    switch (action) {
      case "DECLEASE":
        handleMessage(participants - 1);
        break;
      case "INCREASE":
        handleMessage(participants + 1);
        break;
    }
  };

  const handleNoTime = () => {
    if (!time) {
      setTime(DEFAULT_TIME);
      setTimeCheck(false);
    } else {
      setTime(null);
      setTimeCheck(true);
      setMessage({
        ...message,
        time: null,
      });
    }
  };

  return (
    <section className="overflow-y-scroll scrollbar-hide flex flex-col pb-57 lg:pb-25 flex-1 h-dvh min-w-270 flex-grow max-width-screen">
      <header className="p-1rem pb-0 relative min-w-270">
        <PageTitle
          title="아고라 생성"
          desc="생성할 아고라 정보를 입력해주세요."
        ></PageTitle>
      </header>
      <main className="flex lg:w-[82.5vw] w-[100vw] max-width-screen h-dvh flex-1 flex-grow min-w-270 justify-between items-stretch p-1.5rem pt-0 under-mobile:pl-1rem under-mobile:pr-1rem flex-col">
        <div className="flex flex-col w-full">
          <input
            aria-label="생성할 아고라 주제 입력창"
            type="text"
            placeholder="토론 할 주제를 입력해주세요."
            className="w-full mt-1rem p-0.5rem text-xs border-1 border-athens-gray rounded-md"
          />
          <div className="flex justify-around flex-col w-full">
            <section className="mt-1rem w-full">
              <h3 className="text-sm mb-10 under-mobile:text-xs">
                아고라 카테고리 분류
              </h3>
              <div
                aria-label="카테고리 리스트"
                className="bg-yellow-400 w-full h-3rem"
              ></div>
            </section>
            <section className="mt-1.5rem w-full">
              <h3 className="text-sm mb-10 under-mobile:text-xs">
                아고라 색상
              </h3>
              <div
                aria-label="아고라 색상 리스트"
                className="flex justify-start items-center"
              >
                <div className="w-2rem h-2rem under-mobile:w-1.5rem under-mobile:h-1.5rem rounded-full bg-agora-point-color1 mr-5" />
                <div className="w-2rem h-2rem under-mobile:w-1.5rem under-mobile:h-1.5rem rounded-full bg-agora-point-color2 mr-5" />
                <div className="w-2rem h-2rem under-mobile:w-1.5rem under-mobile:h-1.5rem rounded-full bg-agora-point-color3 mr-5" />
                <div className="w-2rem h-2rem under-mobile:w-1.5rem under-mobile:h-1.5rem rounded-full bg-agora-point-color4 mr-5" />
                <div className="w-2rem h-2rem under-mobile:w-1.5rem under-mobile:h-1.5rem rounded-full bg-agora-point-color5 mr-5" />
                <div className="w-2rem h-2rem under-mobile:w-1.5rem under-mobile:h-1.5rem rounded-full bg-agora-point-color6" />
              </div>
            </section>
            <section className="mt-1.5rem w-full">
              <h3 className="mb-8 text-sm under-mobile:text-xs">
                최대 참여 인원
              </h3>
              <div className="flex justify-start items-center">
                <label className="pr-0.5rem text-sm under-mobile:text-xs">
                  찬성 / 반대
                </label>
                <div className="p-3 pl-7 pr-7 flex justify-between items-center border-1 border-athens-gray rounded-md ">
                  <div
                    className="text-xl cursor-pointer"
                    onClick={() => clickParticipantsBtn("DECLEASE")}
                  >
                    -
                  </div>
                  <input
                    aria-label="최대 참여 인원"
                    value={participants}
                    onChange={inputParticipants}
                    type="number"
                    className="text-center max-w-32 w-32 text-xs input-number-hide focus-visible:outline-none"
                  />
                  <div
                    className="text-xl cursor-pointer"
                    onClick={() => clickParticipantsBtn("INCREASE")}
                  >
                    +
                  </div>
                </div>
              </div>
              {message.participants && (
                <div className="text-xs under-mobile:text-xxs text-red-400 p-0.5rem pl-0">
                  {message.participants}
                </div>
              )}
              <div className="flex justify-start items-center mt-5">
                <NotificationIcon className="w-1.5rem mr-0.5rem" />
                <span className="text-xs text-athens-gray-500 break-keep under-mobile:text-xxs">
                  관찰자는 인원 제한없이 참여할 수 있습니다.
                </span>
              </div>
            </section>
            <section className="mt-1.5rem w-full text-sm">
              <h3 className="mb-10 under-mobile:text-xs">토론 제한시간</h3>
              <div className="flex flex-col w-full under-mobile:flex-row justify-center under-mobile:justify-start items-start under-mobile:items-center">
                <div className="flex justify-start items-center">
                  <input
                    type="number"
                    value={time || ""}
                    onChange={handleAgoraTime}
                    disabled={timeCheck}
                    className="input-number-hide focus-visible:outline-none text-sm mr-0.5rem text-center p-5 w-5rem border-1 border-athens-gray rounded-md"
                  />
                  <div className="under-mobile:text-xs">분</div>
                </div>
                <div
                  onClick={handleNoTime}
                  className="under-mobile:ml-1rem cursor-pointer mt-12 under-mobile:mt-0 flex justify-start items-center text-gray-500 text-center"
                >
                  <CheckIcon
                    className="w-1rem"
                    fill="rgb(107 114 128)"
                    check={timeCheck}
                  />
                  <div className="ml-8 text-sm under-mobile:text-xs">
                    제한 없음
                  </div>
                </div>
              </div>
              {message.time && (
                <div className="text-sm under-mobile:text-xxs text-red-400 p-0.5rem pb-0 pl-0">
                  {message.time}
                </div>
              )}
            </section>
          </div>
        </div>
        <div className="max-h-5rem w-ful">
          <button className="w-full bg-athens-main text-white pt-15 pb-15 mt-1.5rem under-mobile:pt-10 under-mobile:pb-10 under-mobile:mt-1rem text-sm rounded-lg">
            아고라 생성
          </button>
        </div>
      </main>
    </section>
  );
}

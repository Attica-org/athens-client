import React from 'react';

type Props = {
  prosPercentage: number;
  consPercentage: number;
};

export default function ClosedAgoraVoteResultBar({
  prosPercentage,
  consPercentage,
}: Props) {
  const total = prosPercentage + consPercentage;
  const consWidth =
    consPercentage <= 0 ? 0 : Math.floor((total / consPercentage) * 100);
  const prosWidth =
    prosPercentage <= 0 ? 0 : Math.floor((total / prosPercentage) * 100);

  return (
    <div className="w-full h-full px-4 text-xxs">
      <div className="w-full h-full flex items-center text-dark-line-light break-keep mb-5">
        찬성
        <div className="w-full flex ml-5 h-16">
          <div
            className="bg-dark-pro-color rounded-r-lg h-full"
            style={{ width: `${prosWidth || 1}%` }}
          />
        </div>
        <div className="ml-5">{prosWidth}%</div>
      </div>
      <div className="w-full flex items-center text-dark-line-light break-keep">
        반대
        <div className="w-full flex ml-5 h-16">
          <div
            className="bg-dark-con-color rounded-r-lg"
            style={{ width: `${consWidth || 1}%` }}
          />
        </div>
        <div className="ml-5">{consWidth}%</div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';

export default function SNSLogin() {
  return (
    <>
      <Link
        href="/home"
        aria-label="카카오로 로그인하기"
        className="text-sm relative flex justify-center items-center w-full bg-[#FEE500] border-1 border-[#FEE500] rounded-md h-42 p-12"
      >
        <div className="absolute left-12" aria-hidden>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="w-24 h-24"
          >
            <path
              d="M12.5482 4C7.83195 4 4 7.1 4 10.9C4 13.3 5.57208 15.4 7.83195 16.7L7.24242 20L10.8779 17.6C11.3691 17.7 11.9587 17.7 12.4499 17.7C17.1662 17.7 20.9981 14.6 20.9981 10.8C21.0964 7.1 17.2645 4 12.5482 4Z"
              fill="black"
            />
          </svg>
        </div>
        <div className="opacity-85 flex-1 justify-center items-center text-center">
          카카오 로그인
        </div>
      </Link>
      <Link
        href="/home"
        aria-label="구글로 로그인하기"
        className="text-sm relative flex justify-center items-center w-full bg-white border-1 border-dark-line-semilight rounded-md h-42 p-12"
      >
        <div className="absolute left-12" aria-hidden>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-19 h-19"
            viewBox="-3 0 262 262"
            preserveAspectRatio="xMidYMid"
          >
            <path
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              fill="#4285F4"
            />
            <path
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              fill="#34A853"
            />
            <path
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
              fill="#FBBC05"
            />
            <path
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              fill="#EB4335"
            />
          </svg>
        </div>
        <div className="opacity-85 flex-1 justify-center items-center text-center">
          구글 로그인
        </div>
      </Link>
    </>
  );
}

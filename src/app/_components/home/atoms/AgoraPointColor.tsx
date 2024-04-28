type Props = {
  id: number;
  isCheck: boolean;
};

export default function AgoraPointColor({ id, isCheck }: Props) {
  return (
    <>
      <div
        className={`cursor-pointer w-2rem h-2rem under-mobile:w-1.5rem under-mobile:h-1.5rem rounded-full bg-agora-point-color${id} mr-5`}
      >
        {isCheck && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="2rem under-mobile:w-1.5rem"
            viewBox="0 -960 960 960"
            width="2rem under-mobile:w-1.5rem"
          >
            <path
              fill="white"
              d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
            />
          </svg>
        )}
      </div>
    </>
  );
}

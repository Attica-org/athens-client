'use client';

import RemoveIcon from '@/assets/icons/RemoveIcon';
import SearchIcon from '@/assets/icons/SearchIcon';
import { homeSegmentKey } from '@/constants/segmentKey';
import { useSearchStore } from '@/store/search';
import { useRouter, useSearchParams } from 'next/navigation';
import React, {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from 'react';
import { useShallow } from 'zustand/react/shallow';

function SearchBar() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const { search, setSearch, reset } = useSearchStore(
    useShallow((state) => ({
      search: state.search,
      setSearch: state.setSearch,
      reset: state.reset,
    })),
  );
  const [searchText, setSearchText] = useState<string>(search || q || '');
  const router = useRouter();

  const removeAllInputText = () => {
    reset();
    setSearchText('');
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('q');

    const newUrl = `${homeSegmentKey}?${newSearchParams.toString()}`;
    window.history.pushState(
      { ...window.history.state, as: newUrl, url: newUrl },
      '',
      newUrl,
    );
    // router.push(newUrl);
  };

  const changeInputText: ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchText(e.target.value);
  };

  const handleSearch: FormEventHandler = (e: React.FormEvent<Element>) => {
    e.preventDefault();
    setSearch(searchText);

    if (!searchText) {
      const newUrl = homeSegmentKey;
      window.history.pushState(
        { ...window.history.state, as: newUrl, url: newUrl },
        '',
        newUrl,
      );
      // router.push('/home');
    } else {
      const newUrl = `${homeSegmentKey}?q=${searchText}&status=active`;
      window.history.pushState(
        { ...window.history.state, as: newUrl, url: newUrl },
        '',
        newUrl,
      );
      // router.push(`/home?q=${searchText}&status=active`);
    }
  };

  useEffect(() => {
    if (search) {
      const newUrl = `${homeSegmentKey}?q=${search}&status=active`;
      window.history.pushState(
        { ...window.history.state, as: newUrl, url: newUrl },
        '',
        newUrl,
      );
      // router.push(`/home?q=${search}&status=active`);
    }
  }, [router, search]);

  return (
    <div className="bg-athens-gray rounded-md p-3 flex justify-center items-center dark:bg-dark-light-300">
      <button type="button" aria-label="검색하기" onClick={handleSearch}>
        <SearchIcon className="w-20 ml-10" />
      </button>
      <form onSubmit={handleSearch} className="w-full">
        <input
          aria-label="아고라 검색창"
          type="text"
          className="w-full text-sm bg-athens-gray border-0 focus:outline-none pl-1rem placeholder:font-normal placeholder:text-athens-gray-thick dark:bg-dark-light-300 dark:placeholder:text-white dark:placeholder:text-opacity-85 dark:text-white"
          placeholder="검색"
          value={searchText}
          onChange={changeInputText}
        />
      </form>
      <button
        type="button"
        aria-label="입력한 검색 텍스트 전체 삭제"
        className="flex justify-center items-center w-1.5rem h-1.5rem"
        onClick={removeAllInputText}
      >
        <RemoveIcon className="w-19 cursor-pointer" />
      </button>
    </div>
  );
}

export default React.memo(SearchBar);

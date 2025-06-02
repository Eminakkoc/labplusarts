import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import usePrevious from '../../utils/hooks/usePrevious';

interface Props {
  onSearchStart?: () => void;
  onSearchEnd?: () => void;
}
// I decided not to give any parameters like searchText or onSearch callback, instead
// this component directly updates the URL by adding a search parameter and let other components use it.
function Search({ onSearchStart, onSearchEnd }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const previousSearchText = usePrevious(searchText);

  useEffect(() => {
    if (previousSearchText !== searchText) {
      onSearchStart?.();
    }
    if (searchText === '') {
      searchParams.delete('search');
      setSearchParams(searchParams, { replace: true });
      onSearchEnd?.();
      return;
    }

    const handler = setTimeout(() => {
      try {
        setSearchParams({ ...Object.fromEntries(searchParams.entries()), search: searchText });
      } catch (error) {
        throw new Error('Invalid search text');
      } finally {
        onSearchEnd?.();
      }
    }, 500); // Add a delay to avoid too many updates
    return () => {
      clearTimeout(handler);
      if (previousSearchText !== searchText) {
        onSearchEnd?.();
      }
    };
  }, [searchText]);

  return (
    <div className="w-full">
      <input
        type="text"
        className="h-[45px] w-full rounded border px-3 py-2 text-sm"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
}

export default Search;

import { useMemo, type JSX } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isProbablyDateString } from '../../utils/date';
import type { DataTableValue } from '../../types/dataTable';

interface Props {
  data: Record<string, DataTableValue>[];
  onFilterStart?: () => void;
  onFilterEnd?: () => void;
}

function Filter({ data, onFilterStart, onFilterEnd }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const dataMap = useMemo<Map<string, string[]>>(() => {
    // add all values to map later to be used as options in select boxes
    const map = new Map<string, string[]>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        const value = item[key];
        if (value === null || value === undefined) {
          return;
        }
        const strValue = String(value);
        if (!map.has(key)) {
          map.set(key, []);
        }
        const existingValues = map.get(key);
        if (existingValues && !existingValues.includes(strValue)) {
          existingValues.push(strValue);
        }
      });
    });

    return map;
  }, [data]);

  function setFilter(filterName: string, filterValue: string): void {
    // Update the URL with the new filter
    const newSearchParams = new URLSearchParams(searchParams);
    if (filterValue) {
      newSearchParams.set(filterName, filterValue);
    } else {
      newSearchParams.delete(filterName);
    }
    searchParams.forEach((value, key) => {
      if (key !== filterName) {
        newSearchParams.set(key, value);
      }
    });
    onFilterStart?.();
    setTimeout(() => {
      setSearchParams(newSearchParams, { replace: true });
      onFilterEnd?.();
    }, 100); // Simulate a delay for the filter start event
  }

  function isMapElementDate(elementKey: string): boolean {
    // Check if the all element values are date
    return !!dataMap.get(elementKey)?.every((dataValue) => isProbablyDateString(dataValue));
  }

  function getFilterElement(value: [string, string[]]): JSX.Element {
    const [key, values] = value;
    const isDate = isMapElementDate(key);

    if (isDate) {
      // return input fields
      return (
        <div key={key} className="mb-4 flex flex-col gap-(--spacing-s)">
          <div key={key} className="flex items-center gap-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {key.charAt(0).toUpperCase() + key.slice(1)} (Between)
            </label>
            <input
              type="date"
              className="h-[45px] w-full rounded border px-3 py-2 text-sm"
              value={searchParams.get(key + '-begin') || ''}
              onChange={(e) => setFilter(key + '-begin', e.target.value)}
            />
            <label className="mb-2 block text-sm font-medium text-gray-700">/</label>
            <input
              type="date"
              className="h-[45px] w-full rounded border px-3 py-2 text-sm"
              value={searchParams.get(key + '-end') || ''}
              onChange={(e) => setFilter(key + '-end', e.target.value)}
            />
          </div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {key.charAt(0).toUpperCase() + key.slice(1)} (Exact)
          </label>
          <input
            type="date"
            className="h-[45px] w-full rounded border px-3 py-2 text-sm"
            value={searchParams.get(key + '-exact') || ''}
            onChange={(e) => setFilter(key + '-exact', e.target.value)}
          />
        </div>
      );
    }

    return (
      <div key={key} className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </label>
        <select
          className="h-[45px] w-full rounded border px-3 py-2 text-sm"
          value={searchParams.get(key) || ''}
          onChange={(e) => setFilter(key, e.target.value)}
        >
          <option value="">All</option>
          {values.map((value) => (
            <option key={value} value={value}>
              {isDate ? new Date(value).toLocaleDateString() : value}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return;
  }

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-l text-text-secondary mb-(--spacing-s) text-left font-bold">Filter</h2>
      {Array.from(dataMap.entries()).map(getFilterElement)}
    </div>
  );
}

export default Filter;

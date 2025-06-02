import { useMemo, type JSX } from 'react';
import { capitalizeFirstLetter } from '../../utils/textUtil';
import { useSearchParams } from 'react-router-dom';
import { isProbablyDateString } from '../../utils/date';

interface Props {
  data: Record<string, Primitive>[];
  loading?: boolean;
  caption?: string;
}

type Primitive = string | number | boolean | null | undefined;

function DataTable({ data, caption, loading }: Props) {
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get('search') || '';

  // We can assume that all objects in the array have the same fields,
  // but just to handle all edge cases I decided to create a columnMap
  // which holds the union of all object fields in the array.
  const columnHeaders = useMemo<string[]>(() => {
    const columns: string[] = [];
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (!columns.includes(key)) {
          columns.push(key);
        }
      });
    });

    return columns;
  }, [data]);

  // Get all searchParams which are not 'search' and create a filter for each
  const filters = useMemo(() => {
    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'search') {
        filters[key] = value;
      }
    });
    return filters;
  }, [searchParams]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (isProbablyDateString(value)) {
          const beginDateRegex = /^.*-begin$/;
          const endDateRegex = /^.*-end$/;
          const exactDateRegex = /^.*-exact$/;

          if (beginDateRegex.test(key)) {
            const rowKey = key.replace('-begin', '');

            // If the filter value is a date and the key ends with '-begin', we need to compare it with the row value
            const filterDate = new Date(value);
            const rowDate = new Date(String(row[rowKey] ?? ''));
            return rowDate >= filterDate;
          } else if (endDateRegex.test(key)) {
            const rowKey = key.replace('-end', '');

            // If the filter value is a date and the key ends with '-end', we need to compare it with the row value
            const filterDate = new Date(value);
            const rowDate = new Date(String(row[rowKey] ?? ''));
            return rowDate <= filterDate;
          } else if (exactDateRegex.test(key)) {
            const rowKey = key.replace('-exact', '');

            // If the filter value is a date and the key ends with '-exact', we need to compare it with the row value
            const filterDate = new Date(value);
            const rowDate = new Date(String(row[rowKey] ?? ''));
            return rowDate.getTime() === filterDate.getTime();
          }
        }

        const rowValue = row[key];
        if (rowValue === undefined || rowValue === null) {
          return false; // If the row does not have the key or the value is null/undefined, it does not match
        }
        const rowValueStr = String(rowValue).toLowerCase();
        if (isProbablyDateString(rowValueStr)) {
          // If value is a date then compare them, the value should be bigger than or equal to the filter value
          const filterDate = new Date(value);
          const rowDate = new Date(rowValueStr);
          return rowDate >= filterDate;
        }
        return rowValueStr.includes(value.toLowerCase());
      });
    });
  }, [data, filters]);

  function getTableRow(row: Record<string, Primitive>): JSX.Element | undefined {
    const rowKey = Object.values(row).join('-');
    if (searchText) {
      // If searchText is provided, filter rows based on it
      const rowValues = Object.values(row).map(String).join(' ').toLowerCase();
      if (!rowValues.includes(searchText.toLowerCase())) {
        return;
      }
    }
    const columnData: JSX.Element[] = columnHeaders.map((column) => {
      return (
        <td
          key={column}
          title={row[column] ? String(row[column]) : ''}
          className="max-md:text-xxs max-w-[150px] min-w-[60px] truncate border-b p-2 text-left max-md:w-auto"
        >
          {(row[column] ?? '') + ''}
        </td>
      );
    });
    return <tr key={rowKey}>{columnData}</tr>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-max table-auto border-collapse">
        {caption && (
          <caption className="text-l max-md:text-m text-text-secondary mb-(--spacing-s) text-left font-bold">
            {caption}
          </caption>
        )}
        <thead>
          <tr>
            {columnHeaders.map((columnLabel) => (
              <th
                key={columnLabel}
                className="max-md:text-xxs max-w-[150px] min-w-[60px] truncate border-b p-2 text-left font-bold max-md:w-auto"
              >
                {capitalizeFirstLetter(columnLabel)}
              </th>
            ))}
          </tr>
        </thead>
        {!loading ? <tbody>{filteredData.map((row) => getTableRow(row))}</tbody> : null}
      </table>
    </div>
  );
}

export default DataTable;

// I assume that only primitive values (except symbols) are used in the data table.
export type { Primitive as DataTableValue };

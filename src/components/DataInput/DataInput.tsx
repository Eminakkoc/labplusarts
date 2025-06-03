import { useEffect, useReducer, useState } from 'react';
import RadioSelector from '../RadioSelector';
import orders from '../../data/orders.json';
import users from '../../data/users.json';
import CustomDataParser from '../CustomDataParser';
import { useSearchParams } from 'react-router-dom';
import usePrevious from '../../utils/hooks/usePrevious';
import AddDataModal from '../AddDataModal';
import type { DataTableValue } from '../../types/dataTable';

interface Props {
  onDataSourceChange: (newData: Record<string, DataTableValue>[]) => void;
}

function DataInput({ onDataSourceChange }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  // data list for each data source
  type ManuallyAddedDataAction =
    | { type: 'reset'; payload: { dataIndex: number } }
    | { type: 'add'; payload: { dataIndex: number; data: Record<string, DataTableValue> } };
  const [manuallyAddeddData, dispatchManuallyAddedData] = useReducer(manuallyAddedDataReducer, []);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [dataStructure, setDataStructure] = useState<Record<string, DataTableValue>>({});

  const [selectedDataIndex, setSelectedDataIndex] = useState<number>(
    Number(searchParams.get('dataSource') ?? 0),
  );
  const [customJson, setCustomJson] = useState<Record<string, DataTableValue>[]>([{}]);
  const previousSelectedIndex = usePrevious(selectedDataIndex);

  useEffect(() => {
    if (previousSelectedIndex !== undefined && previousSelectedIndex !== selectedDataIndex) {
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('dataSource', selectedDataIndex.toString());

      if (searchParams.get('search')) {
        // Preserve the search parameter if it exists
        newSearchParams.set('search', searchParams.get('search')!);
      }

      setSearchParams(newSearchParams, { replace: true });
    }
  }, [selectedDataIndex, previousSelectedIndex]);

  useEffect(() => {
    switch (selectedDataIndex) {
      case 0:
        let combinedUserData = [...users.data, ...(manuallyAddeddData?.[selectedDataIndex] ?? [])];
        onDataSourceChange(combinedUserData);
        createAndSetDataStructure(combinedUserData);
        break;
      case 1:
        let combinedOrderData = [
          ...orders.data,
          ...(manuallyAddeddData?.[selectedDataIndex] ?? []),
        ];
        onDataSourceChange(combinedOrderData);
        createAndSetDataStructure(combinedOrderData);
        break;
      case 2:
        let combinedCustomData = [
          ...customJson,
          ...(manuallyAddeddData?.[selectedDataIndex] ?? []),
        ];
        onDataSourceChange(combinedCustomData);
        createAndSetDataStructure(combinedCustomData);

        break;
      default:
        onDataSourceChange([]);
    }
  }, [selectedDataIndex, customJson, manuallyAddeddData]);

  function manuallyAddedDataReducer(
    state: Record<string, DataTableValue>[][] | undefined,
    action: ManuallyAddedDataAction,
  ) {
    switch (action.type) {
      case 'add':
        const { dataIndex, data } = action.payload;
        const newData = [...(state?.[dataIndex] ?? []), data ?? {}];
        const updatedAddedData = [...(state ?? [])];
        updatedAddedData[dataIndex] = newData;
        return updatedAddedData;
      case 'reset':
        return [];
      default:
        return state;
    }
  }

  function createAndSetDataStructure(data: Record<string, DataTableValue>[]) {
    const structure: Record<string, DataTableValue> = {};
    if (data.length === 0) {
      return;
    }

    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (!structure[key]) {
          structure[key] = item[key];
        }
      });
    });
    setDataStructure(structure);
  }

  return (
    <div>
      <RadioSelector selectedIndex={selectedDataIndex} onSelect={setSelectedDataIndex}>
        <span className="max-md:text-xxs text-xs">Users</span>
        <span className="max-md:text-xxs text-xs">Orders</span>
        <span className="max-md:text-xxs text-xs">Custom Data</span>
      </RadioSelector>
      <CustomDataParser
        className="mt-4"
        nativeProps={{ placeholder: 'Paste your custom JSON data (array) here...' }}
        disabled={selectedDataIndex !== 2}
        onChange={setCustomJson}
      />
      <button
        className="smallPadding h-[45px] w-[200px] cursor-pointer rounded border-1 border-gray-300 bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => setModalOpen(true)}
      >
        + Add New Record
      </button>
      <AddDataModal
        open={modalOpen}
        dataTemplate={dataStructure}
        onCancel={() => setModalOpen(false)}
        onOk={(newAddedData: Record<string, DataTableValue>) => {
          // handle ok
          dispatchManuallyAddedData({
            type: 'add',
            payload: { dataIndex: selectedDataIndex, data: newAddedData },
          });
          setModalOpen(false);
        }}
      />
    </div>
  );
}

export default DataInput;

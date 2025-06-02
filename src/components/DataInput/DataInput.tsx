import { useEffect, useState } from 'react';
import RadioSelector from '../RadioSelector';
import orders from '../../data/orders.json';
import users from '../../data/users.json';
import CustomDataParser from '../CustomDataParser';
import type { DataTableValue } from '../DataTable/DataTable';
import { useSearchParams } from 'react-router-dom';
import usePrevious from '../../utils/hooks/usePrevious';
import AddDataModal from '../AddDataModal';

interface Props {
  onDataSourceChange: (newData: Record<string, DataTableValue>[]) => void;
}

function DataInput({ onDataSourceChange }: Props) {
  const [, setSearchParams] = useSearchParams();
  const [addedData, setAddedData] = useState<Record<string, DataTableValue>[] | undefined>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [dataStructure, setDataStructure] = useState<Record<string, DataTableValue>>({});

  const [selectedDataIndex, setSelectedDataIndex] = useState<number>(0);
  const [customJson, setCustomJson] = useState<Record<string, DataTableValue>[]>([{}]);
  const previousSelectedIndex = usePrevious(selectedDataIndex);

  useEffect(() => {
    if (previousSelectedIndex !== undefined && previousSelectedIndex !== selectedDataIndex) {
      setAddedData(undefined); // Reset added data when switching data sources
      setSearchParams({}, { replace: true });
    }
  }, [selectedDataIndex, previousSelectedIndex]);

  useEffect(() => {
    switch (selectedDataIndex) {
      case 0:
        let combinedUserData = [...users.data, ...(addedData ?? [])];
        onDataSourceChange(combinedUserData);
        createAndSetDataStructure(combinedUserData);
        break;
      case 1:
        let combinedOrderData = [...orders.data, ...(addedData ?? [])];
        onDataSourceChange(combinedOrderData);
        createAndSetDataStructure(combinedOrderData);
        break;
      case 2:
        let combinedCustomData = [...customJson, ...(addedData ?? [])];
        onDataSourceChange(combinedCustomData);
        createAndSetDataStructure(combinedCustomData);

        break;
      default:
        onDataSourceChange([]);
    }
  }, [selectedDataIndex, customJson, addedData]);

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
          setAddedData((prevAddedData) => [...(prevAddedData ?? []), newAddedData]);
          setModalOpen(false);
        }}
      />
    </div>
  );
}

export default DataInput;

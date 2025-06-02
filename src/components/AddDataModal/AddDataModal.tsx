import React, { useEffect, useState } from 'react';
import type { JSX } from 'react';
import ReactDOM from 'react-dom';
import { isProbablyDateString } from '../../utils/date';
import { convertStringToPrimitive } from '../../utils/typeConversionUtil';
import usePrevious from '../../utils/hooks/usePrevious';
import type { DataTableValue } from '../../types/dataTable';

interface ModalProps {
  open: boolean;
  dataTemplate: Record<string, DataTableValue>;
  onCancel: () => void;
  onOk: (addedData: Record<string, DataTableValue>) => void;
}

const AddDataModal: React.FC<ModalProps> = ({ open, dataTemplate, onCancel, onOk }) => {
  const [addedData, setAddedData] = useState<Record<string, DataTableValue>>({});
  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const previousOpen = usePrevious(open);

  useEffect(() => {
    if (open && previousOpen !== open) {
      // Reset addedData when the modal opens
      setAddedData({});
      setInvalidFields([]);
    }
    // If the modal is closed, reset addedData
    if (!open && previousOpen !== open) {
      setAddedData({});
      setInvalidFields([]);
    }
  }, [open, previousOpen]);
  function addValue(key: string, value: DataTableValue): void {
    validateField(key, value);
    setAddedData((prev) => {
      const newData = { ...prev };
      // Convert the value to the appropriate type based on the dataTemplate
      newData[key] = convertStringToPrimitive(value + '', dataTemplate[key]);
      return newData;
    });
  }

  if (!open) return null;

  function getInputElement(dataKey: string): JSX.Element {
    const isDate = isProbablyDateString(String(dataTemplate[dataKey] ?? ''));

    return (
      <div key={dataKey} className="mb-4 flex items-center gap-2">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
        </label>
        <input
          type={isDate ? 'date' : 'text'}
          className="h-[45px] w-full rounded border px-3 py-2 text-sm"
          value={(addedData[dataKey] ?? '') + ''}
          onChange={(e) => addValue(dataKey, e.target.value)}
          onInput={(e) => addValue(dataKey, (e.target as HTMLInputElement).value)}
        />
        {invalidFields?.includes(dataKey) && (
          <span className="text-xs text-red-500">Invalid value for this field.</span>
        )}
      </div>
    );
  }

  function validateField(key: string, value: DataTableValue) {
    let invalid = value === undefined || value === null || value === '';

    if (invalid) {
      setInvalidFields((prevInvalidFields) => {
        return [...prevInvalidFields, key];
      });
    } else {
      setInvalidFields((prevInvalidFields) => {
        return prevInvalidFields.filter((field) => field !== key);
      });
    }

    return invalid === false;
  }

  function validateFields() {
    const invalid: string[] = [];
    Object.keys(dataTemplate).forEach((key) => {
      if (!validateField(key, addedData[key])) {
        invalid.push(key);
      }
    });
    return invalid.length === 0;
  }

  function handleAddData() {
    if (validateFields() && Object.keys(addedData).length) {
      onOk(addedData);
    }
  }
  return ReactDOM.createPortal(
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center"
      onClick={onCancel}
    >
      <div
        className="flex max-w-[90vw] min-w-[300px] flex-col items-center rounded bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="mb-4 flex w-full flex-col gap-(--spacing-s)">
          {Object.keys(dataTemplate).map(getInputElement)}
        </div>
        <div className="mt-2 flex gap-4">
          <button className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={handleAddData}
          >
            Add
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AddDataModal;

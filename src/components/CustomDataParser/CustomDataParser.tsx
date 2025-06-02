import { useEffect, useRef, useState } from 'react';
import type { DataTableValue } from '../DataTable';

interface Props {
  className?: string;
  disabled?: boolean;
  nativeProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  onChange: (parsedData: Record<string, DataTableValue>[]) => void;
}

function CustomDataParser({ className, disabled, nativeProps, onChange }: Props) {
  const [value, setValue] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    parseCustomData(value);
  }, [value]);

  // Focus textarea when it becomes enabled
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  function parseCustomData(json: string): void | never {
    let parsedData: Record<string, DataTableValue>[] | null = null;
    try {
      setValidationError('');
      parsedData = json ? JSON.parse(json) : [{}];
    } catch (error) {
      console.error('Invalid JSON in Custom Data:', error);
      setValidationError('Custom Data should be a valid JSON array.');
    } finally {
      onChange(parsedData ?? [{}]);
    }
  }

  return (
    <div className={`align-start mediumGap flex flex-col justify-start ${className}`}>
      <div className="mediumGap relative flex flex-col justify-start">
        <textarea
          ref={textareaRef}
          className={`max-md:text-xxs mediumPadding mb-(--spacing-l) resize-none rounded border-1 text-xs max-md:max-w-[150px] ${disabled ? 'bg-gray-100 opacity-50' : ''} outline-hidden ${validationError ? 'border-red-500' : ''}`}
          {...nativeProps}
          disabled={disabled}
          name="customData"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={15}
          cols={30}
          autoFocus
        />
        {validationError && (
          <div className="absolute bottom-[0] left-[0] mt-2 text-sm text-red-600">
            <span>{validationError}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomDataParser;

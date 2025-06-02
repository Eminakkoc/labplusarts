import React, { Children, isValidElement } from 'react';
import type { ReactElement } from 'react';

interface Props {
  children: React.ReactNode;
  header?: string;
  selectedIndex?: number;
  onSelect: (index: number) => void;
}

function RadioSelector({ children, selectedIndex, onSelect }: Props) {
  const validChildren = Children.toArray(children).filter(isValidElement) as ReactElement[];

  return (
    <div className="flex flex-col justify-start">
      <h2 className="text-l text-text-secondary mb-(--spacing-s) text-left font-bold">
        Select a data source:
      </h2>
      {validChildren.map((child, index) => (
        <label key={child.key} className="smallGap flex cursor-pointer items-start">
          <input
            className="align-self-start m-[3px] mr-(--spacing-s) max-md:m-[2px]"
            type="radio"
            name="radio-group"
            value={index}
            checked={(selectedIndex ?? 0) === index}
            onChange={() => onSelect(index)}
          />
          {child}
        </label>
      ))}
    </div>
  );
}

export default RadioSelector;

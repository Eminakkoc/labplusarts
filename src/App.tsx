import { useState } from 'react';
import DataInput from './components/DataInput';
import DataTable from './components/DataTable';
import Search from './components/Search';
import Loading from './components/Loading';
import Filter from './components/Filter';
import type { DataTableValue } from './types/dataTable';

function App() {
  const [tableData, setTableData] = useState<Record<string, DataTableValue>[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  return (
    <div className="mediumGap mediumPadding mx-auto flex w-full flex-col justify-center max-lg:max-w-[100%] max-md:w-full max-md:max-w-[100%] lg:max-w-[1024px]">
      <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        <DataInput onDataSourceChange={setTableData} />
        <Filter data={tableData} />
      </div>

      <div className="gap(--spacng-s) flex w-full items-center">
        <div className="h-[45px] w-[200px]">
          <Search
            onSearchStart={() => setTableLoading(true)}
            onSearchEnd={() => setTableLoading(false)}
          />
        </div>
        {tableLoading && (
          <div className="w-[60px]">
            <Loading />
          </div>
        )}
      </div>
      <DataTable data={tableData} loading={tableLoading} />
    </div>
  );
}

export default App;

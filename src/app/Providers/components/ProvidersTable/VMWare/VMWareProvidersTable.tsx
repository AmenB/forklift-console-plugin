import * as React from 'react';
import { Pagination, Button, Level, LevelItem } from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  compoundExpand,
  classNames as classNamesTransform,
  ICell,
  IRow,
} from '@patternfly/react-table';
import { OutlinedHddIcon } from '@patternfly/react-icons';
import tableStyles from '@patternfly/react-styles/css/components/Table/table';
import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';
import alignment from '@patternfly/react-styles/css/utilities/Alignment/alignment';

import { useSortState, usePaginationState } from '@app/common/hooks';
import VMWareProviderActionsDropdown from './VMWareProviderActionsDropdown';
import VMWareProviderHostsTable from './VMWareProviderHostsTable';

import './VMWareProvidersTable.css';
import { IVMWareProvider } from '@app/Providers/types';
import ProviderStatus from '../ProviderStatus';

interface IVMWareProvidersTableProps {
  providers: IVMWareProvider[];
}

const VMWareProvidersTable: React.FunctionComponent<IVMWareProvidersTableProps> = ({
  providers,
}: IVMWareProvidersTableProps) => {
  const columns: ICell[] = [
    {
      // Using a custom column instead of Table's onSelect prop due to issues
      title: (
        <input
          type="checkbox"
          aria-label="Select all providers"
          onChange={(event: React.FormEvent<HTMLInputElement>) => {
            alert(event.currentTarget.checked); // TODO
          }}
          checked={false} // TODO
        />
      ),
      columnTransforms: [classNamesTransform(tableStyles.tableCheck)],
    },
    { title: 'Name', transforms: [sortable] },
    { title: 'Endpoint', transforms: [sortable] },
    { title: 'Clusters', transforms: [sortable] },
    { title: 'Hosts', transforms: [sortable], cellTransforms: [compoundExpand] },
    { title: 'VMs', transforms: [sortable] },
    { title: 'Networks', transforms: [sortable] },
    { title: 'Datastores', transforms: [sortable] },
    { title: 'Status', transforms: [sortable] },
    { title: '', columnTransforms: [classNamesTransform(tableStyles.tableAction)] },
  ];

  const getSortValues = (provider: IVMWareProvider) => {
    const { numClusters, numHosts, numVMs, numNetworks, numDatastores } = provider.resourceCounts;
    return [
      '',
      provider.metadata.name,
      provider.spec.url,
      numClusters,
      numHosts,
      numVMs,
      numNetworks,
      numDatastores,
      provider.status.conditions[0].type, // TODO maybe surface the most serious status condition?
      '',
    ];
  };

  const { sortBy, onSort, sortedItems } = useSortState(providers, getSortValues);
  const { currentPageItems, setPageNumber, paginationProps } = usePaginationState(sortedItems, 10);
  React.useEffect(() => setPageNumber(1), [sortBy, setPageNumber]);

  // TODO abstract this into a hook -- useSelectionList?
  // TODO does order matter? maybe take the full list and filter by it
  const [expandedProviders, setExpandedProviders] = React.useState<IVMWareProvider[]>([]);
  const toggleProviderExpanded = (
    provider: IVMWareProvider,
    shouldInclude = !expandedProviders.includes(provider)
  ) => {
    if (shouldInclude) {
      setExpandedProviders([...expandedProviders, provider]);
    } else {
      setExpandedProviders(expandedProviders.filter((p) => p !== provider));
    }
  };

  const rows: IRow[] = [];
  currentPageItems.forEach((provider: IVMWareProvider) => {
    const { numClusters, numHosts, numVMs, numNetworks, numDatastores } = provider.resourceCounts;
    const isExpanded = expandedProviders.includes(provider);
    rows.push({
      isOpen: isExpanded,
      meta: { provider },
      cells: [
        {
          title: (
            <input
              type="checkbox"
              aria-label={`Select provider ${provider.metadata.name}`}
              onChange={(event: React.FormEvent<HTMLInputElement>) => {
                alert(event.currentTarget.checked); // TODO
              }}
              checked={false} // TODO
            />
          ),
        },
        provider.metadata.name,
        provider.spec.url,
        numClusters,
        {
          title: (
            <>
              <OutlinedHddIcon key="hosts-icon" /> {numHosts}
            </>
          ),
          props: {
            isOpen: isExpanded,
            ariaControls: `provider-${provider.metadata.name}-hosts-expanded`,
          },
        },
        numVMs,
        numNetworks,
        numDatastores,
        {
          title: <ProviderStatus provider={provider} />,
        },
        {
          title: <VMWareProviderActionsDropdown />,
        },
      ],
    });
    if (isExpanded) {
      rows.push({
        parent: rows.length - 1,
        compoundExpand: 4,
        cells: [
          {
            title: (
              <>
                <div className={`${alignment.textAlignRight} ${spacing.mtSm} ${spacing.mrSm}`}>
                  <Button
                    variant="secondary"
                    onClick={() => alert('TODO')}
                    isDisabled /* TODO enable when hosts are selected */
                  >
                    Select migration network
                  </Button>
                </div>
                <VMWareProviderHostsTable id="provider-0-hosts-expanded" provider={provider} />
              </>
            ),
            props: { colSpan: columns.length, className: tableStyles.modifiers.noPadding },
          },
        ],
      });
    }
  });

  return (
    <>
      <Level>
        <LevelItem>
          <Button variant="secondary" onClick={() => alert('TODO')} isDisabled>
            Download data
          </Button>
        </LevelItem>
        <LevelItem>
          <Pagination {...paginationProps} widgetId="providers-table-pagination-top" />
        </LevelItem>
      </Level>
      <Table
        aria-label="VMWare providers table"
        cells={columns}
        rows={rows}
        sortBy={sortBy}
        onSort={onSort}
        onExpand={(_event, _rowIndex, _colIndex, _isOpen, rowData) => {
          toggleProviderExpanded(rowData.meta.provider);
        }}
      >
        <TableHeader />
        <TableBody />
      </Table>
      <Pagination
        {...paginationProps}
        widgetId="providers-table-pagination-bottom"
        variant="bottom"
      />
    </>
  );
};

export default VMWareProvidersTable;

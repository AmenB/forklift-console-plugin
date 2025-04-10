import React, { FC } from 'react';
import { ModalHOC } from 'src/modules/Providers';

import { Flex, FlexItem } from '@patternfly/react-core';

import { PlanVMsCellProps } from '../components';
import PlanVMActionsDropdown from './PlanVMActionsDropdown';

const ActionsCell: FC<PlanVMsCellProps> = ({ data: vm }) => {
  return (
    <Flex flex={{ default: 'flex_3' }} flexWrap={{ default: 'nowrap' }}>
      <FlexItem grow={{ default: 'grow' }} />

      <FlexItem align={{ default: 'alignRight' }}>
        <ModalHOC>
          <PlanVMActionsDropdown data={vm} fieldId="actions" />
        </ModalHOC>
      </FlexItem>
    </Flex>
  );
};

export default ActionsCell;

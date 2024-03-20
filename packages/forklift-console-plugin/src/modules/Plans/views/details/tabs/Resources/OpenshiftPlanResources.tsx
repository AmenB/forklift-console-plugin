import React from 'react';
import SectionHeading from 'src/components/headers/SectionHeading';
import { useForkliftTranslation } from 'src/utils/i18n';

import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@kubev2v/common';
import { OpenshiftVM, V1VirtualMachine } from '@kubev2v/types';
import { PageSection } from '@patternfly/react-core';

export const OpenshiftPlanResources: React.FC<{ planInventory: OpenshiftVM[] }> = ({
  planInventory,
}) => {
  const { t } = useForkliftTranslation();

  const planInventoryRunning = planInventory?.filter((vm) => vm?.object?.spec?.running);

  const totalResources = planInventory.reduce(
    (accumulator, currentVM) => {
      return {
        cpuCount: accumulator.cpuCount + k8sCpuToCores(getK8sCPU(currentVM.object)),
        memoryMB:
          accumulator.memoryMB + k8sMemoryToBytes(getK8sVMMemory(currentVM.object)) / 2 ** 20,
      };
    },
    { cpuCount: 0, memoryMB: 0 },
  );

  const totalResourcesRunning = planInventoryRunning.reduce(
    (accumulator, currentVM) => {
      return {
        cpuCount: accumulator.cpuCount + k8sCpuToCores(getK8sCPU(currentVM.object)),
        memoryMB:
          accumulator.memoryMB + k8sMemoryToBytes(getK8sVMMemory(currentVM.object)) / 2 ** 20,
      };
    },
    { cpuCount: 0, memoryMB: 0 },
  );

  return (
    <PageSection variant="light">
      <SectionHeading text={t('Calculated resources')} />
      <TableComposable variant="compact">
        <Thead>
          <Th></Th>
          <Th>{t('Total virtual machines')}</Th>
          <Th>{t('Running virtual machines')}</Th>
        </Thead>
        <Tbody>
          <Tr>
            <Td width={10}>
              <strong>{t('Virtual machines:')}</strong>
            </Td>
            <Td width={10}>{planInventory?.length}</Td>
            <Td width={10}>{planInventoryRunning?.length}</Td>
          </Tr>
          <Tr>
            <Th width={10}>
              <strong>{t('Total CPU count:')}</strong>
            </Th>
            <Td width={10}>{totalResources.cpuCount || '-'} Cores</Td>
            <Td width={10}>{totalResourcesRunning.cpuCount || '-'} Cores</Td>
          </Tr>
          <Tr>
            <Th width={10}>
              <strong>{t('Total memory:')}</strong>
            </Th>
            <Td width={10}>{totalResources.memoryMB || '-'} MB</Td>
            <Td width={10}>{totalResourcesRunning.memoryMB || '-'} MB</Td>
          </Tr>
        </Tbody>
      </TableComposable>
    </PageSection>
  );
};

const getK8sCPU = (vm: V1VirtualMachine) => vm?.spec?.template?.spec?.domain?.cpu?.cores || '0';
const getK8sVMMemory = (vm: V1VirtualMachine) =>
  vm?.spec?.template?.spec?.domain?.resources.requests?.['memory'] || '0Mi';

function k8sMemoryToBytes(memoryString) {
  const units = {
    // Binary SI units (powers of 2)
    KI: 2 ** 10,
    MI: 2 ** 20,
    GI: 2 ** 30,
    TI: 2 ** 40,
    PI: 2 ** 50,
    EI: 2 ** 60,
    // Decimal SI units (powers of 10)
    K: 10 ** 3,
    M: 10 ** 6,
    G: 10 ** 9,
    T: 10 ** 12,
    P: 10 ** 15,
    E: 10 ** 18,
  };

  // Enhance the regex to include both binary and decimal SI units
  const regex = /^(\d+)(Ki|Mi|Gi|Ti|Pi|Ei|K|M|G|T|P|E)?$/i;
  const match = memoryString.match(regex);

  if (match) {
    const value = parseInt(match[1], 10);
    const unit = match[2];

    if (unit) {
      // Normalize unit to handle case-insensitivity
      const normalizedUnit = unit.toUpperCase();
      return value * (units[normalizedUnit] || 1);
    }
    // Assuming plain bytes if no unit is specified
    return value;
  } else {
    throw new Error('Invalid memory string format');
  }
}

function k8sCpuToCores(cpuString) {
  if (cpuString.endsWith('m')) {
    // Remove the "m" and convert to millicores, then to cores.
    const millicores = parseInt(cpuString.slice(0, -1), 10);
    return millicores / 1000.0; // Convert millicores to cores
  } else {
    // Directly parse the string as a float representing cores.
    return parseFloat(cpuString);
  }
}

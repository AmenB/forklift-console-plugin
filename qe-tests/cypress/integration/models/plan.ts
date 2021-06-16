import { PlanData } from '../types/types';
import {
  clickByText,
  click,
  inputText,
  next,
  openSidebarMenu,
  selectFromDroplist,
} from '../../utils/utils';
import { navMenuPoint } from '../views/menu.view';

import {
  button,
  createPlan,
  deleteButton,
  finish,
  migrationPLan,
  tdTag,
  trTag,
  SEC,
  planSuccessMessage,
  planCanceledMessage,
  // CreateNewNetworkMapping,
} from '../types/constants';

import {
  dataLabel,
  mappingDropdown,
  planDescriptionInput,
  planNameInput,
  searchInput,
  selectDestProviderMenu,
  selectSourceProviderMenu,
  selectTargetNamespace,
  kebab,
} from '../views/plan.view';
import { kebabDropDownItem } from '../views/provider.view';

export class Plan {
  protected static openList(): void {
    openSidebarMenu();
    clickByText(navMenuPoint, migrationPLan);
  }
  protected fillName(name: string): void {
    inputText(planNameInput, name);
  }

  protected fillDescription(description: string): void {
    if (description) {
      inputText(planDescriptionInput, description);
    }
  }

  protected selectSourceProvider(sProvider: string): void {
    selectFromDroplist(selectSourceProviderMenu, sProvider);
  }

  protected selectTargetProvider(tProvider: string): void {
    selectFromDroplist(selectDestProviderMenu, tProvider);
  }

  protected selectNamespace(namespace: string): void {
    selectFromDroplist(selectTargetNamespace, namespace);
  }

  protected generalStep(planData: PlanData): void {
    const { name, description, sProvider, tProvider, namespace } = planData;
    this.fillName(name);
    this.fillDescription(description);
    this.selectSourceProvider(sProvider);
    this.selectTargetProvider(tProvider);
    this.selectNamespace(namespace);
    next();
  }

  protected filterVm(planData: PlanData): void {
    const { vmwareSourceFqdn } = planData;
    const selector = `[aria-label="Select Host ${vmwareSourceFqdn}"]`;
    click(selector);
    next();
  }

  protected selectVm(planData: PlanData): void {
    const { vmwareSourceVmList } = planData;
    const selector = 'button.pf-c-button.pf-m-control';
    vmwareSourceVmList.forEach((name) => {
      inputText(searchInput, name);
      click(selector);
      cy.get(tdTag)
        .contains(name)
        .parent(trTag)
        .within(() => {
          click('input');
        });
    });
    next();
  }

  protected vmSelectionStep(planData: PlanData): void {
    this.filterVm(planData);
    this.selectVm(planData);
  }

  protected networkMappingStep(planData: PlanData): void {
    const { name } = planData.networkMappingData;
    const { useExistingNetworkMapping } = planData;
    if (useExistingNetworkMapping) selectFromDroplist(mappingDropdown, name);
    // } else {
    //   const { networkMappingPeer } = planData.networkMappingData;
    //   selectFromDroplist(mappingDropdown, CreateNewNetworkMapping);
    // }

    next();
  }

  protected storageMappingStep(planData: PlanData): void {
    const { name } = planData.storageMappingData;
    const { useExistingStorageMapping } = planData;
    if (useExistingStorageMapping) {
      selectFromDroplist(mappingDropdown, name);
    }
    next();
  }

  protected migrationTypeAndReview(): void {
    //Default migration type is cold migration
    next();
    clickByText(button, finish);
  }

  protected run(name: string): void {
    cy.get(tdTag)
      .contains(name)
      .parent(tdTag)
      .parent(trTag)
      .within(() => {
        clickByText(button, 'Start');
      });
  }

  protected waitForSuccess(name: string): void {
    cy.get(tdTag)
      .contains(name)
      .parent(tdTag)
      .parent(trTag)
      .within(() => {
        cy.get(dataLabel.status).contains(planSuccessMessage, { timeout: 3600 * SEC });
      });
  }

  protected waitForCanceled(name: string): void {
    //Go to Migration plans list page
    Plan.openList();
    cy.get(tdTag)
      .contains(name)
      .parent(tdTag)
      .parent(trTag)
      .within(() => {
        cy.get(dataLabel.status).contains(planCanceledMessage, { timeout: 3600 * SEC });
      });
  }

  protected plan_details(name: string): void {
    cy.get(tdTag).contains(name).parent(tdTag).parent(trTag).click();
  }

  protected cancel(name: string): void {
    this.plan_details(name);
    cy.get(`[aria-label="Select row 0"]`, { timeout: 20000 }).should('be.enabled').check();
    clickByText(button, 'Cancel');
    clickByText(button, 'Yes, cancel');
  }

  // protected populate(planData: PlanData): void {}

  create(planData: PlanData): void {
    Plan.openList();
    clickByText(button, createPlan);
    this.generalStep(planData);
    this.vmSelectionStep(planData);
    this.networkMappingStep(planData);
    this.storageMappingStep(planData);
    this.migrationTypeAndReview();
  }

  delete(planData: PlanData): void {
    const { name } = planData;
    Plan.openList();
    // applyAction(name, deleteButton);
    cy.get(tdTag)
      .contains(name)
      .parent(tdTag)
      .parent(trTag)
      .within(() => {
        click(kebab);
      });
    clickByText(kebabDropDownItem, deleteButton);
    // clickByText(button, deleteButton);
    click('#modal-confirm-button');
  }

  execute(planData: PlanData): void {
    const { name } = planData;
    Plan.openList();
    this.run(name);
    this.waitForSuccess(name);
  }

  restart(name: string): void {
    cy.get(tdTag)
      .contains(name)
      .parent(tdTag)
      .parent(trTag)
      .within(() => {
        clickByText(button, 'Restart');
      });
  }

  cancel_and_restart(planData: PlanData): void {
    const { name } = planData;
    Plan.openList();
    this.run(name);
    this.cancel(name);
    this.waitForCanceled(name);
    this.restart(name);
    cy.wait(10000);
    openSidebarMenu();
    clickByText(navMenuPoint, migrationPLan);
    this.waitForSuccess(name);
  }
}

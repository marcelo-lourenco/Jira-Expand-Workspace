import { state } from '../state.js';
import { Utils } from '../utils.js';
import { UI } from '../ui.js';
import { JiraType, BY } from '../constants.js';

export const CollapsePanel = {
  init() {
    this.addCollapseButton();
  },

  fnCollapseOpen(containerRight, spanCollapseOpen, modalIssueDetailsDialog, modalIssueDetailsDialogPositioner) {
    if (containerRight.style.display === 'none') {
      UI.addIconCollapse(spanCollapseOpen);
      containerRight.style.display = state.jiraType === JiraType.CLOUD ? 'block' : '';
    } else {
      UI.addIconOpen(spanCollapseOpen);
      containerRight.style.display = 'none';
    }
    if (modalIssueDetailsDialog && modalIssueDetailsDialogPositioner) {
      UI.expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
    }
  },

  addCollapseButton() {
    try {
      const containerRightSelector = Utils.getSelector('containerRight');
      const resizerElementSelector = Utils.getSelector('resizerElement');

      if (!containerRightSelector || !resizerElementSelector) return;

      const containerRight = document.querySelector(containerRightSelector);
      const resizerElement = document.querySelector(resizerElementSelector);

      if (containerRight && resizerElement && !document.getElementById('span-collapse-open')) {
        const spanCollapseOpen = Utils.createElement('span', {
          id: 'span-collapse-open',
          className: 'icon-collapse', // Initial state: panel is open, button shows "collapse"
          title: BY
        });

        const modalIssueDetailsDialogPositionerSelector = Utils.getSelector('modalIssueDetailsDialogPositioner');
        const modalIssueDetailsDialogSelector = Utils.getSelector('modalIssueDetailsDialog');
        const modalIssueDetailsDialogPositioner = modalIssueDetailsDialogPositionerSelector ? document.querySelector(modalIssueDetailsDialogPositionerSelector) : null;
        const modalIssueDetailsDialog = modalIssueDetailsDialogSelector ? document.querySelector(modalIssueDetailsDialogSelector) : null;

        // Initial state: panel visible, icon "collapse"
        containerRight.style.display = state.jiraType === JiraType.CLOUD ? 'block' : '';
        UI.addIconCollapse(spanCollapseOpen);
        if (modalIssueDetailsDialog && modalIssueDetailsDialogPositioner) {
          UI.expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
        }

        spanCollapseOpen.addEventListener('click', () => {
          this.fnCollapseOpen(containerRight, spanCollapseOpen, modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
        });

        if (state.jiraType === JiraType.CLOUD) {
          let refToJiraExpandCollapseWrapper = document.querySelector('div > button[data-testid="issue-view-foundation.modal-close-button"]')?.parentElement;
          console.log("refToJiraExpandCollapseWrapper",refToJiraExpandCollapseWrapper)
          if (refToJiraExpandCollapseWrapper) {
            const collapseWrapper = Utils.createElement('div', { id: 'jira-expand-collapse-wrapper', style: { display: 'flex', justifyContent: 'flex-end' } });
            collapseWrapper.appendChild(spanCollapseOpen);
            refToJiraExpandCollapseWrapper.parentNode.insertBefore(collapseWrapper, refToJiraExpandCollapseWrapper.nextSibling || null);
            return;
          } else {
            let stickyHeaderContainer = document.querySelector('[id="jira-issue-header"]');
            if (stickyHeaderContainer) {
              Object.assign(stickyHeaderContainer.style, { display: 'flex', justifyContent: 'space-between' });
              const collapseWrapper = Utils.createElement('div', { id: 'jira-expand-collapse-wrapper', style: { display: 'flex', justifyContent: 'flex-end' } });
              collapseWrapper.appendChild(spanCollapseOpen);
              stickyHeaderContainer.appendChild(collapseWrapper);
              return;
            }
          }
        }
        resizerElement.appendChild(spanCollapseOpen);
      }
    } catch (error) {
      console.error('Jira Expand Extension: Error adding collapse button:', error);
    }
  }
};

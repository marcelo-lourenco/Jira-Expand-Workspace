import { state } from './state.js';
import { JiraType } from './constants.js';

export const UI = {
  addIconCollapse(spanCollapseOpen) {
    spanCollapseOpen.classList.remove('icon-open');
    spanCollapseOpen.classList.add('icon-collapse');
  },

  addIconOpen(spanCollapseOpen) {
    spanCollapseOpen.classList.remove('icon-collapse');
    spanCollapseOpen.classList.add('icon-open');
  },

  addIconShrink(spanShrinkExpand) {
    spanShrinkExpand.classList.remove('icon-expand');
    spanShrinkExpand.classList.add('icon-shrink');
    if (state.jiraType !== JiraType.CLOUD) {
      Object.assign(spanShrinkExpand.style, {
        margin: '0px -10px -5px 10px',
      });
    }
  },

  addIconExpand(spanShrinkExpand) {
    spanShrinkExpand.classList.remove('icon-shrink');
    spanShrinkExpand.classList.add('icon-expand');
    if (state.jiraType !== JiraType.CLOUD) {
      Object.assign(spanShrinkExpand.style, {
        margin: '0px -10px -5px 10px',
      });
    }
  },

  expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner) {
    if (modalIssueDetailsDialog && modalIssueDetailsDialogPositioner) {
      modalIssueDetailsDialog.style.width = state.jiraType === JiraType.CLOUD ? '100%' : '';
      Object.assign(modalIssueDetailsDialogPositioner.style, {
        maxWidth: "calc(-20px + 100vw)",
        maxHeight: "calc(-70px + 100vh)",
        insetBlockStart: "60px",
      });
    }
  }
};

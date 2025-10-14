import { JiraType } from './constants.js';

export const state = {
  jiraType: JiraType.UNKNOWN,
  currentProjectKey: null,
  settings: {
    collapseRightPanel: true,
    expandCreateModal: true,
    viewLinkedTickets: true,
    expandImages: true
  }
};

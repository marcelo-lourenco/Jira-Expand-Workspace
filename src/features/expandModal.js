import { state } from '../state.js';
import { Utils } from '../utils.js';
import { UI } from '../ui.js';
import { JiraType, BY } from '../constants.js';

export const ExpandModal = {
  init() {
    this.addExpandButton();
  },

  fnShrinkExpand(modalIssueCreate, spanShrinkExpand, modalIssueCreatePositioner) {
    const isCurrentlyExpanded = modalIssueCreate.style.width === '100%';

    if (!isCurrentlyExpanded) {
      UI.addIconShrink(spanShrinkExpand);
      modalIssueCreate.style.width = '100%';
      const positionerStyles = state.jiraType === JiraType.CLOUD ? {
        width: "100%", maxWidth: "100%", maxHeight: "calc(-60px + 100vh)", insetBlockStart: "60px",
      } : {
        width: "100%", insetBlockStart: "40px", height: "calc(-40px + 100vh)",
      };
      Object.assign(modalIssueCreatePositioner.style, positionerStyles);
    } else {
      UI.addIconExpand(spanShrinkExpand);
      modalIssueCreate.style.width = '';
      const defaultPositionerStyles = {
        width: '', maxWidth: '', maxHeight: '', height: '',
        insetBlockStart: state.jiraType === JiraType.CLOUD ? "60px" : '',
      };
      Object.assign(modalIssueCreatePositioner.style, defaultPositionerStyles);
      if (state.jiraType !== JiraType.CLOUD) {
        modalIssueCreatePositioner.style.insetBlockStart = '';
      }
    }
  },

  addExpandButton() {
    try {
      const modalIssueCreatePositionerSelector = Utils.getSelector('modalIssueCreatePositioner');
      const modalIssueCreateSelector = Utils.getSelector('modalIssueCreate');
      const modalIconsSelector = Utils.getSelector('modalIcons');

      if (!modalIssueCreatePositionerSelector || !modalIssueCreateSelector || !modalIconsSelector) return;

      const modalIssueCreatePositioner = document.querySelector(modalIssueCreatePositionerSelector);
      const modalIssueCreate = document.querySelector(modalIssueCreateSelector);
      const modalIcons = document.querySelector(modalIconsSelector);

      if (modalIssueCreate && modalIssueCreatePositioner && modalIcons && !document.getElementById('span-shrink-expand')) {
        if (state.jiraType !== JiraType.CLOUD) {
          modalIcons.style.display = 'flex';
        }

        const spanShrinkExpand = Utils.createElement('span', { id: 'span-shrink-expand', title: BY });

        // Initialize to expanded state as per original behavior
        UI.addIconShrink(spanShrinkExpand);
        modalIssueCreate.style.width = '100%';
        const initialPositionerStyles = state.jiraType === JiraType.CLOUD ? {
          width: "100%", maxWidth: "100%", maxHeight: "calc(-60px + 100vh)", insetBlockStart: "60px",
        } : {
          width: "100%", insetBlockStart: "40px", height: "calc(-40px + 100vh)",
        };
        Object.assign(modalIssueCreatePositioner.style, initialPositionerStyles);

        spanShrinkExpand.addEventListener('click', () => {
          this.fnShrinkExpand(modalIssueCreate, spanShrinkExpand, modalIssueCreatePositioner);
        });
        modalIcons.appendChild(spanShrinkExpand);
      }
    } catch (error) {
      console.error('Jira Expand Extension: Error adding expand button:', error);
    }
  }
};

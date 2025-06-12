/**
 * Jira Expand Extension
 * Enhances Jira Cloud and Server with expandable modals and linked issue viewing
 * @author Marcelo Lourenço
 * @version 2.0
 */

// Constants
const BY = 'By Jira Expand Extension';
const BY_URL = 'https://chromewebstore.google.com/detail/occanfpdiglllenbekgbnhijeoincilf';

// Jira Types
const JiraType = {
  CLOUD: 'CLOUD',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN'
};

// Status Colors
const STATUS_COLORS = {
  new: { color: 'status-color-new', bgColor: 'status-bg-color-new' },
  indeterminate: { color: 'status-color-indeterminate', bgColor: 'status-bg-color-indeterminate' },
  done: { color: 'status-color-done', bgColor: 'status-bg-color-done' },
  other: { color: 'status-color-other', bgColor: 'status-bg-color-other' },
};

// Selectors
const Selectors = {
  CLOUD: {
    containerRight: '[data-testid="issue.views.issue-details.issue-layout.container-right"]',
    resizerElement: '[data-testid="flex-resizer.ui.handle.resizer"]',
    modalIssueCreatePositioner: '[data-testid="issue-create.ui.modal.modal-wrapper.modal--positioner"]',
    modalIssueCreate: '[data-testid="issue-create.ui.modal.modal-wrapper.modal"]',
    modalIcons: '[data-testid="minimizable-modal.ui.modal-container.modal-header.view-changer-wrapper"]',
    modalIssueDetailsDialogPositioner: '[data-testid="issue.views.issue-details.issue-modal.modal-dialog--positioner"]',
    modalIssueDetailsDialog: '[data-testid="issue.views.issue-details.issue-modal.modal-dialog"]',
    board: '[data-testid="platform-board-kit.ui.board.scroll.board-scroll"]',
    card: '[data-testid="platform-board-kit.ui.card.card"]',
    cardFooter: '[data-testid="platform-card.ui.card.card-content.footer"]',
    issueKey: '[data-testid="platform-card.common.ui.key.key"] a'
  },
  SERVER: {
    containerRight: '.issue-side-column',
    resizerElement: '.aui-toolbar2-secondary',
    modalIssueCreatePositioner: '#create-issue-dialog',
    modalIssueCreate: '.jira-dialog-core-heading',
    modalIcons: '.qf-form-operations',
    modalIssueDetailsDialogPositioner: '#viewissuesidebar',
    modalIssueDetailsDialog: '#viewissuesidebar',
    board: '.ghx-board',
    card: '.ghx-issue',
    cardFooter: '.ghx-issue-footer',
    issueKey: '.ghx-key a'
  }
};

// State Management
const state = {
  jiraType: JiraType.UNKNOWN,
  activeTooltip: null,
  currentProjectKey: null,
  settings: {
    collapseRightPanel: true,
    expandCreateModal: true,
    viewLinkedTickets: true
  },
  elements: {
    containerRight: null,
    resizerElement: null,
    modalIssueCreate: null,
    modalIcons: null
  }
};

// Utility Functions
const Utils = {
  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  getJiraType() {
    if (document.getElementById('jira-frontend')) {
      return JiraType.CLOUD;
    } else if (document.getElementById('page')) {
      return JiraType.SERVER;
    }
    return JiraType.UNKNOWN;
  },

  getProjectKeyFromURL() {
    const match = window.location.pathname.match(/\/projects\/([A-Z]+)\/board/);
    return match ? match[1] : null;
  },

  getSelector(key) {
    return Selectors[state.jiraType][key];
  },

  createElement(type, attributes = {}, children = []) {
    const element = document.createElement(type);
    Object.assign(element, attributes);
    children.forEach(child => element.appendChild(child));
    return element;
  },

  async fetchWithRetry(url, retries = 3) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.fetchWithRetry(url, retries - 1);
      }
      throw error;
    }
  }
};

// Tooltip Manager
class TooltipManager {
  constructor() {
    this.tooltip = null;
    this.tooltipDelay = 1000;
  }

  create(content) {
    this.destroy();
    this.tooltip = Utils.createElement('div', {
      className: 'tooltip-style'
    }, [
      Utils.createElement('div', {
        className: 'tooltip-content-container',
        innerHTML: content
      })
    ]);
    document.body.appendChild(this.tooltip);
    return this.tooltip;
  }

  destroy() {
    if (this.tooltip) {
      document.body.removeChild(this.tooltip);
      this.tooltip = null;
    }
  }

  adjustPosition(event) {
    if (!this.tooltip) return;

    const SPACE = 10;
    const { pageX, pageY } = event;
    const tooltipRect = this.tooltip.getBoundingClientRect();

    let left = pageX + SPACE;
    let top = pageY + SPACE;

    if (left + tooltipRect.width > window.innerWidth) {
      left = pageX - tooltipRect.width - SPACE;
    }

    if (top + tooltipRect.height > window.innerHeight) {
      top = pageY - tooltipRect.height - SPACE;
    }

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
  }
}

const tooltipManager = new TooltipManager();

// UI Components
const UI = {
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
    if (modalIssueDetailsDialog) {
      modalIssueDetailsDialog.style.width = state.jiraType === JiraType.CLOUD ? '100%' : '';
      Object.assign(modalIssueDetailsDialogPositioner.style, {
        maxWidth: "calc(-20px + 100vw)",
        maxHeight: "calc(-70px + 100vh)",
        insetBlockStart: "60px",
      });
    }
  }
};

// Feature: Collapsible Right Panel
const CollapsePanel = {
  init() {
    this.addCollapseButton();
  },

  fnCollapseLoad(containerRight, spanCollapseOpen, modalIssueDetailsDialog, modalIssueDetailsDialogPositioner) {
    UI.expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);

    if (containerRight.style.display === 'none') {
      UI.addIconCollapse(spanCollapseOpen);
      containerRight.style.display = 'block';
      UI.expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
    } else {
      UI.addIconCollapse(spanCollapseOpen);
      containerRight.style.display = state.jiraType === JiraType.CLOUD ? 'block' : '';
      UI.expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
    }
  },

  fnCollapseOpen(containerRight, spanCollapseOpen, modalIssueDetailsDialog, modalIssueDetailsDialogPositioner) {
    if (containerRight.style.display === 'none') {
      UI.addIconCollapse(spanCollapseOpen);
      containerRight.style.display = state.jiraType === JiraType.CLOUD ? 'block' : '';
      UI.expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
    } else {
      UI.addIconOpen(spanCollapseOpen);
      containerRight.style.display = 'none';
      UI.expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
    }
  },

  addCollapseButton() {
    try {
      const containerRight = document.querySelector(Utils.getSelector('containerRight'));
      const resizerElement = document.querySelector(Utils.getSelector('resizerElement'));

      if (containerRight && resizerElement && !document.getElementById('span-collapse-open')) {
        const spanCollapseOpen = Utils.createElement('span', {
          id: 'span-collapse-open',
          className: 'icon-collapse',
          title: BY
        });

        const modalIssueDetailsDialogPositioner = document.querySelector(Utils.getSelector('modalIssueDetailsDialogPositioner'));
        const modalIssueDetailsDialog = document.querySelector(Utils.getSelector('modalIssueDetailsDialog'));

        this.fnCollapseLoad(containerRight, spanCollapseOpen, modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);

        spanCollapseOpen.addEventListener('click', () => {
          this.fnCollapseOpen(containerRight, spanCollapseOpen, modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
        });

        if (state.jiraType === JiraType.CLOUD) {

          // Fallback to original logic if sticky header is not found
          // Try to find the close button of the modal or other reference points
          let refToJiraExpandCollapseWrapper = document.querySelector('div > button[data-testid="issue-view-foundation.modal-close-button"]')?.parentElement;


          if (refToJiraExpandCollapseWrapper) {
            const collapseWrapper = Utils.createElement('div', {
              id: 'jira-expand-collapse-wrapper'
            });
            collapseWrapper.style.display = 'flex';
            collapseWrapper.style.justifyContent = 'flex-end';
            collapseWrapper.appendChild(spanCollapseOpen);

            // Insert the wrapper after the reference button's parent div
            if (refToJiraExpandCollapseWrapper.nextSibling) {
              refToJiraExpandCollapseWrapper.parentNode.insertBefore(collapseWrapper, refToJiraExpandCollapseWrapper.nextSibling);
            } else {
              refToJiraExpandCollapseWrapper.parentNode.appendChild(collapseWrapper);
            }
            return; // Button placed relative to refToJiraExpandCollapseWrapper, skip default append
          } else {
            let stickyHeaderContainer = document.querySelector('[id="jira-issue-header"]');

            if (stickyHeaderContainer) {
              stickyHeaderContainer.style.display = 'flex';
              stickyHeaderContainer.style.justifyContent = 'space-between'
              const collapseWrapper = Utils.createElement('div', {
                id: 'jira-expand-collapse-wrapper'
              });
              collapseWrapper.style.display = 'flex';
              collapseWrapper.style.justifyContent = 'flex-end';
              collapseWrapper.appendChild(spanCollapseOpen); stickyHeaderContainer.appendChild(collapseWrapper);
              return; // Button placed in sticky header
            }

          }
        }

        // Default placement for Server, or Cloud if specific locations above were not found
        resizerElement.appendChild(spanCollapseOpen);
      }
    } catch (error) {
      console.error('Error adding collapse button:', error);
    }
  }
};

// Feature: Expandable Create Modal
const ExpandModal = {
  init() {
    this.addExpandButton();
  },

  fnShrinkExpand(modalIssueCreate, spanShrinkExpand, modalIssueCreatePositioner) {
    if (modalIssueCreate.style.width !== '100%') {
      UI.addIconShrink(spanShrinkExpand);
      modalIssueCreate.style.width = '100%';

      if (state.jiraType === JiraType.CLOUD) {
        Object.assign(modalIssueCreatePositioner.style, {
          width: "100%",
          maxWidth: "100%",
          maxHeight: "calc(-60px + 100vh)",
          insetBlockStart: "60px",
        });
      } else {
        modalIssueCreatePositioner.style.height = '100%';
        Object.assign(modalIssueCreatePositioner.style, {
          width: "100%",
          insetBlockStart: "40px",
          height: "calc(-40px + 100vh)",
        });
      }
    } else {
      UI.addIconExpand(spanShrinkExpand);
      modalIssueCreate.style.width = '';
      if (state.jiraType === JiraType.CLOUD) {
        Object.assign(modalIssueCreatePositioner.style, {
          width: '',
          maxWidth: '',
          maxHeight: '',
          insetBlockStart: "60px",
        });
      } else {
        modalIssueCreatePositioner.style.height = '';
        Object.assign(modalIssueCreatePositioner.style, {
          width: '',
          insetBlockStart: '',
          height: '',
        });
      }
    }
  },

  addExpandButton() {
    try {
      const modalIssueCreatePositioner = document.querySelector(Utils.getSelector('modalIssueCreatePositioner'));
      const modalIssueCreate = document.querySelector(Utils.getSelector('modalIssueCreate'));
      const modalIcons = document.querySelector(Utils.getSelector('modalIcons'));

      if (modalIssueCreate && modalIcons && !document.getElementById('span-shrink-expand')) {
        if (state.jiraType !== JiraType.CLOUD) {
          Object.assign(modalIcons.style, {
            display: 'flex',
          });
        }

        const spanShrinkExpand = Utils.createElement('span', {
          id: 'span-shrink-expand',
          title: BY
        });
        UI.addIconExpand(spanShrinkExpand);

        this.fnShrinkExpand(modalIssueCreate, spanShrinkExpand, modalIssueCreatePositioner);

        spanShrinkExpand.addEventListener('click', () => {
          this.fnShrinkExpand(modalIssueCreate, spanShrinkExpand, modalIssueCreatePositioner);
        });

        modalIcons.appendChild(spanShrinkExpand);
      }
    } catch (error) {
      console.error('Error adding expand button:', error);
    }
  }
};

// Feature: Linked Issues Viewer
const LinkedIssues = {
  init() {
    this.checkAndAddIcons();
    setInterval(() => this.checkAndAddIcons(), 1500);
    document.addEventListener('click', this.handleDocumentClick);
  },

  async fetchAssigneeDetails(linkedIssueSelf) {
    try {
      const issueData = await Utils.fetchWithRetry(linkedIssueSelf);
      return issueData.fields.assignee;
    } catch (error) {
      console.error('Error fetching issue details:', error);
      throw error;
    }
  },

  async generateLinkedIssueHTML(linkedIssue, relationship) {
    try {
      const assignee = await this.fetchAssigneeDetails(linkedIssue.self);
      const assigneeAvatarUrl = assignee?.avatarUrls?.['16x16'] || '';
      const assigneeDisplayName = assignee?.displayName || '';

      const { key: statusCategory } = linkedIssue.fields.status.statusCategory;
      const status = linkedIssue.fields.status.name.toLowerCase();
      const { iconUrl, name: issueTypeName } = linkedIssue.fields.issuetype;

      const { color: statusColor, bgColor: statusBgColor } = STATUS_COLORS[statusCategory] || STATUS_COLORS.other;

      return `
        <div role="listitem" class="list-item bg-color-neutral-subtle-hovered text-decoration-color-initial text-decoration-line-none text-decoration-style-solid bg-color-neutral-subtle-pressed">
          <div data-testid="issue-line-card.card-container" class="issue-line-card-container">
            <div data-testid="issue-line-card.issue-type.tooltip--container" role="presentation">
              <div data-testid="issue-line-card-issue-type.issue-type" class="issue-line-issue-type">
                <div class="issue-line-issue-type-grid">
                  <img src="${iconUrl}" alt="${issueTypeName}" title="${issueTypeName}" class="issue-line-issue-type-img" draggable="false">
                </div>
              </div>
            </div>
            <span>
              <span data-testid="hover-card-trigger-wrapper">
                <a data-testid="issue.issue-view.views.common.issue-line-card.issue-line-card-view.key" href="/browse/${linkedIssue.key}" target="_blank" class="issue-line-card-view-key" aria-label="${linkedIssue.key} ${status}" role="link" draggable="false">${linkedIssue.key}</a>
              </span>
            </span>
            <div data-testid="issue.issue-view.views.common.issue-line-card.issue-line-card-view.summary" class="issue-line-card-view-summary">
              <span>
                <span data-testid="hover-card-trigger-wrapper">
                  <a data-testid="issue-field-summary.ui.inline-read.link-item" href="/browse/${linkedIssue.key}" target="_blank" class="issue-line-card-view-summary-a" data-is-router-link="false" data-vc="link-item" tabindex="0" draggable="false" aria-disabled="false">
                    <span class="issue-line-card-view-summary-span" data-testid="issue-field-summary.ui.inline-read.link-item--primitive--container">
                      <div class="issue-line-card-view-summary-div">
                        <span class="linkedIssue-fields-summary" data-item-title="true">${linkedIssue.fields.summary}</span>
                      </div>
                    </span>
                  </a>
                </span>
              </span>
            </div>
            <div role="presentation">
              <div data-testid="issue-line-card.ui.assignee.read-only-assignee" role="img" class="issue-line-card-read-only-assignee-inner">
                <span data-testid="issue-line-card.ui.assignee.read-only-assignee--inner" class="issue-line-card-assignee-inner">
                  <img src="${assigneeAvatarUrl}" title="${assigneeDisplayName}" class="issue-line-card-assignee-image">
                </span>
              </div>
            </div>
            <div data-testid="issue-line-card.ui.status.status-field-container" class="issue-line-card-status-field-container">
              <div role="presentation">
                <div>
                  <div>
                    <button aria-label="${status}" aria-expanded="false" class="issue-line-card-view-button-status" tabindex="0" type="button">
                      <span class="issue-line-card-view-button-span">
                        <span class="issue-line-card-view-button-span2">
                          <div data-testid="issue.fields.status.common.ui.status-lozenge.3" class="issue-fields-status-lozenge">
                            <span class="issue-line-card-view-button-span3 ${statusBgColor}">
                              <span class="issue-line-card-view-button-span4">
                                <div class="issue-line-card-view-button-status-color ${statusColor}">${status}</div>
                              </span>
                            </span>
                          </div>
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      return `<p>Error fetching assignee details: ${error.message}</p>`;
    }
  },

  async fetchLinkedIssues(issueKey) {
    try {
      const apiUrl = `/rest/api/3/issue/${issueKey}?fields=issuelinks`;
      const data = await Utils.fetchWithRetry(apiUrl);
      const linkedIssues = data.fields.issuelinks || [];

      if (linkedIssues.length === 0) {
        return { groupedLinksHtml: '<p>No linked items.</p>', title: 'Linked items' };
      }

      const groupedLinks = {};
      for (const link of linkedIssues) {
        const linkedIssue = link.inwardIssue || link.outwardIssue;
        const relationship = link.type.inward || link.type.outward;

        if (linkedIssue) {
          if (!groupedLinks[relationship]) {
            groupedLinks[relationship] = [];
          }
          groupedLinks[relationship].push(await this.generateLinkedIssueHTML(linkedIssue, relationship));
        }
      }

      let groupedLinksHtml = '';
      for (const relationship in groupedLinks) {
        groupedLinksHtml += `
          <div data-testid="issue.views.issue-base.content.issue-links.group-container" class="issue-links-group-container">
            <h3 class="issue-links-group-container-h3">
              <span data-testid="issue.issue-view.views.issue-base.content.issue-links.issue-links-view.relationship-heading">${relationship}</span>
            </h3>
            <div class="margin-top-8">
              <ul class="ul-card-container">
                ${groupedLinks[relationship].join('')}
              </ul>
            </div>
          </div>
        `;
      }
      return { groupedLinksHtml, title: 'Linked items' };
    } catch (error) {
      console.error('Error fetching linked issues:', error);
      return { error: `<p>Error fetching linked issues: ${error.message}</p>`, title: 'Error' };
    }
  },

  getIssueKeyFromCard(cardElement) {
    const issueKeyElement = cardElement.querySelector(Utils.getSelector('issueKey'));
    return issueKeyElement ? issueKeyElement.textContent.trim() : null;
  },

  async handleIconMouseOver(event, iconLink, issueKey) {
    if (!tooltipManager.tooltip) {
      tooltipManager.create('');
    }

    try {
      const { groupedLinksHtml, error, title } = await this.fetchLinkedIssues(issueKey);
      const titleElement = tooltipManager.tooltip?.querySelector('.title-linked-items');
      if (titleElement) {
        titleElement.textContent = title;
      }

      const tooltipContent = error
        ? `<div class="issue-tooltip-div1">
             <div class="issue-tooltip-linked-items-label">
               <label for="issue-link-search" class="issue-link-search-label">
                 <h2 class="title-linked-items">${title}</h2>
               </label>
             </div>
             <div>${error}</div>
           </div>`
        : `<div class="issue-tooltip-div1">
             <div class="issue-tooltip-linked-items-label">
               <label for="issue-link-search" class="issue-link-search-label">
                 <h2 class="title-linked-items">${title}</h2>
               </label>
               <div role="presentation">
                <a href="${BY_URL}" target="_blank" class="img-link" rel="noopener noreferrer">
                  <span role="img" class="span-logo logo16" title="${BY}"></span>
                </a>
               </div>
             </div>
             <div>${groupedLinksHtml}</div>
           </div>`;

      if (tooltipManager.tooltip) {
        tooltipManager.tooltip.querySelector('.tooltip-content-container').innerHTML = tooltipContent;
        tooltipManager.tooltip.style.display = 'block';
        tooltipManager.adjustPosition(event);
      }
    } catch (err) {
      console.error('Error handling tooltip:', err);
      if (tooltipManager.tooltip) {
        tooltipManager.tooltip.querySelector('.tooltip-content-container').innerHTML = `<p>Error: ${err.message}</p>`;
        tooltipManager.tooltip.style.display = 'block';
        tooltipManager.adjustPosition(event);
      }
    }
  },

  addIconToCard(card) {
    const issueKey = this.getIssueKeyFromCard(card);
    if (!issueKey) return;

    const footer = card.querySelector(Utils.getSelector('cardFooter'));
    if (footer && !footer.querySelector('.linked-issues-iconLink')) {
      const iconLink = Utils.createElement('span', {
        className: 'linked-issues-iconLink',
        dataset: { issueLink: issueKey }
      });

      iconLink.addEventListener('mouseover', (event) => this.handleIconMouseOver(event, iconLink, issueKey));
      iconLink.addEventListener('mouseout', () => {
        setTimeout(() => {
          if (tooltipManager.tooltip && !tooltipManager.tooltip.matches(':hover') && !iconLink.matches(':hover')) {
            tooltipManager.destroy();
          }
        }, 1000);
      });

      if (tooltipManager.tooltip) {
        tooltipManager.tooltip.addEventListener('mouseout', () => {
          tooltipManager.destroy();
        });
      }

      footer.appendChild(iconLink);
    }
  },

  checkAndAddIcons: Utils.debounce(function () {
    chrome.storage.sync.get(['viewLinkedTickets'], (result) => {
      if (result.viewLinkedTickets !== false) {
        const board = document.querySelector(Utils.getSelector('board'));
        if (board) {
          const cards = board.querySelectorAll(Utils.getSelector('card'));
          cards.forEach(card => this.addIconToCard(card));
          state.currentProjectKey = Utils.getProjectKeyFromURL();
        }
      }
    });
  }, 300),

  handleDocumentClick(event) {
    if (tooltipManager.tooltip) {
      const target = event.target;
      const iconLink = document.querySelector(`[data-issue-link="${tooltipManager.tooltip.dataset.issueLink}"]`);

      if (tooltipManager.tooltip && !tooltipManager.tooltip.contains(target) && !iconLink?.contains(target)) {
        tooltipManager.destroy();
      }
    }
  }
};

// Main Application
const JiraExpandExtension = {
  init() {
    this.checkAndAddButtons();
    this.setupMutationObserver();
    this.loadSettings();
  },

  loadSettings() {
    chrome.storage.sync.get([
      'collapseRightPanel',
      'expandCreateModal',
      'viewLinkedTickets'
    ], (settings) => {
      state.settings = {
        collapseRightPanel: settings.collapseRightPanel !== false,
        expandCreateModal: settings.expandCreateModal !== false,
        viewLinkedTickets: settings.viewLinkedTickets !== false
      };
      this.checkAndAddButtons();
    });
  },

  checkAndAddButtons() {
    if (document.body.id === 'jira') {
      state.jiraType = Utils.getJiraType();

      if (state.settings.collapseRightPanel) {
        CollapsePanel.init();
      }
      if (state.settings.expandCreateModal) {
        ExpandModal.init();
      }
      if (state.settings.viewLinkedTickets) {
        LinkedIssues.init();
      }
    }
  },

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      if (mutations.some(m => m.addedNodes.length > 0)) {
        this.checkAndAddButtons();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
};

// Initialize the extension
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => JiraExpandExtension.init());
} else {
  JiraExpandExtension.init();
}
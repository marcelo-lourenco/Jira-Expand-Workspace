let isCloud = false;

const BY = 'By Jira Expand Extension';
const BY_URL = 'https://chromewebstore.google.com/detail/occanfpdiglllenbekgbnhijeoincilf';

function getJiraType() {
  if (document.getElementById('jira-frontend')) {
    return true;
  } else if (document.getElementById('page')) {
    return false;
  }
}

// Function to add the 'icon-collapse' class to the span element
function addIconCollapse(spanCollapseOpen) {
  spanCollapseOpen.classList.remove('icon-open');
  spanCollapseOpen.classList.add('icon-collapse');
}

// Function to add the 'icon-open' class to the span element
function addIconOpen(spanCollapseOpen) {
  spanCollapseOpen.classList.remove('icon-collapse');
  spanCollapseOpen.classList.add('icon-open');
}

// Function to add the 'icon-shrink' class to the span element
function addIconShrink(spanShrinkExpand) {
  spanShrinkExpand.classList.remove('icon-expand');
  spanShrinkExpand.classList.add('icon-shrink');
  if (!isCloud) {
    Object.assign(spanShrinkExpand.style, {
      margin: '0px -10px -5px 10px',
    });
  }
}

// Function to add the 'icon-expand' class to the span element
function addIconExpand(spanShrinkExpand) {
  spanShrinkExpand.classList.remove('icon-shrink');
  spanShrinkExpand.classList.add('icon-expand');
  if (!isCloud) {
    Object.assign(spanShrinkExpand.style, {
      margin: '0px -10px -5px 10px',
    });
  }
}

// If the modal dialog exists, expand it
function expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner) {
  if (modalIssueDetailsDialog) {
    modalIssueDetailsDialog.style.width = isCloud ? '100%' : '';
    Object.assign(modalIssueDetailsDialogPositioner.style, {
      maxWidth: "calc(-20px + 100vw)",
      maxHeight: "calc(-70px + 100vh)",
      insetBlockStart: "60px",
    });
  }
}

// Function to handle the collapse/open behavior of the right container
function fnCollapseLoad(containerRight, spanCollapseOpen, modalIssueDetailsDialog, modalIssueDetailsDialogPositioner) {
  expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);

  if (containerRight.style.display === 'none') {
    // If the container is hidden, show it and update the icon
    addIconCollapse(spanCollapseOpen);
    containerRight.style.display = 'block';

    expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
  } else {
    // If the container is visible, hide it and update the icon
    addIconCollapse(spanCollapseOpen);
    containerRight.style.display = isCloud ? 'block' : '';

    expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
  }
}

// Function to handle the collapse/open behavior of the right container
function fnCollapseOpen(containerRight, spanCollapseOpen, modalIssueDetailsDialog, modalIssueDetailsDialogPositioner) {
  if (containerRight.style.display === 'none') {
    // If the container is hidden, show it and update the icon
    addIconCollapse(spanCollapseOpen);
    containerRight.style.display = isCloud ? 'block' : '';

    expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
  } else {
    // If the container is visible, hide it and update the icon
    addIconOpen(spanCollapseOpen);
    containerRight.style.display = 'none';

    expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
  }
}

// Function to handle the shrink/expand behavior of the issue create modal
function fnShrinkExpand(modalIssueCreate, spanShrinkExpand, modalIssueCreatePositioner) {
  if (modalIssueCreate.style.width !== '100%') {
    // If the modal is not full width, expand it and update the icon
    addIconShrink(spanShrinkExpand);
    modalIssueCreate.style.width = '100%';

    if (isCloud) {
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
    // If the modal is full width, shrink it and update the icon
    addIconExpand(spanShrinkExpand);
    modalIssueCreate.style.width = '';
    if (isCloud) {
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
}

// Function to add the expand button to the issue create modal
function addExpandButton() {
  if (isCloud) {
    try {
      // Get the necessary elements
      const modalIssueCreatePositioner = document.querySelector(
        '[data-testid="issue-create.ui.modal.modal-wrapper.modal--positioner"]'
      );
      const modalIssueCreate = document.querySelector(
        '[data-testid="issue-create.ui.modal.modal-wrapper.modal"]'
      );
      const modalIcons = document.querySelector(
        '[data-testid="minimizable-modal.ui.modal-container.modal-header.view-changer-wrapper"]'
      );

      // If all elements are found and the button doesn't exist yet
      if (modalIssueCreate && modalIcons && !document.getElementById('span-shrink-expand')) {
        // Create the button element
        const spanShrinkExpand = document.createElement('span');
        spanShrinkExpand.id = 'span-shrink-expand';
        spanShrinkExpand.title = BY;
        addIconExpand(spanShrinkExpand);

        // Start the modal in expanded state
        fnShrinkExpand(modalIssueCreate, spanShrinkExpand, modalIssueCreatePositioner);

        // Add click event listener to the button
        spanShrinkExpand.addEventListener('click', function () {
          fnShrinkExpand(modalIssueCreate, spanShrinkExpand, modalIssueCreatePositioner);
        });

        // Append the button to the modal icons container
        modalIcons.appendChild(spanShrinkExpand);
      }
    } catch (error) {
      console.error('Error adding expand button:', error);
    }
  } else {
    try {
      // Get the necessary elements
      const modalIssueCreatePositioner = document.querySelector('#create-issue-dialog'); // Modal de criação de issue
      console.log('modalIssueCreatePositioner', modalIssueCreatePositioner);
      const modalIssueCreate = document.querySelector('.jira-dialog-core-heading'); // Padrão de modais no Jira Data Center
      console.log('modalIssueCreate', modalIssueCreate);

      /* aui-dialog2-header aui-toolbar2*/
      /* .jira-dialog-core-heading .qf-form-operations .aui-toolbar2-inner .aui-toolbar2-secondary*/

      const modalIcons = document.querySelector('.qf-form-operations'); // Cabeçalho do modal que pode conter ícones
      console.log('modalIcons', modalIcons);

      // If all elements are found and the button doesn't exist yet
      if (modalIssueCreate && modalIcons && !document.getElementById('span-shrink-expand')) {
        Object.assign(modalIcons.style, {
          display: 'flex',
        });
        // Create the button element
        const spanShrinkExpand = document.createElement('span');
        spanShrinkExpand.id = 'span-shrink-expand';
        spanShrinkExpand.title = BY;
        addIconExpand(spanShrinkExpand);

        // Start the modal in expanded state
        fnShrinkExpand(modalIssueCreate, spanShrinkExpand, modalIssueCreatePositioner);

        // Add click event listener to the button
        spanShrinkExpand.addEventListener('click', function () {
          fnShrinkExpand(modalIssueCreate, spanShrinkExpand, modalIssueCreatePositioner);
        });

        // Append the button to the modal icons container
        modalIcons.appendChild(spanShrinkExpand);
      }
    } catch (error) {
      console.error('Error adding expand button:', error);
    }
  }
}

// Function to add the collapse button to the issue details container
function addCollapseButton() {
  if (isCloud) {
    try {
      // Get the necessary elements
      const containerRight = document.querySelector(
        '[data-testid="issue.views.issue-details.issue-layout.container-right"]'
      );
      const resizerElement = document.querySelector('[data-testid="flex-resizer.ui.handle.resizer"]');

      // If all elements are found and the button doesn't exist yet
      if (containerRight && resizerElement && !document.getElementById('span-collapse-open')) {
        // Add a class to the resizer element
        //resizerElement.classList.add('resizer-width');
        resizerElement.style.width = '32px';

        // Create the button element
        const spanCollapseOpen = document.createElement('span');
        spanCollapseOpen.id = 'span-collapse-open';
        spanCollapseOpen.classList.add('icon-collapse');
        spanCollapseOpen.title = BY;

        // Get the modal dialog elements
        const modalIssueDetailsDialogPositioner = document.querySelector(
          '[data-testid="issue.views.issue-details.issue-modal.modal-dialog--positioner"]'
        );
        const modalIssueDetailsDialog = document.querySelector(
          '[data-testid="issue.views.issue-details.issue-modal.modal-dialog"]'
        );

        // Start the container in maximized state
        fnCollapseLoad(containerRight, spanCollapseOpen, modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);

        // Add click event listener to the button
        spanCollapseOpen.addEventListener('click', function () {
          fnCollapseOpen(containerRight, spanCollapseOpen, modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
        });

        // Append the button to the resizer element
        resizerElement.appendChild(spanCollapseOpen);
      }
    } catch (error) {
      console.error('Error adding collapse button:', error);
    }
  } else {
    try {
      const containerRight = document.querySelector('.issue-side-column');
      const resizerElement = document.querySelector('.aui-toolbar2-secondary'); // Elemento de redimensionamento (se houver)]

      // If all elements are found and the button doesn't exist yet
      if (containerRight && resizerElement && !document.getElementById('span-collapse-open')) {
        // Create the button element
        const spanCollapseOpen = document.createElement('span');
        spanCollapseOpen.id = 'span-collapse-open';
        spanCollapseOpen.classList.add('icon-collapse');

        // Get the modal dialog elements
        const modalIssueDetailsDialogPositioner = document.querySelector('#viewissuesidebar'); // Verifica se o modal de detalhes de issue existe
        const modalIssueDetailsDialog = document.querySelector('#viewissuesidebar'); // Estrutura de modais no Jira Data Centerl.modal-dialog"]');

        // Start the container in maximized state
        fnCollapseLoad(containerRight, spanCollapseOpen, modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);

        // Add click event listener to the button
        spanCollapseOpen.addEventListener('click', function () {
          fnCollapseOpen(containerRight, spanCollapseOpen, modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
        });

        // Append the button to the resizer element
        resizerElement.appendChild(spanCollapseOpen);
      }
    } catch (error) {
      console.error('Error adding collapse button:', error);
    }
  }
}

// Function to check if the necessary elements exist and add the buttons
function checkAndAddButtons() {
  if (document.body.id === 'jira') {
    isCloud = getJiraType();
    addExpandButton();
    addCollapseButton();
  } else {
    return;
  }
}

// Add buttons when the page loads or when the route changes in Jira
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkAndAddButtons);
} else {
  checkAndAddButtons();
}

// Observe for DOM changes and add buttons if necessary
const observer = new MutationObserver(checkAndAddButtons);
observer.observe(document.body, { childList: true, subtree: true });







// ---------------------------------------------------------------------------- //
// Mostrar Ícones vinculados ao card
// ---------------------------------------------------------------------------- //

// ---------------------------------------------------------------------------- //
// Constants and Global Variables
// ---------------------------------------------------------------------------- //
const API_ISSUE_BASE_URL = '/rest/api/3/issue/';
const CLASS_LINKED_ISSUES_ICON = 'linked-issues-icon';
const CLASS_LINKED_ISSUES_ICON_LINK = 'linked-issues-iconLink';
const CLASS_TOOLTIP = 'tooltip-style';
const SELECTOR_BOARD = '[data-testid="platform-board-kit.ui.board.scroll.board-scroll"]';
const SELECTOR_CARD = '[data-testid="platform-board-kit.ui.card.card"]';
const SELECTOR_CARD_FOOTER = '[data-testid="platform-card.ui.card.card-content.footer"]';
const SELECTOR_ISSUE_KEY = '[data-testid="platform-card.common.ui.key.key"] a';
const SPACE = 10;
const TOOLTIP_DELAY = 1000;
const BOARD_CHECK_INTERVAL = 1500;

// Status colors mapping
const STATUS_COLORS = {
  new: { color: 'status-color-new', bgColor: 'status-bg-color-new' },
  indeterminate: { color: 'status-color-indeterminate', bgColor: 'status-bg-color-indeterminate' },
  done: { color: 'status-color-done', bgColor: 'status-bg-color-done' },
  other: { color: 'status-color-other', bgColor: 'status-bg-color-other' },
};

let activeTooltip = null;
let currentProjectKey = null;


// ---------------------------------------------------------------------------- //
// Utility Functions
// ---------------------------------------------------------------------------- //

/**
 * Extracts the project key from the URL.
 * @returns {string|null} The project key or null if not found.
 */
function getProjectKeyFromURL() {
  const match = window.location.pathname.match(/\/projects\/([A-Z]+)\/board/);
  return match ? match[1] : null;
}

// ---------------------------------------------------------------------------- //
// Tooltip Management
// ---------------------------------------------------------------------------- //

/**
 * Creates a tooltip element with given content.
 * @param {string} content - HTML content for the tooltip.
 * @returns {HTMLElement} The tooltip element.
 */
function createTooltip(content) {
  const tooltip = document.createElement('div');
  tooltip.classList.add(CLASS_TOOLTIP);
  tooltip.innerHTML = content;
  document.body.appendChild(tooltip);
  return tooltip;
}


/**
 * Destroys the provided tooltip after a delay.
 * @param {HTMLElement} tooltip - The tooltip to destroy.
 */
function destroyTooltip(tooltip) {
  if (!tooltip) return;

  setTimeout(() => {
    if (document.body.contains(tooltip)) {
      delete tooltip.tooltipX;
      delete tooltip.tooltipY;
      document.body.removeChild(tooltip);
      activeTooltip = null;
    }
  }, TOOLTIP_DELAY);
}


/**
 * Adjusts the tooltip position to stay within the viewport.
 * @param {MouseEvent} event - The mouse event.
 * @param {HTMLElement} tooltip - The tooltip element.
 */
function adjustTooltipPosition(event, tooltip) {
  if (!tooltip) return;

  const { pageX, pageY } = event;
  const tooltipRect = tooltip.getBoundingClientRect();

  let left = tooltip.tooltipX || pageX + SPACE;
  let top = tooltip.tooltipY || pageY + SPACE;

  // Adjust horizontal position
  if (left + tooltipRect.width > window.innerWidth) {
    left = (tooltip.tooltipX || pageX) - tooltipRect.width - SPACE;
  }

  // Adjust vertical position
  if (top + tooltipRect.height > window.innerHeight) {
    top = (tooltip.tooltipY || pageY) - tooltipRect.height - SPACE;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

// ---------------------------------------------------------------------------- //
// Issue Key and Data Fetching
// ---------------------------------------------------------------------------- //

/**
 * Extracts the issue key from a card element.
 * @param {HTMLElement} cardElement - The card element.
 * @returns {string|null} The issue key or null if not found.
 */
function getIssueKeyFromCard(cardElement) {
  const issueKeyElement = cardElement.querySelector(SELECTOR_ISSUE_KEY);
  return issueKeyElement ? issueKeyElement.textContent.trim() : null;
}

/**
 * Fetches assignee details for a given issue.
 * @param {string} linkedIssueSelf - The 'self' URL of the linked issue.
 * @returns {Promise<object>} Promise with assignee data or error.
 */
async function fetchAssigneeDetails(linkedIssueSelf) {
  try {
    const response = await fetch(linkedIssueSelf);
    if (!response.ok) {
      throw new Error(`Error fetching issue details. Status: ${response.status}`);
    }
    const issueData = await response.json();
    return issueData.fields.assignee;
  } catch (error) {
    console.error('Error fetching issue details:', error);
    throw error;
  }
}

/**
 * Generates HTML for a linked issue.
 * @param {object} linkedIssue - The linked issue data.
 * @param {string} relationship - The relationship type.
 * @returns {Promise<string>} Promise with the generated HTML or error message.
 */
async function generateLinkedIssueHTML(linkedIssue, relationship) {
  try {
    const assignee = await fetchAssigneeDetails(linkedIssue.self);
    const assigneeAvatarUrl = assignee?.avatarUrls?.['16x16'] || '';
    const assigneeDisplayName = assignee?.displayName || '';

    const { key: statusCategory } = linkedIssue.fields.status.statusCategory;
    const status = linkedIssue.fields.status.name.toLowerCase();
    const { iconUrl, name: issueTypeName } = linkedIssue.fields.issuetype;

    const { color: statusColor, bgColor: statusBgColor } = STATUS_COLORS[statusCategory] || STATUS_COLORS.other;

    return `<div role="listitem" class="list-item bg-color-neutral-subtle-hovered text-decoration-color-initial text-decoration-line-none text-decoration-style-solid bg-color-neutral-subtle-pressed">
                    <div data-testid="issue-line-card.card-container" class="issue-line-card-container">
                    <div data-testid="issue-line-card.issue-type.tooltip--container" role="presentation">
                        <div data-testid="issue-line-card-issue-type.issue-type" class="issue-line-issue-type">
                        <div class="issue-line-issue-type-grid">
                            <img src="${iconUrl}" alt="${issueTypeName}" title="${issueTypeName}" class="issue-line-issue-type-img" draggable="false" >
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
                        <div data-testid="issue-line-card.ui.assignee.read-only-assignee" role="img"  class="issue-line-card-read-only-assignee-inner">
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
}


/**
 * Fetches linked issues for a given issue key and groups them by relationship type.
 * @param {string} issueKey - The key of the issue.
 * @returns {Promise<object>} Promise with HTML for grouped links or error message.
 */
async function fetchLinkedIssues(issueKey) {
  try {
    const apiUrl = `${API_ISSUE_BASE_URL}${issueKey}?fields=issuelinks`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error fetching issue links. Status: ${response.status}`);
    }

    const data = await response.json();
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
        groupedLinks[relationship].push(await generateLinkedIssueHTML(linkedIssue, relationship));
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
}


// ---------------------------------------------------------------------------- //
// Tooltip Position and Event Handling
// ---------------------------------------------------------------------------- //

/**
 * Handles mouseover event on the icon, fetches linked issues, and shows the tooltip.
 * @param {MouseEvent} event - The mouse event.
 * @param {HTMLElement} iconLink - The icon that triggered the event.
 * @param {string} issueKey - The issue key for which to fetch linked issues.
 */
async function handleIconMouseOver(event, iconLink, issueKey) {
  if (!activeTooltip) {
    activeTooltip = createTooltip('');
    activeTooltip.tooltipX = event.pageX;
    activeTooltip.tooltipY = event.pageY;
  }

  try {
    const { groupedLinksHtml, error, title } = await fetchLinkedIssues(issueKey);
    const titleElement = activeTooltip.querySelector('.title-linked-items');
    if (titleElement) {
      titleElement.textContent = title;
    }

    activeTooltip.innerHTML = error
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
    activeTooltip.style.display = 'block';
    adjustTooltipPosition(event, activeTooltip);
  } catch (err) {
    console.error('Error handling tooltip:', err);
    if (activeTooltip) {
      activeTooltip.innerHTML = `<p>Error: ${err.message}</p>`;
      activeTooltip.style.display = 'block';
      adjustTooltipPosition(event, activeTooltip);
    }
  }
}


/**
 * Adds a linked issues icon to a card, including event listeners.
 * @param {HTMLElement} card - The card element.
 */
function addIconToCard(card) {
  const issueKey = getIssueKeyFromCard(card);
  if (!issueKey) return;

  const footer = card.querySelector(SELECTOR_CARD_FOOTER);
  if (footer && !footer.querySelector(`.${CLASS_LINKED_ISSUES_ICON_LINK}`)) {
    const iconLink = document.createElement('span');
    iconLink.className = CLASS_LINKED_ISSUES_ICON_LINK;
    iconLink.dataset.issueLink = issueKey;

    iconLink.addEventListener('mouseover', (event) => handleIconMouseOver(event, iconLink, issueKey));
    iconLink.addEventListener('mouseout', () => {
      setTimeout(() => {
        if (activeTooltip && !activeTooltip.matches(':hover') && !iconLink.matches(':hover')) {
          destroyTooltip(activeTooltip);
        }
      }, TOOLTIP_DELAY);
    });

    if (activeTooltip) {
      activeTooltip.addEventListener('mouseout', () => {
        destroyTooltip(activeTooltip);
        delete activeTooltip.tooltipX;
        delete activeTooltip.tooltipY;
      });
    }
    footer.appendChild(iconLink);
  }
}

// ---------------------------------------------------------------------------- //
// Board Detection and Icon Addition
// ---------------------------------------------------------------------------- //

/**
 * Checks if the current page is a Jira board and adds the icons if they don't exist.
 */
function checkAndAddIcons() {
  const board = document.querySelector(SELECTOR_BOARD);
  if (board) {
    const cards = board.querySelectorAll(SELECTOR_CARD);
    cards.forEach(card => addIconToCard(card));
    currentProjectKey = getProjectKeyFromURL();
    // console.log(`Icons added/verified for project: ${currentProjectKey}`);
  } else {
    currentProjectKey = getProjectKeyFromURL();
    // console.log(`Not a board, Waiting for board for project: ${currentProjectKey}`);
  }
}

// ---------------------------------------------------------------------------- //
// Global Click Handler
// ---------------------------------------------------------------------------- //

/**
 * Handles clicks on the document. If the click is outside the tooltip and the icon
 * that triggered it, destroy the tooltip.
 * @param {MouseEvent} event - The mouse event.
 */
function handleDocumentClick(event) {
  if (activeTooltip) {
    const target = event.target;
    const iconLink = document.querySelector(`[data-issue-link="${activeTooltip.dataset.issueLink}"]`);

    if (activeTooltip && !activeTooltip.contains(target) && !iconLink?.contains(target)) {
      destroyTooltip(activeTooltip);
      delete activeTooltip.tooltipX;
      delete activeTooltip.tooltipY;
    }
  }
}
// ---------------------------------------------------------------------------- //
// Initialization
// ---------------------------------------------------------------------------- //
setInterval(checkAndAddIcons, BOARD_CHECK_INTERVAL);
checkAndAddIcons();
document.addEventListener('click', handleDocumentClick);
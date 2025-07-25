import { state } from '../state.js';
import { Utils } from '../utils.js';
import { tooltipManager } from '../tooltipManager.js';
import { STATUS_COLORS, BY, BY_URL, JiraType } from '../constants.js'; // Added JiraType

export const LinkedIssues = {
  mouseOverTimeout: null,

  init() {
    this.checkAndAddIcons();
    // Consider if MutationObserver makes this interval redundant or less frequent.
    setInterval(() => this.checkAndAddIcons(), 1500);
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  },

  async fetchAssigneeDetails(linkedIssueSelf) {
    try {
      const issueData = await Utils.fetchWithRetry(linkedIssueSelf);
      return issueData.fields.assignee;
    } catch (error) {
      // console.error('Jira Expand Extension: Error fetching assignee details:', error);
      throw error; // Re-throw to be handled by caller
    }
  },

  async generateLinkedIssueHTML(linkedIssue, relationship) {
    try {
      const assignee = await this.fetchAssigneeDetails(linkedIssue.self);
      const assigneeAvatarUrl = assignee?.avatarUrls?.['16x16'] || '';
      const assigneeDisplayName = assignee?.displayName || 'Unassigned';

      const statusCategoryKey = linkedIssue.fields.status?.statusCategory?.key || 'other';
      const statusName = linkedIssue.fields.status?.name?.toLowerCase() || 'unknown';
      const issueTypeData = linkedIssue.fields.issuetype || { iconUrl: '', name: 'Unknown Type' };
      const { iconUrl, name: issueTypeName } = issueTypeData;

      const { color: statusColor, bgColor: statusBgColor } = STATUS_COLORS[statusCategoryKey] || STATUS_COLORS.other;

      const summary = linkedIssue.fields.summary ? String(linkedIssue.fields.summary).replace(/</g, "&lt;").replace(/>/g, "&gt;") : 'No summary';
      const issueKey = linkedIssue.key;

      return `
        <div role="listitem" class="ewj-list-item ewj-bg-color-neutral-subtle-hovered ewj-text-decoration-color-initial ewj-text-decoration-line-none ewj-text-decoration-style-solid ewj-bg-color-neutral-subtle-pressed">
          <div data-testid="issue-line-card.card-container" class="ewj-issue-line-card-container">
            <div data-testid="issue-line-card.issue-type.tooltip--container" role="presentation">
              <div data-testid="issue-line-card-issue-type.issue-type" class="ewj-issue-line-issue-type">
                <div class="ewj-issue-line-issue-type-grid">
                  <img src="${iconUrl}" alt="${issueTypeName}" title="${issueTypeName} (${relationship})" class="ewj-issue-line-issue-type-img" draggable="false">
                </div>
              </div>
            </div>
            <span><span data-testid="hover-card-trigger-wrapper"><a data-testid="issue.issue-view.views.common.issue-line-card.issue-line-card-view.key" href="/browse/${issueKey}" target="_blank" class="ewj-issue-line-card-view-key" aria-label="${issueKey} ${statusName}" role="link" draggable="false">${issueKey}</a></span></span>
            <div data-testid="issue.issue-view.views.common.issue-line-card.issue-line-card-view.summary" class="ewj-issue-line-card-view-summary"><span><span data-testid="hover-card-trigger-wrapper"><a data-testid="issue-field-summary.ui.inline-read.link-item" href="/browse/${issueKey}" target="_blank" class="ewj-issue-line-card-view-summary-a" data-is-router-link="false" data-vc="link-item" tabindex="0" draggable="false" aria-disabled="false"><span class="ewj-issue-line-card-view-summary-span" data-testid="issue-field-summary.ui.inline-read.link-item--primitive--container"><div class="ewj-issue-line-card-view-summary-div"><span class="ewj-linkedIssue-fields-summary" data-item-title="true">${summary}</span></div></span></a></span></span></div>
            <div role="presentation"><div data-testid="issue-line-card.ui.assignee.read-only-assignee" role="img" class="ewj-issue-line-card-read-only-assignee-inner" title="Assignee: ${assigneeDisplayName}"><span data-testid="issue-line-card.ui.assignee.read-only-assignee--inner" class="ewj-issue-line-card-assignee-inner">${assigneeAvatarUrl ? `<img src="${assigneeAvatarUrl}" alt="${assigneeDisplayName}" title="${assigneeDisplayName}" class="ewj-issue-line-card-assignee-image">` : '<span class="assignee-placeholder" title="Unassigned"></span>'}</span></div></div>
            <div data-testid="issue-line-card.ui.status.status-field-container" class="ewj-issue-line-card-status-field-container"><div role="presentation"><div><div><button aria-label="${statusName}" aria-expanded="false" class="ewj-issue-line-card-view-button-status" tabindex="0" type="button"><span class="ewj-issue-line-card-view-button-span"><span class="ewj-issue-line-card-view-button-span2"><div data-testid="issue.fields.status.common.ui.status-lozenge.3" class="ewj-issue-fields-status-lozenge"><span class="ewj-issue-line-card-view-button-span3 ${statusBgColor}"><span class="ewj-issue-line-card-view-button-span4"><div class="ewj-issue-line-card-view-button-status-color ${statusColor}">${statusName}</div></span></span></div></span></span></button></div></div></div></div>
          </div>
        </div>`;
    } catch (error) {
      // console.error('Jira Expand Extension: Error generating linked ticket HTML for', linkedIssue?.key, error);
      return `<p>Error displaying details for ${linkedIssue?.key || 'a linked ticket'}.</p>`;
    }
  },

  async fetchLinkedIssues(issueKey) {
    try {
      // Use /rest/api/latest/ for broader compatibility if unsure about /3/
      const apiPath = state.jiraType === JiraType.CLOUD ? '/rest/api/3/issue/' : '/rest/api/latest/issue/';
      const apiUrl = `${apiPath}${issueKey}?fields=issuelinks,status,summary,issuetype,assignee`; // Fetch all needed fields at once if possible
      const data = await Utils.fetchWithRetry(apiUrl);
      const linkedIssuesData = data.fields.issuelinks || [];

      if (linkedIssuesData.length === 0) {
        return { groupedLinksHtml: '<p>No linked tickets.</p>', title: 'Linked Tickets' };
      }

      const groupedLinks = {};
      const promises = linkedIssuesData.map(async (link) => {
        const linkedIssueDetails = link.inwardIssue || link.outwardIssue;
        const relationship = link.type.inward || link.type.outward;

        if (linkedIssueDetails && linkedIssueDetails.fields) { // Ensure fields are present
          const html = await this.generateLinkedIssueHTML(linkedIssueDetails, relationship);
          return { relationship, html };
        }
        return null;
      });

      const results = (await Promise.all(promises)).filter(r => r !== null);

      results.forEach(result => {
        if (!groupedLinks[result.relationship]) groupedLinks[result.relationship] = [];
        groupedLinks[result.relationship].push(result.html);
      });

      let groupedLinksHtml = '';
      if (Object.keys(groupedLinks).length === 0 && linkedIssuesData.length > 0) {
        groupedLinksHtml = '<p>Could not display linked tickets due to errors in fetching details.</p>';
      } else {
        for (const relationship in groupedLinks) {
          groupedLinksHtml += `
            <div data-testid="issue.views.issue-base.content.issue-links.group-container" class="ewj-issue-links-group-container">
              <h3 class="ewj-issue-links-group-container-h3"><span data-testid="issue.issue-view.views.issue-base.content.issue-links.issue-links-view.relationship-heading">${relationship}</span></h3>
              <div class="ewj-margin-top-8"><ul class="ewj-ul-card-container">${groupedLinks[relationship].join('')}</ul></div>
            </div>`;
        }
      }
      return { groupedLinksHtml, title: 'Linked Tickets' };
    } catch (error) {
      // console.error('Jira Expand Extension: Error fetching linked tickets for', issueKey, error);
      return { error: `<p>Error fetching linked tickets: ${error.message}</p>`, title: 'Error' };
    }
  },

  getIssueKeyFromCard(cardElement) {
    const issueKeySelector = Utils.getSelector('issueKey');
    if (!issueKeySelector) return null;
    const issueKeyElement = cardElement.querySelector(issueKeySelector);
    return issueKeyElement ? issueKeyElement.textContent.trim() : null;
  },

  async handleIconMouseOver(event, iconLink, issueKey) {
    if (!tooltipManager.tooltip) {
      tooltipManager.create('<p class="tooltip-loading">Loading linked tickets...</p>');
    } else {
      tooltipManager.tooltip.querySelector('.ewj-tooltip-content-container').innerHTML = '<p class="tooltip-loading">Loading linked tickets...</p>';
    }
    if (tooltipManager.tooltip) {
      tooltipManager.tooltip.style.display = 'block';
      tooltipManager.adjustPosition(event);
    }

    try {
      const { groupedLinksHtml, error, title } = await this.fetchLinkedIssues(issueKey);
      if (!tooltipManager.tooltip) return; // Tooltip might have been destroyed

      const tooltipContent = error
        ? `<div class="ewj-issue-tooltip-div1"><div class="ewj-issue-tooltip-linked-items-label"><label class="ewj-issue-link-search-label"><h2 class="ewj-title-linked-items">${title}</h2></label></div><div>${error}</div></div>`
        : `<div class="ewj-issue-tooltip-div1"><div class="ewj-issue-tooltip-linked-items-label"><label class="ewj-issue-link-search-label"><h2 class="ewj-title-linked-items">${title}</h2></label><div role="presentation"><a href="${BY_URL}" target="_blank" class="ewj-img-link" rel="noopener noreferrer"><span role="img" class="ewj-span-logo ewj-logo16" title="${BY}"></span></a></div></div><div>${groupedLinksHtml}</div></div>`;

      tooltipManager.tooltip.querySelector('.ewj-tooltip-content-container').innerHTML = tooltipContent;
      tooltipManager.adjustPosition(event);
    } catch (err) {
      // console.error('Jira Expand Extension: Error handling tooltip for', issueKey, err);
      if (tooltipManager.tooltip) {
        tooltipManager.tooltip.querySelector('.ewj-tooltip-content-container').innerHTML = `<p>Error: ${err.message}</p>`;
        tooltipManager.adjustPosition(event);
      }
    }
  },

  addIconToCard(card) {
    const issueKey = this.getIssueKeyFromCard(card);
    if (!issueKey) return;

    const cardFooterSelector = Utils.getSelector('cardFooter');
    if (!cardFooterSelector) return;
    const footer = card.querySelector(cardFooterSelector);

    if (footer && !footer.querySelector('.ewj-linked-issues-iconLink')) {
      const iconLink = Utils.createElement('span', {
        className: 'ewj-linked-issues-iconLink',
        //title: `View linked tickets for ${issueKey} (${BY})`,
        dataset: { issueLinkKey: issueKey }
      });

      iconLink.addEventListener('mouseover', (event) => {
        clearTimeout(this.mouseOverTimeout);
        this.mouseOverTimeout = setTimeout(() => {
          this.handleIconMouseOver(event, iconLink, issueKey);
        }, 200);
      });

      const hideTooltip = () => {
        setTimeout(() => {
          if (tooltipManager.tooltip && !tooltipManager.tooltip.matches(':hover') && !iconLink.matches(':hover')) {
            tooltipManager.destroy();
          }
        }, 300);
      };

      iconLink.addEventListener('mouseout', () => {
        clearTimeout(this.mouseOverTimeout);
        hideTooltip();
      });

      // Add mouseleave to tooltip itself to hide it
      // This listener should be added when the tooltip is created and shown.
      // For simplicity, we can rely on document click or mouseout from icon.
      // A more robust way is to add it when tooltip is populated.
      // However, the current logic with handleDocumentClick and iconLink mouseout should cover most cases.

      footer.appendChild(iconLink);
    }
  },

  checkAndAddIconsInternal() {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['viewLinkedTickets'], (result) => {
        if (result.viewLinkedTickets !== false) {
          const boardSelector = Utils.getSelector('board');
          if (!boardSelector) return;
          const board = document.querySelector(boardSelector);
          if (board) {
            const cardSelector = Utils.getSelector('card');
            if (!cardSelector) return;
            const cards = board.querySelectorAll(cardSelector);
            cards.forEach(card => this.addIconToCard(card));
            state.currentProjectKey = Utils.getProjectKeyFromURL();
          }
        }
      });
    } else {
      // console.warn("Jira Expand Extension: chrome.storage.local not available. Linked tickets icons may not work as expected.");
      // Fallback: assume true if storage is not available
      const boardSelector = Utils.getSelector('board');
      if (!boardSelector) return;
      const board = document.querySelector(boardSelector);
      if (board) {
        const cardSelector = Utils.getSelector('card');
        if (!cardSelector) return;
        const cards = board.querySelectorAll(cardSelector);
        cards.forEach(card => this.addIconToCard(card));
        state.currentProjectKey = Utils.getProjectKeyFromURL();
      }
    }
  },

  checkAndAddIcons: Utils.debounce(function () { LinkedIssues.checkAndAddIconsInternal(); }, 300),

  handleDocumentClick(event) {
    if (tooltipManager.tooltip) {
      const target = event.target;
      const isIconLink = target.closest('.ewj-linked-issues-iconLink');
      if (!tooltipManager.tooltip.contains(target) && !isIconLink) {
        tooltipManager.destroy();
      }
    }
  }
};

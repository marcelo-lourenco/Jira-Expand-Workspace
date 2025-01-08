let isCloud = false;

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



//----------------------------------------------------------------------------//
// Mostrar Ícones vinculados ao card
// Defina os estilos do tooltip em uma variável
const tooltipStyle = `
  position: absolute;
  z-index: 1000;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #333;
  max-width: 700px;
  display: none; /* Inicialmente oculto */
`;

let currentTooltip = null;

function createTooltip(content) {
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip-style');
  tooltip.innerHTML = `
    <div class="issue-tooltip-div1">
      <div class="issue-tooltip-linked-items-label">
        <label for="issue-link-search" class="issue-link-search-label">
          <h2 class="title-linked-items">Linked items</h2>
        </label>
      </div>
    </div>
    <div>${content}</div>
    `;
  document.body.appendChild(tooltip);
  return tooltip;
}


function destroyTooltip(tooltip) {
  setTimeout(() => {
    if (tooltip && document.body.contains(tooltip)) {
      delete tooltip.tooltipX;
      delete tooltip.tooltipY;
      document.body.removeChild(tooltip);
      currentTooltip = null;
    }
  }, 1000);
}

// Obtém a chave da issue de um card
function getIssueKeyFromCard(cardElement) {
  const issueKeyElement = cardElement.querySelector('[data-testid="platform-card.common.ui.key.key"] a');

  if (issueKeyElement) {
    return issueKeyElement.textContent.trim();
  }

  console.error("Não foi possível encontrar a chave da issue no card:", cardElement);
  return null;
}

// Busca detalhes do responsável por uma issue
function fetchAssigneeDetails(linkedIssueSelf, callback) {
  fetch(linkedIssueSelf)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro ao buscar os detalhes do issue. Status: ${response.status}`);
      }
      return response.json();
    })
    .then((issueData) => {
      const assignee = issueData.fields.assignee;
      callback(null, assignee);
    })
    .catch((error) => {
      console.error('Erro ao buscar os detalhes do issue:', error);
      callback(error, null);
    });
}

// Gera o HTML para um issue vinculado
function generateLinkedIssueHTML(linkedIssue, relationship, callback) {
  fetchAssigneeDetails(linkedIssue.self, (error, assignee) => {
    if (error) {
      callback(`<p>Erro ao buscar detalhes do assignee: ${error.message}</p>`);
      return;
    }

    const assigneeAvatarUrl = assignee?.avatarUrls?.['16x16'] || '';
    const assigneeDisplayName = assignee?.displayName || '';

    const statusCategory = linkedIssue.fields.status.statusCategory.key;
    const status = linkedIssue.fields.status.name.toLowerCase();
    const iconUrl = linkedIssue.fields.issuetype.iconUrl;
    const issueTypeName = linkedIssue.fields.issuetype.name;

    let statusColor = "";
    let statusBgColor = "";

    // Mapeamento das cores baseado na categoria do status
    if (statusCategory === 'new') {
      statusColor = 'status-color-new';
      statusBgColor = 'status-bg-color-new';
    } else if (statusCategory === 'indeterminate') {
      statusColor = 'status-color-indeterminate';
      statusBgColor = 'status-bg-color-indeterminate';
    } else if (statusCategory === 'done') {
      statusColor = 'status-color-done';
      statusBgColor = 'status-bg-color-done';
    } else {
      statusColor = 'status-color-other';
      statusBgColor = 'status-bg-color-other';
    }

    const html = `
      <div data-testid="issue.views.issue-base.content.issue-links.group-container" class="issue-links-group-container">
        <h3 class="issue-links-group-container-h3">
          <span data-testid="issue.issue-view.views.issue-base.content.issue-links.issue-links-view.relationship-heading">${relationship}</span>
        </h3>
        <div class="margin-top-8">
          <ul class="ul-card-container">
            <div role="listitem" class="list-item bg-color-neutral-subtle-hovered text-decoration-color-initial text-decoration-line-none text-decoration-style-solid bg-color-neutral-subtle-pressed">
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
          </ul>
        </div>
      </div>
      `;
    callback(html);
  });
}

// Busca os issues vinculados e monta os links no tooltip
function fetchLinkedIssues(issueKey, callback) {
  const apiUrl = `/rest/api/3/issue/${issueKey}?fields=issuelinks`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro ao obter links da issue. Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const linkedIssues = data.fields.issuelinks || [];
      let htmlLinks = '';
      let fetchedCount = 0;

      if (linkedIssues.length === 0) {
        callback('<p>Nenhum item vinculado.</p>', null, 'Linked items');
      } else {
        linkedIssues.forEach((link) => {
          const linkedIssue = link.inwardIssue || link.outwardIssue;
          const relationship = link.type.inward || link.type.outward;

          if (linkedIssue) {
            generateLinkedIssueHTML(linkedIssue, relationship, (html) => {
              htmlLinks += html;
              fetchedCount++;
              if (fetchedCount === linkedIssues.length) {
                callback(htmlLinks, null, 'Linked items');
              }
            });
          } else {
            fetchedCount++;
            if (fetchedCount === linkedIssues.length) {
              callback(htmlLinks, null, 'Linked items');
            }
          }
        });
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar os itens vinculados:', error);
      callback(null, `<p>Erro ao buscar os itens vinculados: ${error.message}</p>`, 'Erro');
    });
}

// Atualiza a posição do tooltip
function updateTooltipPosition(event, tooltip) {
  if (!tooltip) return;

  // Usa as coordenadas armazenadas se existirem, caso contrário, usa a posição do evento
  const { pageX, pageY } = event;
  const tooltipRect = tooltip.getBoundingClientRect();
  const space = 0;

  let left = tooltip.tooltipX || pageX + space;
  let top = tooltip.tooltipY || pageY + space;

  // Ajuste para evitar que o tooltip saia da tela
  if (left + tooltipRect.width > window.innerWidth) {
    left = (tooltip.tooltipX || pageX) - tooltipRect.width - space;
  }
  if (top + tooltipRect.height > window.innerHeight) {
    top = (tooltip.tooltipY || pageY) - tooltipRect.height - space;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}


// Adiciona o ícone ao card e configura os eventos do tooltip
function addIconToCard(card) {
  const issueKey = getIssueKeyFromCard(card);
  if (!issueKey) return;

  const footer = card.querySelector('[data-testid="platform-card.ui.card.card-content.footer"]');
  if (!footer) {
    console.error("Não foi possível encontrar o footer do card:", card);
    return;
  }

  if (footer.querySelector('.linked-issues-icon')) return;

  const iconLink = document.createElement('span');
  iconLink.className = 'linked-issues-iconLink';

  let tooltip;

  iconLink.addEventListener('mouseover', (event) => {
    if (!currentTooltip) {
      tooltip = createTooltip('');
      currentTooltip = tooltip;

      // Armazena a posição do mouse no momento em que o tooltip é criado
      currentTooltip.tooltipX = event.pageX;
      currentTooltip.tooltipY = event.pageY;
    } else {
      tooltip = currentTooltip;
    }


    fetchLinkedIssues(issueKey, (linksHtml, error, title) => {
      const titleElement = tooltip.querySelector('.title-linked-items');
      if (titleElement) {
        titleElement.textContent = title;
      }
      tooltip.innerHTML = error
        ? `<div class="issue-tooltip-div1">
            <div class="issue-tooltip-linked-items-label">
              <label for="issue-link-search" class="issue-link-search-label">
                <h2 class="title-linked-items">Error</h2>
              </label>
            </div>
            <div>${error}</div>
          </div>`
        : `<div class="issue-tooltip-div1">
            <div class="issue-tooltip-linked-items-label">
              <label for="issue-link-search" class="issue-link-search-label">
                <h2 class="title-linked-items">Linked items</h2>
              </label>
            </div>
            <div>${linksHtml}</div>
          </div>`;
      tooltip.style.display = 'block';
      updateTooltipPosition(event, tooltip);
    });
  });

  function delayedTooltipClose() {
    if (currentTooltip && !currentTooltip.matches(':hover') && !iconLink.matches(':hover')) {
      destroyTooltip(currentTooltip);
    }
  }

  //iconLink.addEventListener('mouseout', delayedTooltipClose);

  //iconLink.addEventListener('mousemove', (event) => {
  //  if (tooltip && tooltip.style.display === 'block') {
  //    updateTooltipPosition(event, tooltip);
  //  }
  //});

  iconLink.addEventListener('mouseout', () => {

    // Adicionado um timeout para que o mouseout do ícone não feche o tooltip se o mouse estiver sobre o tooltip
    setTimeout(() => {
      if (currentTooltip && !currentTooltip.matches(':hover') && !iconLink.matches(':hover')) {
        destroyTooltip(currentTooltip); // Usar currentTooltip aqui
        if (currentTooltip) {
          delete currentTooltip.tooltipX;
          delete currentTooltip.tooltipY;
        }
      }
    }, 1000);
  });

  if (currentTooltip) {
    currentTooltip.addEventListener('mouseout', () => {
      destroyTooltip(currentTooltip); // Usar currentTooltip aqui
      // Limpa as coordenadas armazenadas quando o tooltip é fechado
      delete currentTooltip.tooltipX;
      delete currentTooltip.tooltipY;
    });
  }

  /*
    if (currentTooltip) {
      currentTooltip.addEventListener('mouseleave', () => {
        destroyTooltip(currentTooltip); // Usar currentTooltip aqui
        // Limpa as coordenadas armazenadas quando o tooltip é fechado
        delete currentTooltip.tooltipX;
        delete currentTooltip.tooltipY;
      });
    }
   */

  footer.appendChild(iconLink);
}


// Observa mudanças no board e adiciona o ícone aos novos cards
function observeBoard() {
  const board = document.querySelector('[data-testid="platform-board-kit.ui.board.scroll.board-scroll"]');
  if (!board) {
    console.error("Não foi possível encontrar o board.");
    return;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const cards = node.querySelectorAll('[data-testid="platform-board-kit.ui.card.card"]');
            if (cards.length > 0) {
              cards.forEach(addIconToCard);
            }
          }
        });
      }
    });
  });

  observer.observe(board, { childList: true, subtree: true });

  // Adiciona o ícone aos cards que já estão presentes no board
  const initialCards = board.querySelectorAll('[data-testid="platform-board-kit.ui.card.card"]');
  initialCards.forEach(addIconToCard);
}

// Aguarda o board carregar e inicia a observação
function waitForBoard() {
  const checkInterval = setInterval(() => {
    const board = document.querySelector('[data-testid="platform-board-kit.ui.board.scroll.board-scroll"]');
    if (board) {
      clearInterval(checkInterval);
      observeBoard();
    }
  }, 500);
}

waitForBoard();
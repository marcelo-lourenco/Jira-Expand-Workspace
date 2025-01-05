let isCloud = false;

function getJiraType() {
  if (document.getElementById('jira-frontend')) {
    return true
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
      margin: '0px -10px -5px 10px'
    });
  }
}

// Function to add the 'icon-expand' class to the span element
function addIconExpand(spanShrinkExpand) {
  spanShrinkExpand.classList.remove('icon-shrink');
  spanShrinkExpand.classList.add('icon-expand');
  if (!isCloud) {
    Object.assign(spanShrinkExpand.style, {
      margin: '0px -10px -5px 10px'
    });
  }

}

// If the modal dialog exists, expand it
function expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner) {
  if (modalIssueDetailsDialog) {
    modalIssueDetailsDialog.style.width = isCloud ? '100%' : '';
    Object.assign(modalIssueDetailsDialogPositioner.style, {
      maxWidth: "calc(-20px + 100vw)", maxHeight: "calc(-70px + 100vh)", insetBlockStart: "60px"
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
        width: "100%", maxWidth: "100%", maxHeight: "calc(-60px + 100vh)", insetBlockStart: "60px"
      });
    } else {
      modalIssueCreatePositioner.style.height = '100%';
      Object.assign(modalIssueCreatePositioner.style, {
        width: "100%", insetBlockStart: "40px", height: "calc(-40px + 100vh)"
      });
    }

  } else {
    // If the modal is full width, shrink it and update the icon
    addIconExpand(spanShrinkExpand);
    modalIssueCreate.style.width = "";
    if (isCloud) {
      Object.assign(modalIssueCreatePositioner.style, {
        width: "", maxWidth: "", maxHeight: "", insetBlockStart: "60px"
      });
    } else {
      modalIssueCreatePositioner.style.height = '';
      Object.assign(modalIssueCreatePositioner.style, {
        width: "", insetBlockStart: "", height: ""
      });
    }
  }
}

// Function to add the expand button to the issue create modal
function addExpandButton() {
  if (isCloud) {
    try {
      // Get the necessary elements
      const modalIssueCreatePositioner = document.querySelector('[data-testid="issue-create.ui.modal.modal-wrapper.modal--positioner"]');
      const modalIssueCreate = document.querySelector('[data-testid="issue-create.ui.modal.modal-wrapper.modal"]');
      const modalIcons = document.querySelector('[data-testid="minimizable-modal.ui.modal-container.modal-header.view-changer-wrapper"]');

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
      console.log("modalIssueCreatePositioner", modalIssueCreatePositioner)
      const modalIssueCreate = document.querySelector('.jira-dialog-core-heading'); // Padrão de modais no Jira Data Center
      console.log("modalIssueCreate", modalIssueCreate)

      /* aui-dialog2-header aui-toolbar2*/
      /* .jira-dialog-core-heading .qf-form-operations .aui-toolbar2-inner .aui-toolbar2-secondary*/

      const modalIcons = document.querySelector('.qf-form-operations'); // Cabeçalho do modal que pode conter ícones
      console.log("modalIcons", modalIcons)

      // If all elements are found and the button doesn't exist yet
      if (modalIssueCreate && modalIcons && !document.getElementById('span-shrink-expand')) {
        Object.assign(modalIcons.style, {
          display: "flex"
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
      const containerRight = document.querySelector('[data-testid="issue.views.issue-details.issue-layout.container-right"]');
      const resizerElement = document.querySelector('[data-testid="flex-resizer.ui.handle.resizer"]');

      // If all elements are found and the button doesn't exist yet
      if (containerRight && resizerElement && !document.getElementById('span-collapse-open')) {
        // Add a class to the resizer element
        //resizerElement.classList.add('resizer-width');
        resizerElement.style.width = "32px";

        // Create the button element
        const spanCollapseOpen = document.createElement('span');
        spanCollapseOpen.id = 'span-collapse-open';
        spanCollapseOpen.classList.add('icon-collapse');

        // Get the modal dialog elements
        const modalIssueDetailsDialogPositioner = document.querySelector('[data-testid="issue.views.issue-details.issue-modal.modal-dialog--positioner"]');
        const modalIssueDetailsDialog = document.querySelector('[data-testid="issue.views.issue-details.issue-modal.modal-dialog"]');

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
      const resizerElement = document.querySelector('.aui-toolbar2-secondary');  // Elemento de redimensionamento (se houver)]

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
    return
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



// Mortrar Icones vinculados ao card
(function () {
  // Estilo para o tooltip (atualizado para se parecer com o layout desejado)
  const tooltipStyle = `
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 1000;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
  max-width: 700px;
  display: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
`;

  // Cria um tooltip e aplica estilos
  function createTooltip(content) {
    // console.log("Função createTooltip: Criando tooltip...");
    const tooltip = document.createElement('div');
    tooltip.style.cssText = tooltipStyle;
    tooltip.innerHTML = `
      <div class="issue-tooltip-div1">
        <div class="_o0a01u4f _s1t41u4f _29a51440 _nopz1440 _le7a1440 _uqy11440 issue-tooltip">
          <label for="issue-link-search" class="issue-link-search-label">
            <h2 class="title-linked-items">linked items</h2>
          </label>
        <div class="issue-tooltip-div2"></div>
      </div>
      <div>${content}</div>
    `;
    document.body.appendChild(tooltip);
    // console.log("Função createTooltip: Tooltip criado.");
    return tooltip;
  }

  // Destroi o tooltip se ele existir no DOM
  function destroyTooltip(tooltip) {
    // console.log("Função destroyTooltip: Destruindo tooltip...");
    if (tooltip && document.body.contains(tooltip)) {
      let timeoutId = setTimeout(() => {
        document.body.removeChild(tooltip);
        // console.log("Função destroyTooltip: Tooltip destruído.");
      }, 3000);
    } else {
      // console.log("Função destroyTooltip: Tooltip não encontrado para destruir.");
    }
  }

  // Obtém a chave da issue de um card
  function getIssueKeyFromCard(cardElement) {
    // console.log("Função getIssueKeyFromCard: Buscando chave da issue...");
    const issueKeyElement = cardElement.querySelector('[data-testid="platform-card.common.ui.key.key"] a');

    if (issueKeyElement) {
      // console.log("Função getIssueKeyFromCard: Chave da issue encontrada:", issueKeyElement.textContent.trim());
      return issueKeyElement.textContent.trim();
    }

    console.error("Função getIssueKeyFromCard: Não foi possível encontrar a chave da issue no card:",cardElement);
    return null;
  }

  // Busca itens vinculados através da API
  function fetchLinkedIssues(issueKey, callback) {
    // console.log("Função fetchLinkedIssues: Buscando itens vinculados para a issue:", issueKey);
    if (!issueKey) {
      // console.log("Função fetchLinkedIssues: Chave da issue não fornecida.");
      callback(null, "Não foi possível encontrar a chave da issue.");
      return;
    }

    const apiUrl = `/rest/api/3/issue/${issueKey}?fields=issuelinks`;

    fetch(apiUrl)
      .then((response) => {
        // console.log("Função fetchLinkedIssues: Resposta da API recebida.");
        if (!response.ok) {
          throw new Error( `Erro ao obter links da issue. Status: ${response.status}` );
        }
        return response.json();
      })
      .then((data) => {
        // console.log("Função fetchLinkedIssues: Dados de links da issue recebidos:", data);
        let linksHtml = "";

        if (
          data.fields &&
          data.fields.issuelinks &&
          data.fields.issuelinks.length > 0
        ) {
          data.fields.issuelinks.forEach((link) => {
            const linkedIssue = link.inwardIssue || link.outwardIssue;
            const relationship = link.type.inward || link.type.outward;
            if (linkedIssue) {
              const statusCategory = linkedIssue.fields.status.statusCategory.key;
              const status = linkedIssue.fields.status.name.toLowerCase();
              let iconUrl = linkedIssue.fields.issuetype.iconUrl;
              let statusColor = "";

              // Mapeamento das cores baseado na categoria do status
              if (statusCategory === 'new') {
                statusColor = 'rgb(0, 82, 204)';
              } else if (statusCategory === 'indeterminate') {
                statusColor = 'rgb(255, 171, 0)';
              } else if (statusCategory === 'done') {
                statusColor = 'rgb(20, 137, 44)';
              } else {
                statusColor = 'rgb(64, 84, 178)';
              }

              linksHtml += `
                <div data-testid="issue.views.issue-base.content.issue-links.group-container" class="issue-links-group-container">
                  <h3 class="issue-links-group-container-h3">
                    <span data-testid="issue.issue-view.views.issue-base.content.issue-links.issue-links-view.relationship-heading">${relationship}</span>
                  </h3>
                  <div class="margin-top-8">
                    <ul class="ul-card-container">
                      <div role="listitem" class="list-item bg-color-neutral-subtle-hovered text-decoration-color-initial text-decoration-line-none text-decoration-style-solid bg-color-neutral-subtle-pressed  ">
                        <div data-testid="issue-line-card.card-container" class="issue-line-card-container">
                          <div data-testid="issue-line-card.issue-type.tooltip--container" role="presentation">
                            <div data-testid="issue-line-card-issue-type.issue-type" class="issue-line-issue-type">
                              <div class="issue-line-issue-type-grid">
                                <img src="${iconUrl}" width="16px" height="16px" alt="Tipo de item: História" draggable="false" class="issue-line-issue-type-img">
                              </div>
                            </div>
                          </div>
                          <span>
                            <span data-testid="hover-card-trigger-wrapper">
                              <a data-testid="issue.issue-view.views.common.issue-line-card.issue-line-card-view.key" href="/browse/${linkedIssue.key}" target="_blank" aria-label="${linkedIssue.key} ${status}" role="link" draggable="false" class="issue-line-card-view-key">${linkedIssue.key}</a>
                            </span>
                          </span>
                          <div data-testid="issue.issue-view.views.common.issue-line-card.issue-line-card-view.summary" class="issue-line-card-view-summary">
                            <span>
                              <span data-testid="hover-card-trigger-wrapper">
                                <a data-testid="issue-field-summary.ui.inline-read.link-item" data-is-router-link="false" data-vc="link-item" tabindex="0" class="issue-line-card-view-summary-a" href="/browse/${linkedIssue.key}" target="_blank" draggable="false" aria-disabled="false">
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
                            <div data-testid="issue-line-card.ui.assignee.read-only-assignee" role="img" aria-labelledby="uid54" style="display: inline-block; position: relative; outline: 0px;">
                              <span class="issue-line-card-assignee-inner" data-testid="issue-line-card.ui.assignee.read-only-assignee--inner">
                                <img src="REFATORAR AQUI" alt="" data-testid="issue-line-card.ui.assignee.read-only-assignee--image" aria-hidden="true" data-vc="issue-line-card.ui.assignee.read-only-assignee--image" data-ssr-placeholder-ignored="true" class="issue-line-card-assignee-image" style="border-radius: 50%;">
                              </span>
                              <span data-testid="issue-line-card.ui.assignee.read-only-assignee--label" id="uid54" hidden="">REFATORAR AQUI</span>
                            </div>
                          </div>
                          <div data-testid="issue-line-card.ui.status.status-field-container" class="issue-line-card-status-field-container">
                            <div role="presentation">
                              <div>
                                <div>
                                  <button aria-label="${status} - Alterar status" aria-expanded="false" class="issue-line-card-view-button-status" tabindex="0" type="button">
                                    <span class="issue-line-card-view-button-span">
                                      <span class="issue-line-card-view-button-span2">
                                        <div data-testid="issue.fields.status.common.ui.status-lozenge.3" class="issue-fields-status-lozenge">
                                          <span class="issue-line-card-view-button-span3">
                                            <span class="issue-line-card-view-button-span4">
                                              <div class="issue-line-card-view-button-status-color" style="color: ${statusColor};">${status}</div>
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
            }
          });
        } else {
          linksHtml = "<p>Nenhum item vinculado encontrado.</p>";
        }
        // console.log("Função fetchLinkedIssues: HTML de links gerado.");
        callback(linksHtml);
      })
      .catch((error) => {
        console.error("Função fetchLinkedIssues: Erro ao buscar os itens vinculados:", error );
        callback( null,`Erro ao buscar os itens vinculados: ${error.message}`);
      });
  }

  // Atualiza a posição do tooltip
  function updateTooltipPosition(event, tooltip) {
    // console.log("Função updateTooltipPosition: Atualizando posição do tooltip...");
    const { pageX, pageY } = event;
    const tooltipRect = tooltip.getBoundingClientRect();
    const space = 10; // Espaço entre o mouse e o tooltip

    let left = pageX + space;
    let top = pageY + space;

    // Ajuste para evitar que o tooltip saia da tela
    if (left + tooltipRect.width > window.innerWidth) {
      left = pageX - tooltipRect.width - space;
    }
    if (top + tooltipRect.height > window.innerHeight) {
      top = pageY - tooltipRect.height - space;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    // console.log("Função updateTooltipPosition: Posição do tooltip atualizada.");
  }

  // Adiciona o ícone ao card e configura os eventos do tooltip
  function addIconToCard(card) {
    // console.log("Função addIconToCard: Adicionando ícone ao card...");
    const issueKey = getIssueKeyFromCard(card);
    if (!issueKey) {
      // console.log("Função addIconToCard: Chave da issue não encontrada. Retornando.");
      return;
    }

    const footer = card.querySelector(
      '[data-testid="platform-card.ui.card.card-content.footer"]'
    );
    if (!footer) {
      console.error("Função addIconToCard: Não foi possível encontrar o footer do card:",card);
      return;
    }
    // console.log("Função addIconToCard: Footer do card encontrado.");

    // Verifica se o ícone já foi adicionado
    if (footer.querySelector(".linked-issues-icon")) {
      // console.log("Função addIconToCard: Ícone já adicionado ao card. Retornando.");
      return;
    }

    const icon = document.createElement("span");
    icon.className = "linked-issues-icon";
    icon.style.cursor = "pointer";
    icon.style.marginLeft = "5px";
    icon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#0052cc" d="m17.657 14.828l-1.415-1.414L17.658 12A4 4 0 1 0 12 6.343l-1.414 1.414L9.17 6.343l1.415-1.414a6 6 0 0 1 8.485 8.485zm-2.829 2.829l-1.414 1.414a6 6 0 0 1-8.485-8.485l1.414-1.414l1.414 1.414L6.343 12A4 4 0 0 0 12 17.657l1.414-1.414zm0-9.9l1.415 1.415l-7.072 7.07l-1.414-1.414z"/></svg>';
    // console.log("Função addIconToCard: Ícone criado.");

    let tooltip;

    icon.addEventListener("mouseover", (event) => {
      // console.log("Função addIconToCard: Evento mouseover no ícone.");
      if (!tooltip) {
        tooltip = createTooltip("");
      }

      fetchLinkedIssues(issueKey, (linksHtml, error) => {
        tooltip.innerHTML = error
          ? `<div class="issue-tooltip-div1">
              <div class="_o0a01u4f _s1t41u4f _29a51440 _nopz1440 _le7a1440 _uqy11440 issue-tooltip">
                <label for="issue-link-search" class="issue-link-search-label">
                  <h2 class="itle-linked-items">Erro</h2>
                </label>
                <div class="display-flex align-items-center"></div>
              </div>
              <div>${error}</div>
            </div>`
          : `
            <div class="issue-tooltip-div1">
              <div class="_o0a01u4f _s1t41u4f _29a51440 _nopz1440 _le7a1440 _uqy11440 issue-tooltip">
                <label for="issue-link-search" class="issue-link-search-label">
                  <h2 class="title-linked-items">Linked items</h2>
                </label>
                <div class="display-flex align-items-center"></div>
              </div>
              <div>${linksHtml}</div>
            </div>`;
        tooltip.style.display = "block";
        updateTooltipPosition(event, tooltip);
      });
    });

    icon.addEventListener("mousemove", (event) => {
      // console.log("Função addIconToCard: Evento mousemove no ícone.");
      if (tooltip && tooltip.style.display === "block") {
        updateTooltipPosition(event, tooltip);
      }
    });

    icon.addEventListener("mouseout", () => {
      // console.log("Função addIconToCard: Evento mouseout no ícone.");
      destroyTooltip(tooltip);
      tooltip = null;
    });

    footer.appendChild(icon);
    // console.log("Função addIconToCard: Ícone adicionado ao footer do card.");
  }

  // Observa mudanças no board e adiciona o ícone aos novos cards em todas as colunas
  function observeBoard() {
    // console.log("Função observeBoard: Observando o board...");
    const board = document.querySelector(
      '[data-testid="platform-board-kit.ui.board.scroll.board-scroll"]'
    );
    if (!board) {
      console.error("Função observeBoard: Não foi possível encontrar o board.");
      return;
    }
    // console.log("Função observeBoard: Board encontrado.");

    const observer = new MutationObserver((mutations) => {
      // console.log("Função observeBoard: Mudanças detectadas no board.");
      mutations.forEach((mutation) => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            // Verifica se o nó adicionado é um elemento e se contém cards
            if (
              node.nodeType === Node.ELEMENT_NODE
            ) {
              // Procurar por cards dentro do nó adicionado e em suas subárvores
              const cards = node.querySelectorAll(
                '[data-testid="platform-board-kit.ui.card.card"]'
              );
              if (cards.length > 0) {
                // console.log("Função observeBoard: Novos cards detectados em um nó adicionado.");
                cards.forEach(addIconToCard);
              }
            }
          });
        }
      });
    });

    observer.observe(board, { childList: true, subtree: true });
    // console.log("Função observeBoard: Observando mudanças no board.");

    // Adiciona o ícone aos cards que já estão presentes no board
    const initialCards = board.querySelectorAll(
      '[data-testid="platform-board-kit.ui.card.card"]'
    );
    // console.log("Função observeBoard: Adicionando ícone aos cards iniciais...");
    initialCards.forEach(addIconToCard);
    // console.log("Função observeBoard: Ícones adicionados aos cards iniciais.");
  }

  // Aguarda o board carregar e inicia a observação
  function waitForBoard() {
    // console.log("Função waitForBoard: Aguardando o board carregar...");
    const checkInterval = setInterval(() => {
      const board = document.querySelector(
        '[data-testid="platform-board-kit.ui.board.scroll.board-scroll"]'
      );
      if (board) {
        // console.log("Função waitForBoard: Board carregado.");
        clearInterval(checkInterval);
        observeBoard();
      }
    }, 500);
  }

  waitForBoard();
})();

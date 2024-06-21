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
}

// Function to add the 'icon-expand' class to the span element
function addIconExpand(spanShrinkExpand) {
  spanShrinkExpand.classList.remove('icon-shrink');
  spanShrinkExpand.classList.add('icon-expand');
}

// If the modal dialog exists, expand it
function expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner) {
  if (modalIssueDetailsDialog) {
    modalIssueDetailsDialog.style.width = '100%';
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
    containerRight.style.display = 'block';

    expandIssueDetailsDialog(modalIssueDetailsDialog, modalIssueDetailsDialogPositioner);
  }
}

// Function to handle the collapse/open behavior of the right container
function fnCollapseOpen(containerRight, spanCollapseOpen, modalIssueDetailsDialog, modalIssueDetailsDialogPositioner) {
  if (containerRight.style.display === 'none') {
    // If the container is hidden, show it and update the icon
    addIconCollapse(spanCollapseOpen);
    containerRight.style.display = 'block';

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
    Object.assign(modalIssueCreatePositioner.style, {
      width: "100%", maxWidth: "100%", maxHeight: "calc(-60px + 100vh)", insetBlockStart: "60px"
    });
  } else {
    // If the modal is full width, shrink it and update the icon
    addIconExpand(spanShrinkExpand);
    modalIssueCreate.style.width = "";
    Object.assign(modalIssueCreatePositioner.style, {
      width: "", maxWidth: "", maxHeight: "", insetBlockStart: "60px"
    });
  }
}

// Function to add the expand button to the issue create modal
function addExpandButton() {
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
}

// Function to add the collapse button to the issue details container
function addCollapseButton() {
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

      /* 
      // Add mouseover and mouseout event listeners to the document
      document.addEventListener('mouseover', function (event) {
        if (event.clientX > window.innerWidth - 20 && containerRight.style.display === 'none') {
          containerRight.style.display === 'block'
          modalIssueDetailsDialog.style.width = '';
          Object.assign(modalIssueDetailsDialogPositioner.style, {
            width: "100%", maxWidth: "100%", maxHeight: "100%", insetBlockStart: "0px"
          });
        }
      });

      document.addEventListener('mouseout', function (event) {
        if (event.clientX > window.innerWidth - 20 && containerRight.style.display === 'block') {
          containerRight.style.display === 'none'
        }
      }); 
      */
    }
  } catch (error) {
    console.error('Error adding collapse button:', error);
  }
}

// Function to check if the necessary elements exist and add the buttons
function checkAndAddButtons() {
  addExpandButton();
  addCollapseButton();
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

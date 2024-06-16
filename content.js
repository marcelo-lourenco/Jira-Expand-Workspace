// Function to add the button and configure the collapse behavior
function addCollapseButton() {
  try {
    // issue details
    const containerRight = document.querySelector('[data-testid="issue.views.issue-details.issue-layout.container-right"]');
    const resizerElement = document.querySelector('[data-testid="flex-resizer.ui.handle.resizer"]');

    if (containerRight && resizerElement && !document.getElementById('collapse-icon')) {
      resizerElement.classList.add('resizer-width');

      const collapseIcon = document.createElement('span');
      collapseIcon.id = 'collapse-icon';
      collapseIcon.classList.add('icon-close');
      collapseIcon.style.cursor = 'pointer';

      // issue details
     const modalIssueDetailsDialogPositioner = document.querySelector('[data-testid="issue.views.issue-details.issue-modal.modal-dialog--positioner"]');
     const modalIssueDetailsDialog = document.querySelector('[data-testid="issue.views.issue-details.issue-modal.modal-dialog"]');
  
      // Add click behavior to icon
      collapseIcon.addEventListener('click', function() {
        if (containerRight.style.display === 'none') {

          collapseIcon.classList.remove('icon-open');
          collapseIcon.classList.add('icon-close');

          containerRight.style.display = 'block';
          
          if (modalIssueDetailsDialog){
            modalIssueDetailsDialog.style.width = '';
            Object.assign(modalIssueDetailsDialogPositioner.style, {
              width: "", maxWidth: "", maxHeight: "", insetBlockStart: ""
            });
          }
          
          
        } else {
          collapseIcon.classList.remove('icon-close');
          collapseIcon.classList.add('icon-open');

          containerRight.style.display = 'none';

          if (modalIssueDetailsDialog){
            modalIssueDetailsDialog.style.width = '100%'
            Object.assign(modalIssueDetailsDialogPositioner.style, {
              width: "100%", maxWidth: "100%", maxHeight: "100%", insetBlockStart: "0px"
            });
          }
          
        }
      });
  
      // Add the button to the document
      resizerElement.appendChild(collapseIcon);
    }

  } catch (error) {
    console.error('Error adding collapse button:', error);
  }
}

function addExpandButton() {
  try {
    // issue create
    const modalIssueCreatePositioner = document.querySelector('[data-testid="issue-create.ui.modal.modal-wrapper.modal--positioner"]');
    const modalIssueCreate = document.querySelector('[data-testid="issue-create.ui.modal.modal-wrapper.modal"]');
    const modalIcons = document.querySelector('[data-testid="minimizable-modal.ui.modal-container.modal-header.view-changer-wrapper"]');

    if (modalIssueCreate && modalIcons && !document.getElementById('expand-icon')) {
      const expandIcon = document.createElement('span');
      expandIcon.id = 'expand-icon';
      expandIcon.classList.add('icon-expand');
      expandIcon.style.cursor = 'pointer';

      // Add click behavior to icon
      expandIcon.addEventListener('click', function() {
        if (modalIssueCreate.style.width !== '100%') {
 
          expandIcon.classList.remove('icon-expand');
          expandIcon.classList.add('icon-shrink');

          modalIssueCreate.style.width = '100%'
          Object.assign(modalIssueCreatePositioner.style, {
            width: "100%", maxWidth: "100%", maxHeight: "100%", insetBlockStart: "0px"
          });
        } else {
          expandIcon.classList.remove('icon-shrink');
          expandIcon.classList.add('icon-expand');

          modalIssueCreate.style.width = "";
          Object.assign(modalIssueCreatePositioner.style, {
            width: "", maxWidth: "", maxHeight: "", insetBlockStart: "60px"
          });
        }
      });
  
      // Add the button to the document
      modalIcons.appendChild(expandIcon);
    }
    
  } catch (error) {
    console.error('Error adding expand button:', error);
  }
}

// Add button when loading page and when changing route in Jira
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    addCollapseButton();
    addExpandButton();
  });
} else {
  addCollapseButton();
  addExpandButton();
}

// Observer for DOM changes
const observer = new MutationObserver(() => {
  addCollapseButton();
  addExpandButton();
});
observer.observe(document.body, { childList: true, subtree: true });

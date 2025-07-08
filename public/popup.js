document.addEventListener('DOMContentLoaded', () => {
  const settingConfiguration = {
    'enableAll': {
      label: 'Enable All Features',
      dependentSettings: ['collapseRightPanel', 'expandCreateModal', 'viewLinkedTickets', 'expandImages'],
      default: true
    },
    'collapseRightPanel': {
      label: 'Collapse Right Panel',
      functions: ['fnCollapseLoad', 'fnCollapseOpen'],
      default: true
    },
    'expandCreateModal': {
      label: 'Expand Create Modal',
      functions: ['fnShrinkExpand'],
      default: true
    },
    'viewLinkedTickets': {
      label: 'View Linked Tickets',
      functions: ['addIconToCard'],
      default: true
    },
    'expandImages': {
      label: 'Expand Images',
      functions: [''],
      default: true
    },
  };

  const reloadMessageElement = document.getElementById('ewj-reload-message');
  let reloadMessageTimeout;

  /**
   * Loads all settings at once from chrome.storage.local.
   */
  chrome.storage.local.get(Object.keys(settingConfiguration), (savedSettings) => {
    if (chrome.runtime.lastError) {
      console.error('Error loading settings:', chrome.runtime.lastError.message);
      return;
    }

    /** @type {boolean} - Indicates if settings have been previously saved in storage. */
    const hasSavedSettings = Object.keys(savedSettings).length > 0;
    const enableAllCheckbox = document.getElementById('toggle-enableAll');

    /**
     * Configures each checkbox individually based on stored settings or default values.
     */
    Object.keys(settingConfiguration).forEach(settingKey => {
      const checkbox = document.getElementById(`toggle-${settingKey}`);
      if (!checkbox) return;

      /** @type {boolean} - The initial checked state for the current checkbox. */
      let initialCheckedState = settingConfiguration[settingKey].default;
      if (hasSavedSettings && savedSettings[settingKey] !== undefined) {
        initialCheckedState = savedSettings[settingKey];
      }
      checkbox.checked = initialCheckedState;

      /**
       * Adds a change event listener to each checkbox to save its state
       * and handle master/dependent logic.
       */
      checkbox.addEventListener('change', () => {
        const isChecked = checkbox.checked;
        saveSetting(settingKey, isChecked);

        // If the master setting ('enableAll') changed, update dependent settings.
        if (settingKey === 'enableAll') {
          updateDependentSettings(isChecked);
        }

        // Show the "Reload Required" message.
        if (reloadMessageElement) {
          clearTimeout(reloadMessageTimeout);
          reloadMessageElement.style.opacity = '1';
          reloadMessageTimeout = setTimeout(() => {
            reloadMessageElement.style.opacity = '0';
          }, 2000); // Hide after 2 seconds.
        }
      });
    });

    /**
     * After all checkboxes are initialized, adjust the state of dependent settings
     * based on the loaded state of the 'enableAll' master checkbox.
     */
    if (enableAllCheckbox) {
      const masterEnableState = enableAllCheckbox.checked;
      settingConfiguration.enableAll.dependentSettings.forEach(depSettingKey => {
        const depCheckbox = document.getElementById(`toggle-${depSettingKey}`);
        if (depCheckbox) {
          depCheckbox.disabled = !masterEnableState;
          // Se o mestre está desabilitado, os filhos também devem estar desabilitados E desmarcados.
          // If the master is disabled, children should also be disabled AND unchecked.
          // Saves this state for consistency.
          if (!masterEnableState) {
            if (depCheckbox.checked) { // Only change and save if it was checked.
              depCheckbox.checked = false;
              saveSetting(depSettingKey, false);
            }
          }
          // Se o mestre está habilitado, os filhos ficam habilitados (disabled=false).
          // If the master is enabled, children are enabled (disabled=false).
          // Their 'checked' states (which were loaded from storage) are maintained.
        }
      });
    }

    /**
     * If there were no saved settings, save the default settings.
     * This happens after the checkboxes have been configured and dependent settings adjusted.
     */
    if (!hasSavedSettings) {
      saveDefaultSettings();
    }
  });

  /**
   * Updates dependent settings when the master 'enableAll' toggle is changed by the user.
   * @param {boolean} enable - Whether to enable or disable the dependent settings.
   */
  function updateDependentSettings(enable) {
    settingConfiguration.enableAll.dependentSettings.forEach(depSettingKey => {
      const checkbox = document.getElementById(`toggle-${depSettingKey}`);
      if (checkbox) {
        checkbox.checked = enable;
        checkbox.disabled = !enable; // Enable/disable the child checkbox.
        saveSetting(depSettingKey, enable); // Save the forced state of the child.
      }
    });
  }

  /**
   * Saves an individual setting to chrome.storage.local.
   * @param {string} key - The key of the setting to save.
   * @param {boolean} value - The value of the setting to save.
   */
  function saveSetting(key, value) {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        console.error(`Error saving setting "${key}":`, chrome.runtime.lastError.message);
      } else {
        // console.log(`Setting "${key}" saved as: ${value}`); // Optional: for debugging
      }
    });
  }

  /**
   * Saves all default settings to chrome.storage.local.
   * This is typically called when the extension is run for the first time
   * or if no settings are found in storage.
   */
  function saveDefaultSettings() {
    const defaultSettings = {};
    Object.keys(settingConfiguration).forEach(key => {
      defaultSettings[key] = settingConfiguration[key].default;
    });

    chrome.storage.local.set(defaultSettings, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving default settings:', chrome.runtime.lastError.message);
      } else {
        console.log('Default settings saved successfully');
      }
    });
  }
});
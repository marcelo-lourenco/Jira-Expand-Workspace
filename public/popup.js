document.addEventListener('DOMContentLoaded', () => {
  const settingConfiguration = {
    'enableAll': { 
      label: 'Enable All Features',
      dependentSettings: ['collapseRightPanel', 'expandCreateModal', 'viewLinkedTickets'],
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
    }
  };

  // Carrega todas as configurações de uma vez
  chrome.storage.sync.get(Object.keys(settingConfiguration), (savedSettings) => {
    if (chrome.runtime.lastError) {
      console.error('Error loading settings:', chrome.runtime.lastError.message);
      return;
    }

    // Verifica se já existem configurações salvas
    const hasSavedSettings = Object.keys(savedSettings).length > 0;

    // Configura cada checkbox
    Object.keys(settingConfiguration).forEach(settingKey => {
      const checkbox = document.getElementById(`toggle-${settingKey}`);
      if (!checkbox) return;

      // Define o estado do checkbox
      checkbox.checked = hasSavedSettings
        ? savedSettings[settingKey] !== undefined
          ? savedSettings[settingKey]
          : settingConfiguration[settingKey].default
        : settingConfiguration[settingKey].default;

      // Se for a configuração mestre, atualiza os dependentes
      if (settingKey === 'enableAll') {
        updateDependentSettings(checkbox.checked);
      }

      // Adiciona listener para salvar mudanças
      checkbox.addEventListener('change', () => {
        const isChecked = checkbox.checked;
        saveSetting(settingKey, isChecked);

        // Se for a configuração mestre, atualiza os dependentes
        if (settingKey === 'enableAll') {
          updateDependentSettings(isChecked);
        }
      });
    });

    // Se não havia configurações salvas, salva os padrões
    if (!hasSavedSettings) {
      saveDefaultSettings();
    }
  });

  // Atualiza as configurações dependentes quando o toggle mestre muda
  function updateDependentSettings(enable) {
    settingConfiguration.enableAll.dependentSettings.forEach(depSetting => {
      const checkbox = document.getElementById(`toggle-${depSetting}`);
      if (checkbox) {
        checkbox.checked = enable;
        checkbox.disabled = !enable;
        saveSetting(depSetting, enable);
      }
    });
  }

  // Salva uma configuração individual
  function saveSetting(key, value) {
    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        console.error(`Error saving setting "${key}":`, chrome.runtime.lastError.message);
      } else {
        console.log(`Setting "${key}" saved as: ${value}`);
      }
    });
  }

  // Salva todas as configurações padrão
  function saveDefaultSettings() {
    const defaultSettings = {};
    Object.keys(settingConfiguration).forEach(key => {
      defaultSettings[key] = settingConfiguration[key].default;
    });

    chrome.storage.sync.set(defaultSettings, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving default settings:', chrome.runtime.lastError.message);
      } else {
        console.log('Default settings saved successfully');
      }
    });
  }
});
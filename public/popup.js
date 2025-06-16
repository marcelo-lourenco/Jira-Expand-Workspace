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

  const reloadMessageElement = document.getElementById('reload-message');
  let reloadMessageTimeout;

  // Carrega todas as configurações de uma vez
  chrome.storage.local.get(Object.keys(settingConfiguration), (savedSettings) => {
    if (chrome.runtime.lastError) {
      console.error('Error loading settings:', chrome.runtime.lastError.message);
      return;
    }

    // Verifica se já existem configurações salvas
    const hasSavedSettings = Object.keys(savedSettings).length > 0;
    const enableAllCheckbox = document.getElementById('toggle-enableAll');

    // Configura cada checkbox individualmente com base no storage ou valor padrão
    Object.keys(settingConfiguration).forEach(settingKey => {
      const checkbox = document.getElementById(`toggle-${settingKey}`);
      if (!checkbox) return;

      // Define o estado inicial do checkbox
      let initialCheckedState = settingConfiguration[settingKey].default;
      if (hasSavedSettings && savedSettings[settingKey] !== undefined) {
        initialCheckedState = savedSettings[settingKey];
      }
      checkbox.checked = initialCheckedState;

      // Adiciona listener para salvar mudanças
      checkbox.addEventListener('change', () => {
        const isChecked = checkbox.checked;
        saveSetting(settingKey, isChecked);

        // Se a configuração mestre ('enableAll') mudou, atualiza os dependentes
        if (settingKey === 'enableAll') {
          updateDependentSettings(isChecked);
        }

        // Mostra a mensagem "Reload Required"
        if (reloadMessageElement) {
          clearTimeout(reloadMessageTimeout);
          reloadMessageElement.style.opacity = '1';
          reloadMessageTimeout = setTimeout(() => {
            reloadMessageElement.style.opacity = '0';
          }, 2000); // Esconde após 2 segundos
        }
      });
    });

    // Após todos os checkboxes serem inicializados, ajusta o estado dos dependentes
    // com base no estado carregado de 'enableAll'
    if (enableAllCheckbox) {
      const masterEnableState = enableAllCheckbox.checked;
      settingConfiguration.enableAll.dependentSettings.forEach(depSettingKey => {
        const depCheckbox = document.getElementById(`toggle-${depSettingKey}`);
        if (depCheckbox) {
          depCheckbox.disabled = !masterEnableState;
          // Se o mestre está desabilitado, os filhos também devem estar desabilitados E desmarcados.
          // Salva este estado para consistência.
          if (!masterEnableState) {
            if (depCheckbox.checked) { // Só altera e salva se estava marcado
              depCheckbox.checked = false;
              saveSetting(depSettingKey, false);
            }
          }
          // Se o mestre está habilitado, os filhos ficam habilitados (disabled=false).
          // Seus estados 'checked' (que foram carregados do storage) são mantidos.
        }
      });
    }

    // Se não havia configurações salvas, salva os padrões
    // Isso acontece depois que os checkboxes foram configurados e os dependentes ajustados.
    if (!hasSavedSettings) {
      saveDefaultSettings();
    }
  });

  // Atualiza as configurações dependentes QUANDO O TOGGLE MESTRE MUDA PELO USUÁRIO
  function updateDependentSettings(enable) {
    settingConfiguration.enableAll.dependentSettings.forEach(depSettingKey => {
      const checkbox = document.getElementById(`toggle-${depSettingKey}`);
      if (checkbox) {
        checkbox.checked = enable;
        checkbox.disabled = !enable; // Habilita/desabilita o filho
        saveSetting(depSettingKey, enable); // Salva o estado forçado do filho
      }
    });
  }

  // Salva uma configuração individual
  function saveSetting(key, value) {
    chrome.storage.local.set({ [key]: value }, () => {
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

    chrome.storage.local.set(defaultSettings, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving default settings:', chrome.runtime.lastError.message);
      } else {
        console.log('Default settings saved successfully');
      }
    });
  }
});
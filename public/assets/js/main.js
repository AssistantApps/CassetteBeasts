function loadSettingsFromStorage() {
  try {
    const contentString = localStorage.getItem('assistantApps');
    const contentObj = JSON.parse(contentString);
    if (contentObj == null) throw 'nothing in localStorage';
    window.assistantApps = contentObj;
  } catch {
    window.assistantApps = {
      useGif: true,
    };
  }
}

function onPageLoad() {
  loadSettingsFromStorage();

  if (window.assistantApps.useGif) {
    const monsterGridNode = document.getElementById('monster-grid');
    if (monsterGridNode != null) monsterGridNode.classList.add('useGif');
    const monsterGridCheckboxNode = document.getElementById('monster-grid-checkbox');
    if (monsterGridNode != null) monsterGridCheckboxNode.checked = true;

    const characterGridNode = document.getElementById('character-grid');
    if (characterGridNode != null) characterGridNode.classList.add('useGif');
    const characterGridCheckboxNode = document.getElementById('character-grid-checkbox');
    if (characterGridNode != null) characterGridCheckboxNode.checked = true;
  }

  const tabContentId = `tab${window.assistantApps.useGif ? 1 : 0}`;
  const spriteContainerNode = document.getElementById('sprite-tab-container');
  if (spriteContainerNode != null) spriteContainerNode.classList.add(tabContentId);

  const audios = document.querySelectorAll('audio.autoplay');
  if (audios?.length > 0) {
    audios[0].volume = 0.3;
    const resetVolume = () => {
      audios[0].volume = 1;
      audios[0].removeEventListener('ended', resetVolume, false);
    };
    audios[0].addEventListener('ended', resetVolume, false);
    audios[0].play();
  }
}

function setSetting(name, value) {
  window.assistantApps[name] = value;
  localStorage.setItem('assistantApps', JSON.stringify(window.assistantApps));
}

function changeLanguage(newLangCode) {
  const pathName = window.location.pathname.substring(1);
  const slashIndex = pathName.indexOf('/');
  let trailingPath = pathName.substring(slashIndex);
  if (slashIndex < 0) {
    // trailingPath = '/' + trailingPath;
    trailingPath = '';
  }

  window.location.href = `/${newLangCode}${trailingPath}`;
}

function applyClassToId(id, classToRemove, className) {
  const node = document.getElementById(id);
  if (node == null) return;

  for (const nodeClass of node.classList) {
    if (nodeClass.includes(classToRemove)) {
      node.classList.remove(nodeClass);
    }
  }
  node.classList.add(className);
}

function toggleClassToId(id, className, enabled) {
  const node = document.getElementById(id);
  if (node == null) return;

  for (const nodeClass of node.classList) {
    if (nodeClass.includes(className)) {
      node.classList.remove(nodeClass);
    }
  }

  if (enabled) {
    node.classList.add(className);
  }
}

const onSearchChange = (searchString) => {
  document.querySelectorAll('.item').forEach((node) => {
    const title = node.dataset['title'] ?? '';
    const description = node.dataset['description'] ?? '';

    const containsTitle = title.toLowerCase().includes(searchString.toLowerCase());
    const containsDescription = description.toLowerCase().includes(searchString.toLowerCase());

    let orderValue = 3;
    node.style.setProperty('opacity', 1);
    node.style.setProperty('order', orderValue);

    const headingNode = node.querySelector('.heading');
    const descriptionNode = node.querySelector('.description');
    if (containsTitle | containsDescription) {
      if (containsTitle) orderValue -= 2;
      if (containsDescription) orderValue -= 1;
      node.style.setProperty('order', orderValue);
      highlight(headingNode, title, searchString);
      highlight(descriptionNode, description, searchString);
    } else {
      node.style.setProperty('opacity', '0.25', 'important');
      headingNode.innerHTML = title;
      descriptionNode.innerHTML = description;
    }
  });
};

const highlight = (node, text, searchString) => {
  const index = text.toLowerCase().indexOf(searchString.toLowerCase());
  if (index >= 0) {
    const innerHTML =
      text.substring(0, index) +
      "<span class='highlight'>" +
      text.substring(index, index + searchString.length) +
      '</span>' +
      text.substring(index + searchString.length);
    node.innerHTML = innerHTML;
  } else {
    node.innerHTML = text;
  }
};

const orderItemsByDataAttr = (parentId, attrToOrderBy) => {
  const parentNode = document.getElementById(parentId);
  if (parentNode == null) return;

  let sortedNodes;
  const nodes = document.querySelectorAll('.item');
  sortedNodes = [...nodes].sort((a, b) => {
    const aValue = a.dataset[attrToOrderBy] ?? '';
    const bValue = b.dataset[attrToOrderBy] ?? '';

    if (aValue < bValue) {
      return -1;
    }
    if (aValue > bValue) {
      return 1;
    }
    return 0;
  });

  parentNode.innerHTML = '';
  for (const node of sortedNodes) {
    node.style['animation-delay'] = '0ms';
    parentNode.appendChild(node);
  }
};

const playAudioNode = (id) => {
  const node = document.getElementById(id);
  if (node == null) return;

  node.play();
};

const revealEmail = (elem, event) => {
  event?.preventDefault?.();
  const obfuscated = atob(decodeURI(elem.dataset['email']));
  let realValue = '';
  for (let index = 0; index < obfuscated.split('').length; index++) {
    const char = obfuscated[index * 3 + 1];
    if (char == null) break;
    realValue = realValue + char;
  }

  elem.href = realValue;
  elem.title = realValue.replace('mailto:', '');
  elem.innerText = realValue.replace('mailto:', '');
  elem.removeAttribute('onclick');
};

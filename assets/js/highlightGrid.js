function clearClasses(node) {
  for (const gridClass of node.classList) {
    node.classList.remove(gridClass);
  }
}
function onGridHover(elementReactionGridNode) {
  return function (elementCellNode) {
    clearClasses(elementReactionGridNode);

    const importantClasses = ['x-y'];
    for (const classItem of elementCellNode.classList) {
      if (classItem.includes('x-') || classItem.includes('y-')) {
        importantClasses.push(classItem);
      }
    }

    for (const importantClass of importantClasses) {
      elementReactionGridNode.classList.add(importantClass);
    }
  };
}

function onPageLoad() {
  const elementReactionGridNode = document.getElementById('element-reaction-grid');
  if (elementReactionGridNode == null) return;
  const cellHoverFunc = onGridHover(elementReactionGridNode);

  const elementCellNodes = document.querySelectorAll('#element-reaction-grid .cell');
  if (elementCellNodes.length < 1) return;

  for (const elementCellNode of elementCellNodes) {
    elementCellNode.addEventListener('mouseover', (_) => {
      cellHoverFunc(elementCellNode);
    });

    elementCellNode.addEventListener('mouseout', (_) => {
      clearClasses(elementReactionGridNode);
    });
    // elementCellNode.style.setProperty('opacity', '0.25', 'important');
  }
}
onPageLoad();
// document.addEventListener("DOMContentLoaded", onPageLoad);

const onElementSelect = (elem, elemId) => {
  const elementId = elem.dataset['id'] ?? '';
  const displayElem = elem.cloneNode(true);
  const detailNode = elem.parentNode.parentNode;
  detailNode.removeAttribute('open');
  const summaryElem = detailNode.querySelector('summary');
  summaryElem.replaceChildren(displayElem);

  const containerElem = document.getElementById(elemId);
  containerElem.dataset[detailNode.id] = elementId;

  displayElementReaction(containerElem);
};

const displayElementReaction = (containerElem) => {
  const attacker = containerElem.dataset['attacker'] ?? '';
  const defender = containerElem.dataset['defender'] ?? '';
  const key = `${attacker}_on_${defender}`;

  let numResults = 0;
  const noEffectElem = containerElem.querySelector('.no-effect');
  const buffElems = containerElem.querySelectorAll('.buff-details');
  for (const buffElem of buffElems) {
    let hasKey = false;
    let classKey = '';
    for (const classItem of buffElem.classList) {
      if (classItem.includes(key)) {
        hasKey = true;
        classKey = classItem;
        numResults++;
      }
    }
    if (hasKey) {
      const classSplit = classKey.split('_');
      const attackFromId = classSplit[0];
      const defendFromId = classSplit[2];
      const attackerElem = containerElem.querySelector(`#attacker li[data-id="${attackFromId}"]`);
      if (attackerElem) {
        const attackerDistElem = buffElem.querySelector('.mobile-detail-row .attacker');
        attackerDistElem?.replaceChildren?.(attackerElem.cloneNode(true));
      }

      const defenderElem = containerElem.querySelector(`#defender li[data-id="${defendFromId}"]`);
      if (defenderElem) {
        const defenderDistElem = buffElem.querySelector('.mobile-detail-row .defender');
        defenderDistElem?.replaceChildren?.(defenderElem.cloneNode(true));
      }

      const actionDistElem = buffElem.querySelector('.mobile-detail-row .action');
      if (attackerElem && defenderElem) {
        actionDistElem.innerText = '⇒';
      } else {
        actionDistElem.innerText = '';
      }

      buffElem.style.setProperty('display', 'block', 'important');
    } else {
      buffElem.style.setProperty('display', 'none', 'important');
    }
  }

  if (numResults == 0) {
    noEffectElem.setProperty('display', 'block', 'important');
  } else {
    noEffectElem.style.setProperty('display', 'none', 'important');
  }
};

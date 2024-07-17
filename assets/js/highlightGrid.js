function clearClasses(node) {
    for (const gridClass of node.classList) {
        node.classList.remove(gridClass)
    }
}
function onGridHover(elementReactionGridNode) {
    return function (elementCellNode) {

        clearClasses(elementReactionGridNode);

        const importantClasses = ['x-y']
        for (const classItem of elementCellNode.classList) {
            if (classItem.includes('x-') || classItem.includes('y-')) {
                importantClasses.push(classItem)
            }
        }

        for (const importantClass of importantClasses) {
            elementReactionGridNode.classList.add(importantClass)
        }
    }
}

function onPageLoad() {
    const elementReactionGridNode = document.getElementById('element-reaction-grid');
    if (elementReactionGridNode == null) return;
    const cellHoverFunc = onGridHover(elementReactionGridNode);

    const elementCellNodes = document.querySelectorAll('#element-reaction-grid .cell');
    if (elementCellNodes.length < 1) return;

    for (const elementCellNode of elementCellNodes) {
        elementCellNode.addEventListener("mouseover", _ => {
            cellHoverFunc(elementCellNode)
        });

        elementCellNode.addEventListener("mouseout", _ => {
            clearClasses(elementReactionGridNode);
        });
        // elementCellNode.style.setProperty('opacity', '0.25', 'important');
    }

}
// onPageLoad()
document.addEventListener("DOMContentLoaded", onPageLoad);
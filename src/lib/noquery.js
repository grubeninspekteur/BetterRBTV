// Replacements for jQuery functions used in this project so jQuery can eventually be removed as a dependency

/**
 * Removes all child nodes of the given element
 * @param {Node} elem the element
 */
function removeChildNodes(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

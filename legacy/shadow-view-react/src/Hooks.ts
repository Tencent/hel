export function getRootNode(node: Node) {
  let root: any = node;
  while (root && !root.host && root.parentNode) root = root.parentNode;
  return root;
}

const { removeChild } = Node.prototype;
Node.prototype.removeChild = function (child) {
  if (!removeChild) return;
  try {
    return removeChild.call(this, child);
  } catch (err) {
    return removeChild.call(child.parentNode, child);
  }
};

const { contains } = Node.prototype;
Node.prototype.contains = function (otherNode) {
  if (!otherNode || !contains) return false;
  const root = getRootNode(this);
  const otherRoot = getRootNode(otherNode);
  if (!root || !otherRoot) return false;
  try {
    return root === otherRoot ? contains.call(this, otherNode) : contains.call(this, otherRoot.host || otherNode);
  } catch (err) {
    console.error(err);
    return false;
  }
};

const { compareDocumentPosition } = Node.prototype;
Node.prototype.compareDocumentPosition = function (otherNode) {
  if (!otherNode || !compareDocumentPosition) return false;
  const root = getRootNode(this);
  const otherRoot = getRootNode(otherNode);
  if (!root || !otherRoot) return false;
  try {
    return root === otherRoot
      ? compareDocumentPosition.call(this, otherNode)
      : compareDocumentPosition.call(this, otherRoot.host || otherNode);
  } catch (err) {
    console.error(err);
    return false;
  }
};

const parentElementDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'parentElement');
Object.defineProperty(Node.prototype, 'parentElement', {
  configurable: true,
  enumerable: true,
  get() {
    const parentElement = parentElementDescriptor.get.call(this);
    if (parentElement) return parentElement;
    const parentNode = this.parentNode;
    if (!parentNode) return null;
    if (parentNode.constructor !== (window as any).ShadowRoot) return null;
    return parentNode.parentElement || parentNode;
  },
});

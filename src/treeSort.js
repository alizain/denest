const ACCESSOR = "treeSort"
const DECAY = 0.4

export default function treeSort(tree) {
  let childrenSort = 0
  if (Array.isArray(tree.comments)) {
    childrenSort = tree.comments.reduce((total, curr) => {
      total += treeSort(curr)[ACCESSOR]
      return total
    }, 0)
  }
  tree[ACCESSOR] = (childrenSort * DECAY) + (tree.score || 0)
  return tree
}

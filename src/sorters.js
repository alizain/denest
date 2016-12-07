export const sorters = {
  reddit(a, b) {
    return a.redditSort - b.redditSort // where the lower index is better
  },
  tree(a, b) {
    return b.treeSort - a.treeSort // where the higher number is better
  }
}

export function sort(key, list) {
  if (Array.isArray(list)) {
    list.sort(sorters[key])
    list.forEach(item => sort(key, item.comments))
  }
  return list
}

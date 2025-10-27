export function getSearchObj(search: string) {
  const map: Record<string, string> = {};
  if (search) {
    let pureSearch = search;
    if (search.startsWith('?')) {
      pureSearch = search.substring(1);
    }

    const items = pureSearch.split('&');
    items.forEach((item) => {
      const [key, value] = item.split('=');
      map[key] = value;
    });
    return map;
  }
  return map;
}

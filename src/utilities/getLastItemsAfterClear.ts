import LogItem from "../types/LogItem";

function getLastItemsAfterClear(items: (LogItem | 0)[]): LogItem[] {
  // Find the last index where ["clear", ""] occurs
  let lastClearIndex = -1;
  for (let i = 0; i < items.length; i++) {
    if (items[i] === 0) {
      lastClearIndex = i;
    }
  }

  // If ["clear", ""] was found, return items after it; else, return the whole array
  if (lastClearIndex !== -1) {
    return items
      .slice(lastClearIndex + 1)
      .filter((item): item is LogItem => item !== 0);
  } else {
    return items.filter((item): item is LogItem => item !== 0);
  }
}

export default getLastItemsAfterClear;

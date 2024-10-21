import ITEMS from "../const/items";
import type { ItemType } from "../const/items";

export const outputWithArticle = (item: ItemType) => {
  if (ITEMS[item].article) {
    return `${ITEMS[item].article} ${item}`;
  }
  const aOrAn = ["a", "e", "i", "o", "u"].includes(item.substring(0, 1))
    ? "an"
    : "a";
  return `${aOrAn} ${item}`;
};

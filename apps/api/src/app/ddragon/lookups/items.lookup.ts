import { ItemsDataDragon } from '../dto/item.dto';

const itemsJSON: ItemsDataDragon = require(`../../../assets/ddragon/item.json`);

function getItemById(itemId: number) {
  return itemsJSON['data'][itemId];
}

export const ItemsLookup = { getItemById };

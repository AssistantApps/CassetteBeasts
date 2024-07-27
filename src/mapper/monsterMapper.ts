import { IMonsterFormEnhanced, IMonsterFormSimplified } from 'contracts/monsterForm';

export const monsterToSimplified = (monster: IMonsterFormEnhanced): IMonsterFormSimplified => ({
  id: monster.id,
  name_localised: monster.name_localised,
  resource_name: monster.resource_name,
  icon_url: monster.icon_url,
  bestiary_index_with_padding: monster.bestiary_index_with_padding,
  source: undefined,
});

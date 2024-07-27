import { IMonsterFormEnhanced, IMonsterFormSimplified } from 'contracts/monsterForm';

export const sortByStringProperty =
  <T>(getProp: (t: T) => string) =>
  (a: T, b: T) => {
    if (getProp(a) < getProp(b)) {
      return -1;
    }
    if (getProp(a) > getProp(b)) {
      return 1;
    }
    return 0;
  };

export const monsterSort = (a: IMonsterFormEnhanced, b: IMonsterFormEnhanced) => {
  return (
    +a.isSecret - +b.isSecret ||
    (a.bestiary_index < 0 ? 500 : a.bestiary_index) -
      (b.bestiary_index < 0 ? 500 : b.bestiary_index)
  );
};

export const monsterSimplifiedSort = (a: IMonsterFormSimplified, b: IMonsterFormSimplified) => {
  return (
    +a.isSecret - +b.isSecret ||
    (a.bestiary_index < 0 ? 500 : a.bestiary_index) -
      (b.bestiary_index < 0 ? 500 : b.bestiary_index)
  );
};

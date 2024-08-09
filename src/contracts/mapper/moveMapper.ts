import type { IMoveEnhanced, IMoveSimplified } from 'contracts/move';

export const moveToSimplified = (move: IMoveEnhanced): IMoveSimplified => ({
  id: move.id,
  name_localised: move.name_localised,
  category_name_localised: move.category_name_localised,
  power: move.power,
  accuracy: move.accuracy,
  elemental_types_elements: move.elemental_types_elements,
});

import type { IBreadcrumb } from 'contracts/breadcrumb';
import { UIKeys } from './localisation';
import { routes } from './route';

export const breadcrumb = {
  home: (langCode: string, disabled: boolean = false): IBreadcrumb => ({
    name: 'home',
    link: `/${langCode}`,
    disabled,
  }),
  monster: (langCode: string, disabled: boolean = false): IBreadcrumb => ({
    uiKey: UIKeys.viewMonsters,
    link: `/${langCode}${routes.monsters}`,
    disabled,
  }),
  monsterDetail: (langCode: string, item: string): IBreadcrumb => ({
    name: item,
    link: `/${langCode}${routes.monsters}/${encodeURI(item)}.html`,
    disabled: true,
  }),
  character: (langCode: string, disabled: boolean = false): IBreadcrumb => ({
    name: 'Characters',
    link: `/${langCode}${routes.characters}`,
    disabled,
  }),
  characterDetail: (langCode: string, item: string): IBreadcrumb => ({
    name: item,
    link: `/${langCode}${routes.characters}/${encodeURI(item)}.html`,
    disabled: true,
  }),
  move: (langCode: string, disabled: boolean = false): IBreadcrumb => ({
    uiKey: UIKeys.stickers,
    link: `/${langCode}${routes.moves}`,
    disabled,
  }),
  moveDetail: (langCode: string, item: string): IBreadcrumb => ({
    name: item,
    link: `/${langCode}${routes.moves}/${encodeURI(item)}.html`,
    disabled: true,
  }),
  element: (langCode: string, disabled: boolean = false): IBreadcrumb => ({
    uiKey: UIKeys.elementalTypeChart,
    link: `/${langCode}${routes.elements}`,
    disabled,
  }),
  statusEffect: (langCode: string, disabled: boolean = false): IBreadcrumb => ({
    uiKey: UIKeys.statusEffect,
    link: `/${langCode}${routes.statusEffect}`,
    disabled,
  }),
  statusEffectDetail: (langCode: string, item: string): IBreadcrumb => ({
    name: item,
    link: `/${langCode}${routes.statusEffect}/${encodeURI(item)}.html`,
    disabled: true,
  }),
  world: (langCode: string, disabled: boolean = false): IBreadcrumb => ({
    uiKey: UIKeys.map,
    link: `/${langCode}${routes.map}`,
    disabled,
  }),
  worldDetail: (langCode: string, item: string): IBreadcrumb => ({
    name: item,
    link: `/${langCode}${routes.map}/${encodeURI(item)}.html`,
    disabled: true,
  }),
  fusion: (langCode: string, disabled: boolean = false): IBreadcrumb => ({
    uiKey: UIKeys.viewMonsters,
    link: `/${langCode}${routes.fusions}`,
    disabled,
  }),
  fusionDetail: (langCode: string, item: string): IBreadcrumb => ({
    uiKey: UIKeys.viewMonsters,
    link: `/${langCode}${routes.fusions}/${encodeURI(item)}.html`,
    disabled: true,
  }),
};

import type { ObjectWithPropsOfValue } from 'helpers/typescriptHacks';

export interface ILocalisation {
  id: number;
  messages: ObjectWithPropsOfValue<string>;
  locale: string;
}

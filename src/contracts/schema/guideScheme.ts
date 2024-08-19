export const AccessMode = {
  auditory: 'auditory',
  textual: 'textual',
  visual: 'visual',
};

export interface IGuideSchema {
  name: string;
  headline: string;
  description?: string;
  about?: string;
  abstract?: string;
  accessMode: string;
  dateModified: string;
  thumbnailUrl?: string;
}

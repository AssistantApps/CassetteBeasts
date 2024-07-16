import path from 'path';
import { getBotPath } from 'services/internal/configService';

export const paths = () => ({
  destinationFolder: path.join(getBotPath(), 'public'),
  gameImagesFolder: path.join(getBotPath(), 'public', 'assets', 'img', 'game'),
  generatedImagesFolder: path.join(getBotPath(), 'public', 'assets', 'img', 'generated'),
  libFolder: path.join(getBotPath(), 'lib'),

  templatesFolder: path.join(getBotPath(), 'src', 'templates'),
  scssFolder: path.join(getBotPath(), 'src', 'scss'),

  intermediateFolder: path.join(getBotPath(), 'dist', 'intermediate'),
  intermediateBaseFolder: path.join(getBotPath(), 'dist', 'base'),
});

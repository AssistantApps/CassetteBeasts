import type { IBoxSelection } from './boxSelection';

export interface ISubAnimationResource {
  id: number;
  type: string;
  length: number;
  loop: boolean;
  tracks_type: string;
  tracks_path: string;
  tracks_interp: string;
  tracks_loop_wrap: string;
  tracks_imported: string;
  tracks_enabled: string;
  tracks_key: string;
  sprite_frame_coords: Array<IBoxSelection>;
}

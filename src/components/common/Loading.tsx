import { AppImage } from 'constants/image';
import { type Component } from 'solid-js';

interface IProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const LoadingSpinner: Component<IProps> = (props: IProps) => {
  let sizeInUnits = 3;
  switch (props.size) {
    case 'xs':
      sizeInUnits = 1;
      break;
    case 'sm':
      sizeInUnits = 2;
      break;
    case 'md':
      sizeInUnits = 3;
      break;
    case 'lg':
      sizeInUnits = 6;
      break;
    case 'xl':
      sizeInUnits = 12;
      break;
  }
  const sizeInPx = `${sizeInUnits * 8}px`;
  return (
    <img
      src={AppImage.loader}
      class="noselect"
      style={{
        width: sizeInPx,
        height: sizeInPx,
      }}
      draggable="false"
      alt="loading"
    />
  );
};

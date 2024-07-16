export interface IImageMetaDataProps {
  format?: string;
  size?: number;
  width?: number;
  height?: number;
  hasAlpha?: boolean;
  compression?: 'av1' | 'hevc';
  resolutionUnit?: 'inch' | 'cm' | undefined;
}

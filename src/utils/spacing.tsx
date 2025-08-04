import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

const guidelineBaseWidth = 414;
const guidelineBaseHeight = 896;

export const scale = (size: number) =>
  (shortDimension / guidelineBaseWidth) * size;

export const verticalScale = (size: number) =>
  (longDimension / guidelineBaseHeight) * size;

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const moderateVerticalScale = (size: number, factor = 0.5) =>
  size + (verticalScale(size) - size) * factor;

export const s = scale;
export const vs = verticalScale;
export const ms = moderateScale;
export const mvs = moderateVerticalScale;
export const screenHeight = height;
export const screenWidth = width;
export const SPACING = 16;
export const RADIUS = 5;

export const spacing = {
  small: ms(8),
  medium: ms(16),
  large: ms(24),
  xlarge: ms(32),
  xxlarge: ms(40),
};

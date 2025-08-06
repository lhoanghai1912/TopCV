import { useTranslation } from 'react-i18next';

export const formatPriceToTy = (price: number): string => {
  const { t } = useTranslation();

  if (!price || isNaN(price)) return t('price.deal');

  if (price >= 1_000_000_000) {
    const billion = price / 1_000_000_000;
    return billion % 1 === 0
      ? `${billion.toFixed(0)} ${t('price.bilion')}` // Hiển thị số nguyên nếu chia hết
      : `${billion.toFixed(2)} ${t('price.bilion')}`; // Hiển thị 2 chữ số thập phân nếu không chia hết
  }

  if (price >= 1_000_000) {
    const million = price / 1_000_000;
    return million % 1 === 0
      ? `${million.toFixed(0)} ${t('price.milion')}`
      : `${million.toFixed(2)} ${t('price.milion')}`;
  }

  if (price >= 1_000) {
    const thousand = price / 1_000;
    return thousand % 1 === 0
      ? `${thousand.toFixed(0)} ${t('price.thousand')}`
      : `${thousand.toFixed(2)} ${t('price.thousand')}`;
  }
  if (price === 0) {
    return `${t('price.deal')}`;
  }
  return `${price.toFixed(0)} `; // Trả về giá trị nếu không thuộc các loại trên
};

export const createArray = (count: number) => Array.from(Array(count).keys());

export const getFormattedNumber = (
  number: number,
  includeDecimals?: boolean
): string => {
  const formatNumber = (number: number): string => {
    const decimalsResult: string = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(number);
    const noDecimalsResult: string = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 0,
    }).format(number);

    return includeDecimals ? decimalsResult : noDecimalsResult;
  };

  if (number > 9999) {
    return `${formatNumber(9999)}+`;
  }
  return formatNumber(number);
};

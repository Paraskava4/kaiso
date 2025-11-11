export const isNumber =
  (
    num
  ) =>
    isNaN(
      +num
    )
      ? false
      : true;

export const addNumberPad =
  (
    num
  ) => {
    return isNumber(
      num
    )
      ? +num >
          0 &&
        +num <
          10
        ? `0${num}`
        : num
      : "";
  };

export const handleCurrency =
  (
    currency
  ) => {
    return (
      isNumber(
        currency
      ) &&
      currency >
        0 &&
      addNumberPad(
        currency.toFixed(
          2
        )
      )
    );
  };

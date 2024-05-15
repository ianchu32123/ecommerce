export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  //計算商品價格
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  //計算運費
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
  //計算稅金(15%)
  state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice).toFixed(2));
  //總金額
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};

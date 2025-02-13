
const calculateProfit = (buyOrder, sellOrder) => {
    const buyPrice = parseFloat(buyOrder.fills[0].price);
    const sellPrice = parseFloat(sellOrder.fills[0].price);
    const quantity = parseFloat(buyOrder.executedQty);
    
    const buyTotal = buyPrice * quantity;
    const sellTotal = sellPrice * quantity;
    const profit = sellTotal - buyTotal;
    
    const percentageProfit = (profit / buyTotal) * 100;

    return {
        buyPrice,
        sellPrice,
        quantity,
        buyTotal,
        sellTotal,
        profit,
        percentageProfit
    };
};

module.exports = calculateProfit
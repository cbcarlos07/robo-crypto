const prepareMsg = profitResult => {
    const content = `
Estratégia: *${profitResult.strategy}*
Preço de compra: *$${profitResult.buyPrice.toFixed(2)}*
Preço de venda: *$${profitResult.sellPrice.toFixed(2)}*
Quantidade *${profitResult.quantity}*
Lucro/prejuizo *$${convertNegativeZero(profitResult.profit).toFixed(2)}*
Percentual *${convertNegativeZero(profitResult.percentageProfit).toFixed(2)}%*\n
    `
    return content
}

const convertNegativeZero = value => {
    return value === 0 ? 0 : value;  // Converte -0 para 0
}

module.exports = prepareMsg
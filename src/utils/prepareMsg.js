const prepareMsg = profitResult => {
    const content = `
Estratégia: *${profitResult.strategy}*
Preço de compra: *$${profitResult.buyPrice.toFixed(2)}*
Preço de venda: *$${profitResult.sellPrice.toFixed(2)}*
Quantidade *${profitResult.quantity}*
Lucro/prejuizo *$${profitResult.profit.toFixed(2)}*
Percentual *${profitResult.percentageProfit.toFixed(2)}%*\n
    `
    return content
}

module.exports = prepareMsg
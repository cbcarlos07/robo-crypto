  /**
   * Small description of your action
   * @title The title displayed in the flow editor
   * @category Custom
   * @author Your_Name
   * @param {string} name - An example string variable
   * @param {any} value - Another Example value
   */
  const myAction = async temp => {
    const { totalProfit, totalPercentageProfit } = temp.response.body[0]
    const profit = totalPercentageProfit < 0 ? 'de prejuízo' : 'de lucro'
    const values = {
      totalProfit: totalProfit.toFixed(2),
      totalPercentageProfit: totalPercentageProfit.toFixed(2),
      profit
    }
    event.state.temp.data = values
  }

  return myAction(temp)

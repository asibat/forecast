module.exports ={
    transformCondition(condition) {
        condition = condition.trim()

        let operator = condition.slice(0, 1)
        if (operator !== '>' && operator !== '<' && operator !== '=') {
            return {
                operator: '=',
                temperature: Number(condition)
            }
        } else {
            const temperature = condition.slice(1, condition.length)

            return {
                operator,
                temperature: Number(temperature)
            }
        }

    }
}

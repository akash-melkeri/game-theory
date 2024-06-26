const strategyA = function strategyA(previousMoves) {
    // Implement your strategy logic here
    // previousMoves is an array of objects containing the results of all previous rounds
    // For example: [{round: 1, strategyA: true, strategyB: false}, ...]
    
    // Example logic: if last move was a win, return true, otherwise return false
    if (previousMoves.length === 0) {
        return Math.random() > 0.5;
    } else {
        const lastMove = previousMoves[previousMoves.length - 1];
        return lastMove.strategyA;
    }
};
const strategyB = function strategyB(previousMoves) {
    // Implement your strategy logic here
    // previousMoves is an array of objects containing the results of all previous rounds
    
    // Example logic: if last move was a loss, return true, otherwise return false
    if (previousMoves.length === 0) {
        return Math.random() > 0.5;
    } else {
        const lastMove = previousMoves[previousMoves.length - 1];
        return !lastMove.strategyB;
    }
};

function testStrategies(strategy1, strategy2, rounds = 10) {
    let previousMoves = [];

    let results = {
        strategy1Wins: 0,
        strategy2Wins: 0,
        draws: 0
    };

    for (let i = 0; i < rounds; i++) {
        const result1 = strategy1(previousMoves);
        const result2 = strategy2(previousMoves);

        const moveResult = {
            round: i + 1,
            strategyA: result1,
            strategyB: result2
        };

        previousMoves.push(moveResult);

        if (result1 && !result2) {
            results.strategy1Wins++;
        } else if (!result1 && result2) {
            results.strategy2Wins++;
        } else {
            results.draws++;
        }
    }

    return results;
}

const rounds = 100; // Number of rounds to test
const results = testStrategies(strategyA, strategyB, rounds);

console.log(`Results after ${rounds} rounds:`);
console.log(`Strategy A wins: ${results.strategy1Wins}`);
console.log(`Strategy B wins: ${results.strategy2Wins}`);
console.log(`Draws: ${results.draws}`);

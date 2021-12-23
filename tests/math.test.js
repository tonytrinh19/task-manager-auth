const { add } = require('../src/math')

test('Add two numbers', async () => {
    const sum = await add(10, 22)
    expect(sum).toBe(32)
})
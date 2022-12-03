vi.setSystemTime(new Date(1640995200000));

console.info = vi.fn().mockName('console.info');
console.error = vi.fn().mockName('console.error');

// @ts-ignore
global.globalLambdaProps = { envName: 'production' };

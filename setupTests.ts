vi.setSystemTime(new Date(1640995200000));

console.info = vi.fn();
console.error = vi.fn();

// @ts-ignore
global.globalLambdaProps = { envName: 'production' };

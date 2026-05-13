# Tests

## Running Tests
```bash
npm test
```

## Test Coverage

### File: `__tests__/auditEngine.test.ts`

| Test | Description |
|---|---|
| 1 | Should return audit result with correct structure |
| 2 | Should calculate annual savings as 12x monthly savings |
| 3 | Should detect overpayment when user pays more than official price |
| 4 | Should return zero savings for correctly priced tools |
| 5 | Should flag isHighSavings as true when savings exceed $500 |
| 6 | Should sum savings across multiple tools |
| 7 | Should return zero savings for empty tools list |

All 7 tests cover the audit engine specifically.
Run `npm test` to execute. All tests should pass.
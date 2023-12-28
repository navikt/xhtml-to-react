import ts from "typescript";
import {expect, test} from 'bun:test';
import {toTypeScript} from "./tsvisitor";

function assertDeepEqual(a, b) {
  expect(a).toEqual(b);
}

// Take the TypeScript AST and format/print as code to a string
function print(ast): string {
  const processedAst = ts.factory.createExpressionStatement(ast);

  const finished = ts.factory.createSourceFile(
    [ast],
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  );

  const printer = ts.createPrinter({newLine: ts.NewLineKind.LineFeed});
  let result = printer
    .printNode(ts.EmitHint.Unspecified, finished, undefined)
    .trim();
  return result;
}

test("Deferred expression", () => {
  const result = toTypeScript("#{foobar}");
  assertDeepEqual(print(result), "foobar");
});

test("Three expressions with some literal in it", () => {
  const result = toTypeScript("#{one}${two}three#{four}");
  assertDeepEqual(print(result), `one + two + "three" + four`);
});

test("Dynamic expression", () => {
  const result = toTypeScript("${trueText}");
  assertDeepEqual(print(result), `trueText`);
});

test("Boolean literal expression (true)", () => {
  const result = toTypeScript("#{true}");
  assertDeepEqual(print(result), `true`);
});

test("Literal integer expression", () => {
  const result = toTypeScript("#{123}");
  assertDeepEqual(print(result), `123`);
});

test("String literal expression (double quote)", () => {
  const result = toTypeScript('#{"apple"}');
  assertDeepEqual(print(result), `"apple"`);
});

test("String literal expression (single quote)", () => {
  const result = toTypeScript("#{'apple'}");
  assertDeepEqual(print(result), `"apple"`);
});

test("Literal expression (string)", () => {
  const result = toTypeScript("volkswagen");
  assertDeepEqual(print(result), `"volkswagen"`);
});

test("Binary expression", () => {
  const result = toTypeScript("#{2 > 1}");
  assertDeepEqual(print(result), `2 > 1`);
});

test("Binary expression (equals)", () => {
  const result = toTypeScript("#{1 == 2}");
  assertDeepEqual(print(result), `1 === 2`);
});

test("Ternary expression", () => {
  const result = toTypeScript("#{true ? 1 : 2}");
  assertDeepEqual(print(result), `true ? 1 : 2`);
});

test("Property access", () => {
  const result = toTypeScript("#{a.b.c}");
  assertDeepEqual(print(result), `a.b.c`);
});

test("not-expression", () => {
  const result = toTypeScript("#{not a}");
  assertDeepEqual(print(result), `!a`);
});

test("empty-expression", () => {
  const result = toTypeScript("#{empty a}");
  assertDeepEqual(print(result), `isEmpty(a)`);
});

/*
test("Illegal expression (not terminated)", () => {
  assert.throws(() => toTypeScript("#{foobar"));
});
*/

test("Complicated expression", () => {
  const result = toTypeScript("#{foobar && 123 ? 1 : 2 == a.b.c}");
  assertDeepEqual(print(result), `foobar && (123 ? 1 : 2 === a.b.c)`);
});

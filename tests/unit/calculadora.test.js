const calculadora = require("../models/calculadora.js");

test("somar 2 + 2 deveria retornar 4", () => {
  const resultado = calculadora.somar(2, 2);
  expect(resultado).toBe(4);
});

test("somar 100 + 5 deveria retornar 105", () => {
  const resultado = calculadora.somar(100, 5);
  expect(resultado).toBe(105);
});

test("somar banana + 5 deveria retornar Error", () => {
  const resultado = calculadora.somar("banana", 5);
  expect(resultado).toBe("Error");
});

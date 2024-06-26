import { validate } from "../src/validateCpf";

test.each(["97456321558", "71428793860", "87748248800"])(
  "Should test a valid CPF: %s",
  function (cpf: any) {
    expect(validate(cpf)).toBe(true);
  }
);

test.each([undefined, null, "11111111111", "123", "1234566789123456789"])(
  "Should test a invalid CPF: %s",
  function (cpf: any) {
    expect(validate(cpf)).toBe(false);
  }
);

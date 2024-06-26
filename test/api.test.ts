import axios from "axios";
import { isParameter } from "typescript";

axios.defaults.validateStatus = function () {
  return true;
};

test("Should add a valid passenger account", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
    passcode: "abc123",
    isDriver: false,
  };
  const output = await axios.post("http://localhost:3000/signup", input);
  expect(output.status).toBe(200);
});

test("Should add a valid driver account", async function () {
  const input = {
    name: "Marty McFly",
    email: `marty.mcfly${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "BTL8827",
    passcode: "321cba",
    isDriver: true,
  };
  const output = await axios.post("http://localhost:3000/signup", input);
  expect(output.status).toBe(200);
});

test("Should try to add an account with an already used e-mail", async function () {
  const sameEmail: string = `emmett.brown${Math.random()}@gmail.com`;
  const input = {
    name: "Emmett Brown",
    email: sameEmail,
    cpf: "71428793860",
    passcode: "dmcdelorian",
    isDriver: false,
  };
  const validAccountOutput = await axios.post(
    "http://localhost:3000/signup",
    input
  );
  expect(validAccountOutput.status).toBe(200);
  const invalidAccountOutput = await axios.post(
    "http://localhost:3000/signup",
    input
  );
  expect(invalidAccountOutput.status).toBe(422);
  expect(invalidAccountOutput.data.status).toBe("error");
  expect(invalidAccountOutput.data.message).toBe(
    "This e-mail is already registered"
  );
});

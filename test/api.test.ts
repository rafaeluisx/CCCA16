import axios from "axios";
import { isParameter } from "typescript";

axios.defaults.validateStatus = function () {
	return true;
}

test("Deve criar uma conta válida para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		passcode: "abc123",
		isDriver: false
	};
		const output = await axios.post("http://localhost:3000/signup", input);
		expect(output.status).toBe(200);
		const outputAccount = await axios.get(`http://localhost:3000/getAccount/${output.data.accountId}`);
		expect(output.data.accountId).toBe(outputAccount.data.account_id);
});

test("Deve criar uma conta válida para motorista", async function(){
	const input = {
		name: "Marty McFly",
		email: `marty.mcfly${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "BTL8827",
		passcode: "321cba",
		isDriver: true
	};
	const output = await axios.post("http://localhost:3000/signup", input);
	expect(output.status).toBe(200);
});
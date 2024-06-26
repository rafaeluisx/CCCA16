import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate } from "./validateCpf";
import pg from "pg-promise/typescript/pg-subset";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const connection = getConnection();
	try {
		const [emailAlreadyUsed] = await connection.query("select * from cccat16.account where email = $1", [req.body.email]);
		if (emailAlreadyUsed) return res.status(422).json("error: This e-mail is already registered");
		if (isInvalidName(req.body.name)) return res.status(422).send("This name is not valid");
		if (isInvalidEmail(req.body.email)) return res.status(422).send("This e-mail is not valid");
		if (!validate(req.body.cpf)) return res.status(422).send("This CPF is not valid");
		if (req.body.isDriver && isInvalidLicensePlate(req.body.carPlate)) return res.status(422).send("This license plate is not valid");
		res.json(await addAccount(crypto.randomUUID(), req, connection));
	} finally {
		await disposeConnection(connection);
	}
});

function getConnection(){
	return pgp()("postgres://postgres:123456@localhost:5432/app");
}

async function disposeConnection(con: pgp.IDatabase<{}, pg.IClient>){
	await con.$pool.end();
}

function isInvalidName(name : string){
	return !name.match(/[a-zA-Z] [a-zA-Z]+/);
}

function isInvalidEmail(email: string) : boolean{
	return !email.match(/^(.+)@(.+)$/);
}

async function addAccount(id: crypto.UUID, req: express.Request, connection: pgp.IDatabase<{}, pg.IClient>): Promise<object>{
	await connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, passcode, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, req.body.name, req.body.email, req.body.cpf, req.body.carPlate, req.body.passcode, !!req.body.isPassenger, !!req.body.isDriver]);
	return {accountId: id};
}

function isInvalidLicensePlate(plate: string): boolean{
	return !plate.match(/^[A-Z]{3}[0-9]{4}$/);
}

app.get("/getAccount/:id", async function (req, res) {
	const connection = getConnection();
	try {
		const id = <crypto.UUID> req.params.id as crypto.UUID;
		const [account] = await connection.query("SELECT * FROM cccat16.account WHERE account_id = $1", [id]);
		res.json(account);
	} catch (error) {
		console.error("Error:", error);
	}
	finally{
		await disposeConnection(connection);
	}
});
app.listen(3000);

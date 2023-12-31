// Packages
import { Sequelize, Model } from "sequelize";
import crypto from "crypto";
import fs from "node:fs";
import * as logger from "../logger.js";
import * as dotenv from "dotenv";

// Dotenv Config
dotenv.config();

// Connect to PostgreSQL database
const sequelize = new Sequelize({
	dialect: "postgres",
	host: process.env.PGHOST,
	username: "select",
	database: "failuremgmt",
	password: "password",
	logging: (data) => {
		logger.debug("PostgreSQL", data);
	},
});

sequelize
	.authenticate()
	.then(() => logger.info("Postgres", "Connected to Postgres"))
	.catch((err) =>
		logger.error("Postgres", `Unable to connect to Postgres\nError: ${err}`)
	);

// Schemas
const schemaFiles = fs
	.readdirSync("./dist/database/schemas")
	.filter((file) => file.endsWith(".js"));
let schemaData = [];

for (const fileName of schemaFiles) {
	import(`./schemas/${fileName}`)
		.then((module) => {
			const file = module.default;
			schemaData[file.name] = file;
		})
		.catch((error) => {
			console.error(error);
		});
}

interface UserType {
	user_id: string;
	server_id: string;
	uuid: string;
	levels: {
		level: number;
		xp: number;
		xp_to_next_level: number;
		lastXPUpdate: Date;
	};
	afk: boolean;
}

// User
class User extends Model implements UserType {
	user_id: string;
	server_id: string;
	uuid: string;
	levels: {
		level: number;
		xp: number;
		xp_to_next_level: number;
		lastXPUpdate: Date;
	};
	afk: boolean;

	static async getUser(user_id, server_id) {
		const data = await User.findOne({
			where: {
				user_id: user_id,
				server_id: server_id,
			},
		});

		return data;
	}

	static async createUser(user_id, server_id) {
		const data = await User.create({
			user_id: user_id,
			server_id: server_id,
			uuid: crypto.randomUUID(),
			levels: {
				level: 1,
				xp: 0,
				lastXPUpdate: new Date(),
				xp_to_next_level: 150,
			},
			afk: false,
		});

		User.sync();

		return data;
	}

	static async updateUser(user_id, server_id, levels) {
		const data = await User.update(
			{
				levels: levels,
			},
			{
				where: {
					user_id: user_id,
					server_id: server_id,
				},
			}
		);

		User.sync();

		return data;
	}

	static async setAFK(user_id, server_id, afk) {
		const data = await User.update(
			{
				afk: afk,
			},
			{
				where: {
					user_id: user_id,
					server_id: server_id,
				},
			}
		);

		User.sync();

		return data;
	}

	static async deleteUser(user_id, server_id) {
		const user = await User.destroy({
			where: {
				user_id: user_id,
				server_id: server_id,
			},
		});

		User.sync();

		return user;
	}

	static async getAllUsers() {
		return await User.findAll();
	}

	static async getAllUsersByServer(server_id) {
		return await User.findAll({
			where: {
				server_id: server_id,
			},
		});
	}
}

// Initialize schemas
const init = () => {
	User.init(schemaData["users"].schema, {
		sequelize: sequelize,
		modelName: schemaData["users"].name,
	});

	sequelize.sync();
};
setTimeout(() => init(), 2000);

// Expose Classes
export { User };

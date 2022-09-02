// Packages
const { Sequelize, Model } = require("sequelize");
const crypto = require("crypto");
const fs = require("node:fs");
const logger = require("../logger");
require("dotenv").config();

// Connect to PostgreSQL database
const sequelize = new Sequelize({
	dialect: "postgres",
	host: process.env.PGHOST,
	username: "select",
	database: "failuremgmt",
	password: "password",
	port: 7399,
	logging: (data) => {
		return;
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
	.readdirSync("./database/schemas")
	.filter((file) => file.endsWith(".js"));
const schemas = {};
const schemaData = {};

for (const file of schemaFiles) {
	const schema = require(`./schemas/${file}`);

	schemaData[schema.name] = schema;
	schemas[schema.name] = sequelize.define(schema.name, schema.schema);
}

// User
class User extends Model {
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
};

init();

// Expose Classes
module.exports = {
	User,
};

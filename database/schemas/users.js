const { DataTypes } = require("sequelize");

const schema = {
	user_id: {
		type: DataTypes.STRING,
	},

	server_id: {
		type: DataTypes.STRING,
	},

	uuid: {
		type: DataTypes.STRING,
		primaryKey: true,
	},

	permission: {
		type: DataTypes.NUMBER,
	},

	levels: {
		type: DataTypes.JSON,

		level: {
			type: DataTypes.NUMBER,
		},

		xp: {
			type: DataTypes.NUMBER,
		},

		xp_to_next_level: {
			type: DataTypes.NUMBER,
		},

		lastXPUpdate: {
			type: DataTypes.DATE,
		},
	},
};

module.exports = {
	name: "users",
	schema: schema,
};

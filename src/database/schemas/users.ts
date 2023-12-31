import { DataTypes } from "sequelize";

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

	afk: {
		type: DataTypes.BOOLEAN,
	},
};

export default {
	name: "users",
	schema: schema,
};

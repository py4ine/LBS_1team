import { db, schema } from '../../config/dbConfig.js'

const login = async () => {

    const query = `SELECT * FROM ${schema}.fire_station_code`;

    try {
        const result = await db.query(query);
        const rowData = result.rows;
        return rowData;
    } catch (error) {
        console.error("Error DAO login:", error);
        // throw new Error(error.message)
    }
}

export default {
    login
    };
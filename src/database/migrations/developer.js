
class Developer {
    /**
     * Run migration on call
     */
    async up(connection) {
        const DEVELOPER_SQL = `CREATE TABLE if not exists developer(
            id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id int unsigned,
            dob DATE,
            phone VARCHAR(50),
            website VARCHAR(50),
            freelancer BIT(1),
            PRIMARY KEY(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );`;

        return await new Promise((resolve, reject) => {
            try {
                const queries = [DEVELOPER_SQL];
                queries.forEach((sql, index) => {
                    connection.query(`${sql}`, (error, rows, fields) => {
                        if(error) {
                            console.log(
                                `Error in query queryIndex ${index} error =${JSON.stringify(error, null, 2)}`
                              );
                        }

                        if(index + 1 === queries.length) {
                            resolve()
                        }
                    })
                   });
            } catch (e) {
                reject(JSON.stringify(e, null, 2))
            }
        })
    }
}

module.exports = new Developer();
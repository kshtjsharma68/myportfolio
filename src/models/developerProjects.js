const db = require('../database/connection');
const Base = require('./base')

function devProjects(connection) {
    this.table = 'projects';
    this.columns = ['user_id', 'name', 'link', 'image'];
    Base.call(this, connection)
}

//Extending the class and setting methods
devProjects.prototype = Object.create(Base.prototype);

devProjects.prototype.runQuery = function() {
    return this.query({sql: this.sql, data: this.data})
                .then(r => r)
                .catch(err => {
                    console.log('query error', err.sqlMessage)
                    return []
                });
}

/**
 * Adding new basic record
 */
devProjects.prototype.add = function({user_id, type, degree, about, clients, projects, hours, teams}) {     
    type = type.join(',');
    this.data = [user_id, type, degree, about, clients, projects, hours, teams];  
    this.sql = "INSERT INTO "+this.table+" ("+this.columns.join(',')+") VALUES (?,?,?,?,?,?,?,?)"; console.log(this.sql)
    return this.runQuery()
}

/**
 * Check if user record exists
 */
devProjects.prototype.ifExists = function({user_id}) {
    this.sql = `SELECT * FROM ${this.table} WHERE user_id = ${user_id}`;
    return this.runQuery();
}

module.exports = new devProjects(db);
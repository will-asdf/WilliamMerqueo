
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var path = require('path');
var migrator = require('./migration/Migrator');

var variables = {
    'db': null,
    'db_name': 'williamdb',
    'started': false
};

var paths = {
    'db_path': variables.db_name,
    'tables_creation': path.join(__dirname, '..', 'sql', 'creation_tables_script.sql')
};

var methods = {
    'init': async function () {
        try {
            
            if (!methods.check_if_exists_database()) {
                await methods.set_database();
                var creation_query = methods.read_sqlfile(paths.tables_creation);
                var population_query = migrator.get_migration_query();
                await methods.execute_script(creation_query);
                await methods.execute_script(population_query);
            }
            else {
                await methods.set_database();
            }
        }
        catch (error) {
            console.log('Se ha presentado el siguiente error al intentar inicializar la abse de datos de sqlite: ' + String(error));
        }
    },
    'check_if_exists_database': function () {
        if (fs.existsSync(paths.db_path)) {
            return true;
        }
        return false;
    },
    'set_database': function () {
        return new Promise(function (resolve, reject) {
            variables.db = new sqlite3.Database(variables.db_name, function (err) {
                if (err) {
                    reject('Se ha presentado un error: ' + string(err));
                }
                else {
                    //Habilitar uso de llaves foráneas
                    variables.db.exec('PRAGMA foreign_keys = ON;', function (error) {
                        if (error) {
                            reject("Pragma statement no funcionó.");
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        });
    },
    'read_sqlfile': function (script_path) {
        var query = fs.readFileSync(script_path, 'utf8').toString();
        query = query.replace(/[\r|\n|\t]/g, " ").replace(/ {2,}/g, " ");

        //quitar el byte order mask, característico al leer contenido de archivos con utf-8
        if (query.charCodeAt(0) === 0xFEFF) {
            query = query.substr(1);
        }
        return query;
    },
    'execute_script': function (query) {
        return new Promise(function (resolve, reject) {
            variables.db.exec(query, function (err) {
                if (err !== null) {
                    reject(err);
                }
                resolve(true);
            });
        });
    },
    'execute_select_script': function (query) {
        return new Promise(function (resolve, reject) {
            variables.db.serialize(() => {
                variables.db.all(query, function (err, data) {
                    if (err !== null) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    },
    'execute_multiple_select_script': async function (queries) {

        let queries_list = queries.split(';');
        let results_list = [];

        try {
            for (let i in queries_list) {
                let query = queries_list[i];
                if (query.trim().length > 0) {
                    let result = await methods.execute_select_script(query + ";");
                    if (result.length > 0) {
                        results_list.push(result);
                    }
                }
            }
            return results_list;
        }
        catch (ex) {
            throw ex;
        }
    }
};

module.exports = methods;
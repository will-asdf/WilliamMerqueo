var jsonParser = require('./JsonParser');
var mapperDB = require('./MapperDB');

var methods = {
    'get_migration_query': function () {
        let queries = [];
        let entities = jsonParser.get_entities();
        entities.forEach(function (entity) {
            let sql_insert_query = mapperDB.get_insert_sentence(entity.name, entity.data);
            queries.push(sql_insert_query);
        });

        return queries.join(' ');
    }
};

module.exports = methods;

var structures = require('./json/StructuresDB.json');

var map_types = {
    integer: "value",
    text: "'value'"
};

var methods = {
    'get_insert_sentence': function (table_name, rows_info) {
        let structure = structures[table_name];
        let { header, row_insert_template } = methods.get_sql_row_header(table_name, structure);
        let rows = methods.get_sql_row_insert(rows_info, structure, row_insert_template);
        return `${header} ${rows};`;
    },
    'map_attr_value': function (attr, value, structure) {
        let db_type = structure[attr];
        if (map_types.hasOwnProperty(db_type)) {
            return map_types[db_type].replace('value', value);
        }
        else {
            throw Error('uuu2');
        }
    },
    'get_sql_row_header': function (table_name, structure) {
        let attrs_list = [];
        for (let attr in structure) {
            if (structure.hasOwnProperty(attr)) {
                attrs_list.push(attr);
            }
        };
        return {
            header: `INSERT INTO ${table_name} (${attrs_list.join(',')}) VALUES`,
            row_insert_template: `({${attrs_list.join('},{')}})`
        };
    },
    'get_sql_row_insert': function (rows_info, structure, row_insert_template) {
        let row_inserts_list = [];
        rows_info.forEach(function (item) {
            let row_insert = row_insert_template;
                for (let attr in structure) {
                    if (structure.hasOwnProperty(attr)) {
                        if (item.hasOwnProperty(attr)) {
                            let row_insert_key = `{${attr}}`;
                            let formatted_value = methods.map_attr_value(attr, item[attr], structure);
                            row_insert = row_insert.replace(row_insert_key, formatted_value);
                        }
                        else {
                            throw Error("uuu");
                        }
                    }
                }
                row_inserts_list.push(row_insert);
            
        });
        return row_inserts_list.join(',');
    }
};

module.exports = methods;
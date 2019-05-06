
var path = require('path');
var dal = require('./DatabaseManager');
var utils = require('./../utils/utilities');

var queries = {
    'get_products_inventory': path.join(__dirname, '..', 'sql', 'get_products_inventory.sql'),
    'get_min_quantity_sold_product': path.join(__dirname, '..', 'sql', 'get_min_quantity_sold_product.sql'),
    'get_max_quantity_sold_product': path.join(__dirname, '..', 'sql', 'get_max_quantity_sold_product.sql'),
    'get_sold_products_by_quantity': path.join(__dirname, '..', 'sql', 'get_sold_products_by_quantity.sql'),
    'get_future_inventory': path.join(__dirname, '..', 'sql', 'get_future_inventory.sql'),
    'get_status_order_products': path.join(__dirname, '..', 'sql', 'get_status_order_products.sql'),
    'get_orders_to_attend': path.join(__dirname, '..', 'sql', 'get_orders_to_attend.sql')
};

var methods = {
    'init': async function () {
        await dal.init();
    },
    'get_products_inventory': async function () {
        let query = dal.read_sqlfile(queries.get_products_inventory);
        let results = await dal.execute_select_script(query);
        return results;
    },
    'get_less_sold_products': async function () {
        let query = dal.read_sqlfile(queries.get_min_quantity_sold_product);
        let results = await dal.execute_multiple_select_script(query);
        return results[0];
    },
    'get_most_sold_products': async function () {
        let query = dal.read_sqlfile(queries.get_max_quantity_sold_product);
        let results = await dal.execute_multiple_select_script(query);
        return results[0];
    },
    'get_future_inventory': async function () {
        let query = dal.read_sqlfile(queries.get_future_inventory);
        let results = await dal.execute_multiple_select_script(query);
        return results[0];
    },
    'get_status_order_products': async function ({ order_id = 1}) {
        let query = dal.read_sqlfile(queries.get_status_order_products);
        query = query.replace('{order_id}', String(order_id));
        let results = await dal.execute_select_script(query);
        return results;
    },
    'get_orders_to_attend': async function () {
        let query = dal.read_sqlfile(queries.get_orders_to_attend);
        let results = await dal.execute_multiple_select_script(query);
        let order_groups = utils.convert_list_to_dict(results[0], 'order_group_id');
        let orders_info = utils.convert_list_to_dict(results[1], 'order_id');

        for (var order_group_id in order_groups) {
            if (order_groups.hasOwnProperty(order_group_id)) {
                let orders_list = order_groups[order_group_id];
                orders_list.forEach(function (order_item) {
                    let products = orders_info[order_item.order_id];
                    order_item['products'] = products;
                });
            }
        }
        return order_groups;
    }
};

module.exports = methods;
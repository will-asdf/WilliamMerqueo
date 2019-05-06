
var { orders } = require('./json/orders-merqueo.json');
var { providers } = require('./json/providers-merqueo.json');
var { inventory } = require('./json/inventory-merqueo.json');
var utils = require('./../../utils/utilities');

var methods = {
    'get_entities': function () {
        let {
            users_dict,
            products_dict,
            orders_list,
            order_product_list
        } = methods.read_orders(orders);

        let {
            providers_list,
            provider_product_list
        } = methods.read_providers(providers, products_dict);

        let {
            inventory_list
        } = methods.read_inventory(inventory, products_dict);

        let entities = [];
        entities.push({ name: 'users', data: utils.convert_dict_to_list(users_dict) });
        entities.push({ name: 'products', data: utils.convert_dict_to_list(products_dict) });
        entities.push({ name: 'orders', data: orders_list});
        entities.push({ name: 'providers', data: providers_list });
        entities.push({ name: 'orders_products', data: order_product_list });
        entities.push({ name: 'providers_products', data: provider_product_list });
        entities.push({ name: 'inventory', data: inventory_list });
        return entities;
    },
    'read_orders': function (orders) {
        let users_dict = {};
        let users_count = 1;

        let products_dict = {};
        let order_product_list = [];

        let orders_list = [];

        orders.forEach(function (order) {
            //Identificar usuario
            if (!users_dict.hasOwnProperty(order.user)) {
                users_dict[order.user] = {
                    user_id: users_count,
                    name: order.user.trim()
                };
                users_count += 1;
            }

            order.products.forEach(function (product) {
                //Identificar asociaciones entre productos y ordenes
                order_product_list.push({
                    product_id: product.id,
                    order_id: order.id,
                    quantity: product.quantity
                });
                //Identificar productos
                if (!products_dict.hasOwnProperty(product.id)) {
                    products_dict[product.id] = {
                        product_id: product.id,
                        name: product.name.trim()
                    };
                }
            });

            orders_list.push({
                order_id: order.id,
                priority: order.priority,
                address: order.address.trim(),
                user_id: users_dict[order.user].user_id,
                delivery_date: order.deliveryDate.trim()
            });
        });

        return {
            users_dict,
            products_dict,
            orders_list,
            order_product_list
        };
    },
    'read_providers': function (providers, products_dict) {
        let providers_list = [];
        let provider_product_list = [];
        providers.forEach(function (provider) {
            //Identificar proveedores
            providers_list.push({
                provider_id: provider.id,
                name: provider.name
            });
            
            provider.products.forEach(function (product) {
                //Crear un producto sin nombre si no está en el diccionario de productos
                if (!products_dict.hasOwnProperty(product.productId)) {
                    products_dict[product.productId] = {
                        product_id: product.productId,
                        name: 'sin nombre'
                    };
                }
                //Identificar asociaciones entre productos y proveedores
                provider_product_list.push({
                    provider_id: provider.id,
                    product_id: product.productId
                });
            });
        });

        return {
            providers_list,
            provider_product_list
        };
    },
    'read_inventory': function (inventory, products_dict) {
        let inventory_count = 1;
        let inventory_list = [];

        inventory.forEach(function (inventory_item) {
            // Crear un producto sin nombre si no está en el diccionario de productos
            if (!products_dict.hasOwnProperty(inventory_item.id)) {
                products_dict[inventory_item.id] = {
                    product_id: inventory_item.id,
                    name: 'sin nombre'
                };
            }
            //Identificar registros de inventario
            inventory_list.push({
                inventory_id: inventory_count,
                product_id: inventory_item.id,
                quantity: inventory_item.quantity,
                inventory_date: inventory_item.date
            });
            inventory_count += 1;
        });

        return {
            inventory_list
        };
    }
};

module.exports = methods;
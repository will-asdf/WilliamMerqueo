var methods = {
    'convert_dict_to_list': function (dict) {
        let list = [];
        for (var attr in dict) {
            if (dict.hasOwnProperty(attr)) {
                list.push(dict[attr]);
            }
        }
        return list;
    },
    'convert_list_to_dict': function (list, key, unique_per_key = false) {
        let dict = {};
        list.forEach(function (item) {
            if (item.hasOwnProperty(key)) {
                let key_value = item[key];
                if (unique_per_key) {
                    dict[key_value] = item;
                }
                else {
                    if (!dict.hasOwnProperty(key_value)) {
                        dict[key_value] = [];
                    }
                    dict[key_value].push(item);
                }
            }
        });
        return dict;
    }
};

module.exports = methods;
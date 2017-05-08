var dataHelpers = {
    countOccurences: function(data, key) {
        var agg = _.groupBy(data, key)
        var sorted_object_keys = Object.keys(agg)
        var count_keys = []
        sorted_object_keys.map(function(key, i) {
            var obj = {}
            obj.key = key;
            obj.count = agg[key].length
            count_keys.push(obj)
        })

        count_keys.sort(function(a, b) {
            return parseFloat(b.count) - parseFloat(a.count);
        });

        return count_keys;
    },

    getUniqueKeys: function(data, key) {
        var arr = [];
        data.map(function(obj) {
            if (arr.indexOf(obj[key]) == -1) {
                arr.push(obj[key])
            }
        })
        return (arr)
    },
	sortBasedOnArray: function(sorter_array, main_array, key) {
        var sortee_array = main_array;
        sortee_array.sort(function(a, b) {
            return sorter_array.indexOf(a[key]) < sorter_array.indexOf(b[key]) ? -1 : 1;
        });

        return sortee_array;
    }
}

module.exports = dataHelpers

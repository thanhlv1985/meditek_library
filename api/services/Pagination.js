var moment = require('moment');
module.exports = function(data, primaryKeyModel) {
    if (!_.isEmpty(data)) {
        //get all Model
        var arrModelPagination = [];
        var pagination = {
            limit: data.Limit,
            offset: data.Offset,
            order: []
        };
        _.forEach(data, function(arrPagination, indexPagination) {
            if (!_.isEmpty(arrPagination) &&
                _.isArray(arrPagination)) {
                _.forEach(arrPagination, function(objPagination, modelName) {
                    if (!_.isEmpty(objPagination) &&
                        _.isObject(objPagination)) {
                        _.forEach(objPagination, function(modelPagination, modelName) {
                            if (!_.isEmpty(modelPagination) &&
                                !_.isUndefined(modelName) &&
                                !_.isNull(modelName)) {
                                arrModelPagination.push(modelName);
                            }
                        });
                    }
                });
            }
        });
        arrModelPagination = _.uniq(arrModelPagination);
        //create array whereclause in object pagination
        _.forEach(arrModelPagination, function(modelName, indexModel) {
            pagination[modelName] = [];
        });
        //get filter params
        if (!_.isUndefined(data.Filter) &&
            !_.isNull(data.Filter) &&
            _.isArray(data.Filter)) {
            var Filter = data.Filter;
            Filter.forEach(function(filter, index) {
                if (!_.isUndefined(filter) &&
                    !_.isNull(filter) &&
                    _.isObject(filter)) {
                    var keyModel = Object.keys(filter)[0];
                    if (_.isObject(filter[keyModel])) {
                        for (var keyFilter in filter[keyModel]) {
                            if (!_.isUndefined(keyFilter) &&
                                !_.isNull(keyFilter) &&
                                !_.isUndefined(filter[keyModel][keyFilter]) &&
                                !_.isNull(filter[keyModel][keyFilter])) {
                                //check format value is date
                                var tempFilter = {};
                                if (moment(filter[keyModel][keyFilter], 'YYYY-MM-DD Z', true).isValid() ||
                                    moment(filter[keyModel][keyFilter], 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                    //data valid date
                                    var dateActual = moment(filter[keyModel][keyFilter], 'YYYY-MM-DD HH:mm:ss Z').toDate();
                                    var dateAdded = moment(dateActual).add(1, 'day').toDate();
                                    var tempFilter = {};
                                    tempFilter[keyFilter] = {
                                        '$gte': dateActual,
                                        '$lt': dateAdded
                                    };
                                } else if (!_.isUndefined(filter[keyModel][keyFilter]) &&
                                    !_.isNull(filter[keyModel][keyFilter]) &&
                                    filter[keyModel][keyFilter].length !== 0) {
                                    tempFilter[keyFilter] = filter[keyModel][keyFilter];
                                }
                                //data invalid date
                                if (_.isArray(pagination[keyModel])) {
                                    pagination[keyModel].push(tempFilter);
                                }
                            }
                        }
                    }
                }
            });
        }
        //get seach params
        if (!_.isUndefined(data.Search) &&
            !_.isNull(data.Search) &&
            _.isArray(data.Search)) {
            var Search = data.Search;
            Search.forEach(function(search, index) {
                if (!_.isUndefined(search) &&
                    !_.isNull(search) &&
                    _.isObject(search)) {
                    var keyModel = Object.keys(search)[0];
                    if (_.isObject(search[keyModel])) {
                        for (var keySearch in search[keyModel]) {
                            if (!_.isUndefined(keySearch) &&
                                !_.isNull(keySearch) &&
                                !_.isUndefined(search[keyModel][keySearch]) &&
                                !_.isNull(search[keyModel][keySearch])) {
                                var tempSearch = {};
                                if (keySearch === 'FullName') {
                                    var arraySearch = search[keyModel][keySearch].split(' ');
                                    var arraySearchObject = [];
                                    arraySearch.forEach(function(value, index) {
                                        arraySearchObject.push({
                                            '$like': '%' + value + '%'
                                        });
                                    });
                                    tempSearch = {
                                        '$or': {
                                            FirstName: {
                                                '$or': arraySearchObject
                                            },
                                            MiddleName: {
                                                '$or': arraySearchObject
                                            },
                                            LastName: {
                                                '$or': arraySearchObject
                                            }
                                        }
                                    };

                                } else {
                                    //case normal
                                    tempSearch[keySearch] = {
                                        '$like': '%' + search[keyModel][keySearch] + '%'
                                    };
                                }
                                if (_.isArray(pagination[keyModel])) {
                                    pagination[keyModel].push(tempSearch);
                                }
                            }
                        }
                    }

                }
            });
        }
        //get range params
        if (!_.isUndefined(data.Range) &&
            !_.isNull(data.Range) &&
            _.isArray(data.Range)) {
            var Range = data.Range;
            Range.forEach(function(range, index) {
                if (!_.isUndefined(range) &&
                    !_.isNull(range) &&
                    _.isObject(range)) {
                    var keyModel = Object.keys(range)[0];
                    if (_.isObject(range[keyModel])) {
                        for (var keyRange in range[keyModel]) {
                            if (!_.isUndefined(keyRange) &&
                                !_.isNull(keyRange) &&
                                !_.isUndefined(range[keyModel][keyRange]) &&
                                !_.isNull(range[keyModel][keyRange])) {
                                var start = null,
                                    end = null;
                                if (moment(range[keyModel][keyRange][0], 'YYYY-MM-DD Z', true).isValid() ||
                                    moment(range[keyModel][keyRange][0], 'YYYY-MM-DD HH:mm:ss Z', true).isValid() ||
                                    moment(range[keyModel][keyRange][1], 'YYYY-MM-DD Z', true).isValid() ||
                                    moment(range[keyModel][keyRange][1], 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                    if (moment(range[keyModel][keyRange][0], 'YYYY-MM-DD Z', true).isValid() ||
                                        moment(range[keyModel][keyRange][0], 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                        start = moment(range[keyModel][keyRange][0], 'YYYY-MM-DD HH:mm:ss Z').toDate();
                                    }
                                    if (moment(range[keyModel][keyRange][1], 'YYYY-MM-DD Z', true).isValid() ||
                                        moment(range[keyModel][keyRange][1], 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                        end = moment(range[keyModel][keyRange][1], 'YYYY-MM-DD HH:mm:ss Z');
                                        end = moment(end).add(1, 'day').toDate();
                                    }
                                } else {
                                    if (range[keyModel][keyRange][0] &&
                                        range[keyModel][keyRange][0].length !== 0) {
                                        start = range[keyModel][keyRange][0];
                                    }
                                    if (range[keyModel][keyRange][1] &&
                                        range[keyModel][keyRange][1].length !== 0) {
                                        end = range[keyModel][keyRange][1];
                                    }
                                }
                                var tempRange = {};
                                tempRange[keyRange] = {};
                                if (!_.isUndefined(start) &&
                                    !_.isNull(start)) {
                                    tempRange[keyRange]['$gte'] = start;
                                }
                                if (!_.isUndefined(end) &&
                                    !_.isNull(end)) {
                                    tempRange[keyRange]['$lt'] = end;
                                }
                                if (!_.isUndefined(tempRange[keyRange]) &&
                                    !_.isNull(tempRange[keyRange]) &&
                                    !_.isEmpty(tempRange[keyRange])) {
                                    if (_.isArray(pagination[keyModel])) {
                                        pagination[keyModel].push(tempRange);
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
        //get order params
        if (!_.isUndefined(data.Order) &&
            !_.isNull(data.Order) &&
            _.isArray(data.Order)) {
            var Order = data.Order;
            Order.forEach(function(order, index) {
                if (!_.isUndefined(order) &&
                    !_.isNull(order) &&
                    _.isObject(order)) {
                    var keyModel = Object.keys(order)[0];
                    if (_.isObject(order[keyModel])) {
                        for (var keyOrder in order[keyModel]) {
                            if (!_.isUndefined(keyOrder) &&
                                !_.isNull(keyOrder) &&
                                !_.isUndefined(order[keyModel][keyOrder]) &&
                                !_.isNull(order[keyModel][keyOrder])) {
                                var tempOrder = [];
                                if (HelperService.CheckExistData(primaryKeyModel) &&
                                    primaryKeyModel.name === keyModel) {
                                    tempOrder = [keyOrder, order[keyModel][keyOrder]];
                                } else {
                                    tempOrder = [sails.models[keyModel.toLowerCase()], keyOrder, order[keyModel][keyOrder]];
                                }
                                pagination.order.push(tempOrder);
                            }
                        }
                    }

                }
            });
        }
        return pagination;
    } else {
        return [];
    }
};

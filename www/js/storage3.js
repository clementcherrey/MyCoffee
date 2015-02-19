

window.startApp = function () {
    var self = this;
    window.db = window.openDatabase("WineCellar", "1.0", "WineCellar Demo DB", 200000);
    var wineDAO = new WineDAO(self.db);
    wineDAO.populate(function () {
        this.templateLoader.load(['wine-list', 'wine-details', 'wine-list-item'], function () {
            self.app = new AppRouter();
            Backbone.history.start();
        });
    });
};

window.WineDAO = function (db) {
    this.db = db;
};

 
_.extend(window.WineDAO.prototype, {
    findAll:function (callback) {
        this.db.transaction(
            function (tx) {
                var sql = "SELECT * FROM store ORDER BY name";
                tx.executeSql(sql, [], function (tx, results) {
                    var len = results.rows.length;
                    var stores = [];
                    for (var i = 0; i < len; i++) {
                        stores[i] = results.rows.item(i);
                    }
                    callback(store);
                });
            },
            function (tx, error) {
                alert("Transaction Error: " + error);
            }
        );
    }
 
});



Backbone.sync = function (method, model, options) {
	 
    var dao = new model.dao(window.db);
 
    switch (method) {
        case "read":
            if (model.id)
                dao.find(model, function (data) {
                    options.success(data);
                });
            else
                dao.findAll(function (data) {
                    options.success(data);
                });
            break;
        case "create":
            dao.create(model, function (data) {
                options.success(data);
            });
            break;
        case "update":
            dao.update(model, function (data) {
                options.success(data);
            });
            break;
        case "delete":
            dao.destroy(model, function (data) {
                options.success(data);
            });
            break;
    }
 
};
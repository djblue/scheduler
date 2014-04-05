// A simple module to setup default REST routes for mongoose models.
// (mongoose models required!)

// List all models in the database.
exports.list = function (Model) {
    return function (req, res) {
        var query = Model.find();

        if (!!req.query.skip && req.query.skip > 0) {
            query.skip(Number(req.query.skip));
        }

        if (!!req.query.limit && req.query.limit > 0) {
            query.limit(Number(req.query.limit));
        }

        if (!!req.query.expand) {
            query.populate(req.query.expand);
        }
            
        query.exec(function (err, models) {
            if (err) {
                res.json(500, err);
            } else {
                res.json(models);
            }
        });

    };
};

// Add a new model to the database.
exports.add = function (Model) {
    return function (req, res) {
        var model = new Model(req.body);
        model.save(function (err, model) {
            if (err) {
                console.log(err);
                res.json(500, err);
            } else {
                res.json(201, model);
            }
        });
    };
}; 

// Update a single food item by id.
exports.update = function (Model) {
    return function (req, res) { 
        Model.findByIdAndUpdate(req.params.id, req.body)
            .exec(function (err, model) {
                if (err) {
                    res.json(500, err);
                } else {
                    res.json(model);
                }
            });
    };
};

// Remove a single model item by id.
// Restructure to trigger post/pre remove event on Mongoose objects
// https://github.com/LearnBoost/mongoose/issues/498  to read more about
// why this was necessary.
exports.remove = function (Model) {
    return function (req, res) {
        Model.findById(req.params.id, function (err, model) {
            if (err) {
                res.json(500, err);
            } else {
                model.remove(function (err, model) {
                    if (err) {
                        res.json(500, err);
                    } else {
                        res.json(model);
                    }
                });
            }
        }); 
    };
};

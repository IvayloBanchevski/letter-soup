const Teacher = require('../classes/Teacher');
const Collection = require('../classes/Collection');

module.exports.registerTeacher = function(req, res) {
    //TODO: Validate input!
    Teacher.register(req.body.teacher)
        .then(function(response) {
            res.send(response);
        }, function(error) {
            // TODO: Handle error
            res.status(500).send(error);
        });
};

module.exports.login = function(req, res) {
    Teacher.authenticate(req.body.email, req.body.password)
        .then(function(response) {
            res.send(response);
        }, function(error) {
            res.status(500).send(error.message);
        });
};

module.exports.createCollection = function(req, res) {
    const title = String(req.body.collection.title);;
    const category = String(req.body.collection.category);;
    const words = req.body.collection.words.map(function (word) {
        return String(word);
    });
    Collection
        .createCollection(req.decoded.email, title, words, category)
        .then(function(collection) {
            res.send("Колекцията е създадена успешно!");
        }, function(error) {
            // TODO: Log error
            res.status(500).send('Възникна грешка при създаване на колекцията!');
        });
};

// Gets collection by id if no id is provided all teacher's collections are returned
module.exports.getCollection = function(req, res) {
    const collectionId = req.params.collectionId === undefined 
        ? undefined
        : String(req.params.collectionId);
    const collection = new Collection(req.decoded.email, collectionId);
    collection
        .getCollections()
        .then(function(collections) {
            res.send(collections);
        }, function(error) {
            cosole.log(error);
            res.status(500).send('Възникна грешка! Моля, опитайте пак.');
        });
};

module.exports.editCollection = function(req, res) {
    const collectionObj = req.body.collection;
    const collectionId = String(req.params.collectionId);
    const newTitle = String(collectionObj.title);
    const newCategory = String(collectionObj.category);
    const newWords = collectionObj.words.map(w => { return String(w) });
    const collection = new Collection(req.decoded.email, collectionId);
    collection
        .update(newTitle, newWords, newCategory)
        .then(function() {
            res.send('Колекцията е променена успешно!');
        }, function(error) {
            console.log(error);
            res.status(500).send('Възникна грешка при редакцията на колекцията!');
        });
};
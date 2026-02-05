const Collection = require("./collection");

const recipes = new Collection([
    { id: 1, name: "Pancakes", ingredients: ["flour", "milk", "eggs"]},
    { id: 2, name: "Spaghetti", ingredients: ["pasta", "tomato sauce", "ground beef"]},
    { id: 3, name: "Chicken Salad", ingredients: ["chicken", "lettuce", "tomatoes", "cucumbers"]},
    { id: 4, name: "Beef Stew", ingredients: ["beef", "potatoes", "carrots", "peas"]},
    { id: 5, name: "Fish Tacos", ingredients: ["fish", "tortillas", "avocado", "salsa"]},
]);

module.exports = recipes;
const Collection = require("./collection");

const books = new Collection([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald"},
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee"},
    { id: 3, title: "1984", author: "George Orwell"},
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen"},
    { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger"},
    { id: 6, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling"},
    { id: 7, title: "Harry Potter and the Chamber of Secrets", author: "J.K. Rowling"},
    { id: 8, title: "Harry Potter and the Prisoner of Azkaban", author: "J.K. Rowling"},
    { id: 9, title: "Harry Potter and the Goblet of Fire", author: "J.K. Rowling"},
    { id: 10, title: "Harry Potter and the Order of the Phoenix", author: "J.K. Rowling"},
    { id: 11, title: "Harry Potter and the Half-Blood Prince", author: "J.K. Rowling"},
    { id: 12, title: "Harry Potter and the Deathly Hallows", author: "J.K. Rowling"},
    { id: 13, title: "The Hobbit", author: "J.R.R. Tolkien"},
    { id: 14, title: "The Lord of the Rings: The Fellowship of the Ring", author: "J.R.R. Tolkien"},
    { id: 15, title: "The Lord of the Rings: The Two Towers", author: "J.R.R. Tolkien"},
    { id: 16, title: "The Lord of the Rings: The Return of the King", author: "J.R.R. Tolkien"}, 
]);

const mangas = new Collection([
    { id: 1, title: "Naruto", author: "Masashi Kishimoto"},
    { id: 2, title: "One Piece", author: "Eiichiro Oda"},
    { id: 3, title: "Attack on Titan", author: "Hajime Isayama"},
    { id: 4, title: "My Hero Academia", author: "Kohei Horikoshi"},
    { id: 5, title: "Death Note", author: "Tsugumi Ohba"},
]);

const comics = new Collection([
    { id: 1, title: "Batman", author: "DC Comics"},
    { id: 2, title: "Spider-Man", author: "Marvel Comics"},
    { id: 3, title: "Superman", author: "DC Comics"},
    { id: 4, title: "The Walking Dead", author: "Robert Kirkman"},
    { id: 5, title: "X-Men", author: "Marvel Comics"},
]);

const digitalMedia = new Collection([
    { id: 1, title: "Kindle E-books", author: "Amazon"},
    { id: 2, title: "Audiobooks", author: "Audible"},
    { id: 3, title: "Graphic Novels", author: "Various"},
]);

module.exports = {
    books,
    mangas,
    comics,
    digitalMedia
};

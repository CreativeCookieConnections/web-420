const app = require("../src/app");
const request = require("supertest");

describe("Chapter 5: API Tests", () => {
  it("should return an array of books", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

      res.body.forEach((book) => {
        expect(book).toHaveProperty("id");
        expect(book).toHaveProperty("title");
        expect(book).toHaveProperty("author");

      });
    });

    it("should return a single book", async () => {
      const res = await request(app).get("/api/books/1");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("title", "The Great Gatsby");
      expect(res.body).toHaveProperty("author", "F. Scott Fitzgerald");
    });

    it("should return a 400 error if the id is not a number", async () => {
      const res = await request(app).get("/api/books/foo");
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Input must be a number");
    });

    it("should return an array of mangas", async () => {
      const res = await request(app).get("/api/mangas");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);

      res.body.forEach((manga) => {
        expect(manga).toHaveProperty("id");
        expect(manga).toHaveProperty("title");
        expect(manga).toHaveProperty("author");
      });
    });

    it("should return a single manga", async () => {
      const res = await request(app).get("/api/mangas/1");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("title", "Naruto");
      expect(res.body).toHaveProperty("author", "Masashi Kishimoto");
    });

    it("should return a 400 error if the manga id is not a number", async () => {
      const res = await request(app).get("/api/mangas/bar");
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Input must be a number");
    });

    it("should return an array of comics", async () => {
      const res = await request(app).get("/api/comics");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);

      res.body.forEach((comic) => {
        expect(comic).toHaveProperty("id");
        expect(comic).toHaveProperty("title");
        expect(comic).toHaveProperty("author");
      });
    });

    it("should return a single comic", async () => {
      const res = await request(app).get("/api/comics/1");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("title", "Batman");
      expect(res.body).toHaveProperty("author", "DC Comics");
    });

    it("should return a 400 error if the comic id is not a number", async () => {
      const res = await request(app).get("/api/comics/baz");
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Input must be a number");
    });

    it("should return an array of digital media", async () => {
      const res = await request(app).get("/api/digitalMedia");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      res.body.forEach((media) => {
        expect(media).toHaveProperty("id");
        expect(media).toHaveProperty("title");
        expect(media).toHaveProperty("author");
      });
    });

    // Adds a new book to the mock database and returns a 201 status code if successful.
    it("should return a 201 status code when adding a new book, manga, comic, or digital media", async() => {
      const res = await request(app)
      .post("/api/books")
      .send({
        id: 99,
        title: "New Book",
        author: "Author Name"
      });
      const resManga = await request(app)
      .post("/api/mangas")
      .send({
        id: 99,
        title: "New Manga",
        author: "Author Name"
      });
      const resComic = await request(app)
      .post("/api/comics")
      .send({
        id: 99,
        title: "New Comic",
        author: "Author Name"
      });
      const resDigitalMedia = await request(app)
      .post("/api/digitalMedia")
      .send({
        id: 99,
        title: "New Digital Media",
        author: "Author Name"
      });

      expect(res.statusCode).toEqual(201);
      expect(resManga.statusCode).toEqual(201);
      expect(resComic.statusCode).toEqual(201);
      expect(resDigitalMedia.statusCode).toEqual(201);
    });

    //Return 204 status code when deleting a book, manga, comic, or digital media by ID.
    it("should return a 204 status code when deleting a book, manga, comic, or digital media", async () => {
      const res = await request(app).delete("/api/books/99");
      const resManga = await request(app).delete("/api/mangas/99");
      const resComic = await request(app).delete("/api/comics/99");
      const resDigitalMedia = await request(app).delete("/api/digitalMedia/99");

      expect(res.statusCode).toEqual(204);
      expect(resManga.statusCode).toEqual(204);
      expect(resComic.statusCode).toEqual(204);
      expect(resDigitalMedia.statusCode).toEqual(204);
    });

    // Chapter 5: API Tests - Update a book, manga, comic, or digital media and return 204 Status Code, Return a 400 status code when using a non-numeric ID, and return a 400 status code when updating a book with a missing title.

    // Updates a book, manga, comic, or digital media by ID and returns a 204 status code if successful.
    it("should return a 204 status code when updating a book, manga, comic, or digital media", async () => {
      const res = await request(app)
        .put("/api/books/1")
        .send({ title: "Updated Book" });
      const resManga = await request(app)
        .put("/api/mangas/1")
        .send({ title: "Updated Manga" });
      const resComic = await request(app)
        .put("/api/comics/1")
        .send({ title: "Updated Comic" });
      const resDigitalMedia = await request(app)
        .put("/api/digitalMedia/1")
        .send({ title: "Updated Digital Media" });

      const updatedBook = await request(app).get("/api/books/1");
      const updatedManga = await request(app).get("/api/mangas/1");
      const updatedComic = await request(app).get("/api/comics/1");
      const updatedDigitalMedia = await request(app).get("/api/digitalMedia/1");

      expect(res.statusCode).toEqual(204);
      expect(resManga.statusCode).toEqual(204);
      expect(resComic.statusCode).toEqual(204);
      expect(resDigitalMedia.statusCode).toEqual(204);
      expect(updatedBook.body.title).toEqual("Updated Book");
      expect(updatedManga.body.title).toEqual("Updated Manga");
      expect(updatedComic.body.title).toEqual("Updated Comic");
      expect(updatedDigitalMedia.body.title).toEqual("Updated Digital Media");
    });

    // Return a 400 error if id is not a number when updating a book, manga, comic, or digital media.
    it("should return a 400 error if the id is not a number when updating a book, manga, comic, or digital media", async () => {
      const res = await request(app)
        .put("/api/books/foo")
        .send({ title: "Updated Book" });
      const resManga = await request(app)
        .put("/api/mangas/bar")
        .send({ title: "Updated Manga" });
      const resComic = await request(app)
        .put("/api/comics/baz")
        .send({ title: "Updated Comic" });
      const resDigitalMedia = await request(app)
        .put("/api/digitalMedia/qux")
        .send({ title: "Updated Digital Media" });

      expect(res.statusCode).toEqual(400);
      expect(resManga.statusCode).toEqual(400);
      expect(resComic.statusCode).toEqual(400);
      expect(resDigitalMedia.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Input must be a number");
      expect(resManga.body.message).toEqual("Input must be a number");
      expect(resComic.body.message).toEqual("Input must be a number");
      expect(resDigitalMedia.body.message).toEqual("Input must be a number");
    });

    // Return a 400 error when updating a book, manga, comic, or digital media if the title is missing
    it("should return a 400 error if the title is missing when updating a book, manga, comic, or digital media", async () => {
      const res = await request(app)
        .put("/api/books/1")
        .send({ author: "Updated Author" });
      const resManga = await request(app)
        .put("/api/mangas/1")
        .send({ author: "Updated Author" });
      const resComic = await request(app)
        .put("/api/comics/1")
        .send({ author: "Updated Author" });
      const resDigitalMedia = await request(app)
        .put("/api/digitalMedia/1")
        .send({ author: "Updated Author" });

      expect(res.statusCode).toEqual(400);
      expect(resManga.statusCode).toEqual(400);
      expect(resComic.statusCode).toEqual(400);
      expect(resDigitalMedia.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Title is required");
      expect(resManga.body.message).toEqual("Title is required");
      expect(resComic.body.message).toEqual("Title is required");
      expect(resDigitalMedia.body.message).toEqual("Title is required");
    });

    it("should return a 404 error when updating a non-existent id", async () => {
      const res = await request(app)
        .put("/api/books/9999")
        .send({ title: "Does Not Exist" });
      const resManga = await request(app)
        .put("/api/mangas/9999")
        .send({ title: "Does Not Exist" });
      const resComic = await request(app)
        .put("/api/comics/9999")
        .send({ title: "Does Not Exist" });
      const resDigitalMedia = await request(app)
        .put("/api/digitalMedia/9999")
        .send({ title: "Does Not Exist" });

      expect(res.statusCode).toEqual(404);
      expect(resManga.statusCode).toEqual(404);
      expect(resComic.statusCode).toEqual(404);
      expect(resDigitalMedia.statusCode).toEqual(404);
    });

    it("should return a single digital media item", async () => {
      const res = await request(app).get("/api/digitalMedia/1");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("title", "Updated Digital Media");
      expect(res.body).toHaveProperty("author", "Amazon");
    });

    it("should return a 400 error if the digital media id is not a number", async () => {
      const res = await request(app).get("/api/digitalMedia/qux");
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Input must be a number");
    });
  });



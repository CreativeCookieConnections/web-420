const app = require("../src/app");
const request = require("supertest");

describe("HandsOn 3.1: API Tests", () => {
  it("it should return an array of books", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

      res.body.forEach((book) => {
        expect(book).toHaveProperty("id");
        expect(book).toHaveProperty("title");
        expect(book).toHaveProperty("author");

      });
    });

    it("it should return a single book", async () => {
      const res = await request(app).get("/api/books/1");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("title", "The Great Gatsby");
      expect(res.body).toHaveProperty("author", "F. Scott Fitzgerald");
    });

    it("it should return a 400 error if the id is not a number", async () => {
      const res = await request(app).get("/api/books/foo");
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Input must be a number");
    });

    it("it should return an array of mangas", async () => {
      const res = await request(app).get("/api/mangas");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);

      res.body.forEach((manga) => {
        expect(manga).toHaveProperty("id");
        expect(manga).toHaveProperty("title");
        expect(manga).toHaveProperty("author");
      });
    });

    it("it should return a single manga", async () => {
      const res = await request(app).get("/api/mangas/1");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("title", "Naruto");
      expect(res.body).toHaveProperty("author", "Masashi Kishimoto");
    });

    it("it should return a 400 error if the manga id is not a number", async () => {
      const res = await request(app).get("/api/mangas/bar");
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Input must be a number");
    });

    it("it should return an array of comics", async () => {
      const res = await request(app).get("/api/comics");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);

      res.body.forEach((comic) => {
        expect(comic).toHaveProperty("id");
        expect(comic).toHaveProperty("title");
        expect(comic).toHaveProperty("author");
      });
    });

    it("it should return a single comic", async () => {
      const res = await request(app).get("/api/comics/1");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("title", "Batman");
      expect(res.body).toHaveProperty("author", "DC Comics");
    });

    it("it should return a 400 error if the comic id is not a number", async () => {
      const res = await request(app).get("/api/comics/baz");
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Input must be a number");
    });

    it("it should return an array of digital media", async () => {
      const res = await request(app).get("/api/digitalMedia");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      res.body.forEach((media) => {
        expect(media).toHaveProperty("id");
        expect(media).toHaveProperty("title");
        expect(media).toHaveProperty("author");
      });
    });

    it("it should return a single digital media item", async () => {
      const res = await request(app).get("/api/digitalMedia/1");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("title", "Kindle E-books");
      expect(res.body).toHaveProperty("author", "Amazon");
    });

    it("it should return a 400 error if the digital media id is not a number", async () => {
      const res = await request(app).get("/api/digitalMedia/qux");
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Input must be a number");
    });
  });



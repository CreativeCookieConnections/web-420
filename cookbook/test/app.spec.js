const app = require("../src/app");
const request = require("supertest");

describe("Chapter 3: API Tests", () => {
  it("it should return an array of recipes", async () => {
    const res = await request(app).get("/api/recipes");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((recipe) => {
      expect(recipe).toHaveProperty("id");
      expect(recipe).toHaveProperty("name");
      expect(recipe).toHaveProperty("ingredients");
    });
    });

    it("it should return a single recipe", async () => {
      const res = await request(app).get("/api/recipes/1");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id", 1);
      expect(res.body).toHaveProperty("name", "Pancakes");
      expect(res.body).toHaveProperty("ingredients", ["flour", "milk", "eggs"]);
    });

  // Return 201 status code when adding a new recipe

  it("should return a 201 status code when adding a new recipe", async () => {
    const res = await request(app)
      .post("/api/recipes")
      .send({
        id: 99,
        name: "Grilled Cheese",
        ingredients: ["bread", "cheese", "butter"],
      });

    expect(res.statusCode).toEqual(201);
  });

  // Return 204 status code when deleting a recipe

  it("it should return a 204 status code when deleting a recipe", async () => {
    const res = await request(app).delete("/api/recipes/99");

    expect(res.statusCode).toEqual(204);
  });

  // Return 204 Status Code when updating a recipe

  it("should return a 204 status code when updating a recipe", async () => {
    const res = await request(app).put("/api/recipes/1").send({
      name: "Pancakes",
      ingredients: ["flour", "milk", "eggs", "sugar"],
    })

    expect(res.statusCode).toEqual(204);
  })

  // Chapter 6: Securing API

  // Check if 200 status code is returned with a message of "Registration successful" when registering a new user
  it("should return a 200 status code with a message of 'Registration successful' when registering a new user", async () => {
    const res = await request(app).post("/api/register").send({
      email: "cedric@hogwarts.edu",
      password: "diggory"
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Registration successful");
    });

  // Chapter 7: Unit Tests

  // Add a unit test to check if a 200 status code is returned with a message of "Password reset successful" when resetting a password.
  it("should return a 200 status code with a message of 'Password reset successful' when resetting a user's password", async() => {
    const res = await request(app).post("/api/users/cedric@hogwarts.edu/reset-password").send({
      securityQuestions: [
        {answer: "Hedwig"},
        {answer: "Quidditch Through the Ages"},
        {answer: "Evans"}
      ],
      newPassword: "newpassword"
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Password reset successful");
  });

  // Add a unit test that checks if a 400 status code with a message of "Bad Request" is returned when the request body fails ajv validation
  it("should return a 400 status code with a message of 'Bad Request' when the request body fails ajv validation", async () => {
    const res = await request(app).post("/api/users/harry@hogwarts.edu/reset-password").send({
      securityQuestions: [
        {answer: "Hedwig", question: "What is your pet's name?"},
        {answer: "Quidditch Through the Ages", myName: "Harry Potter"}
      ],
      newPassword: "password"
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  // Add a new unit test to check if a 409 status code is returned with the message "Conflict" when registering a user with a duplicate email address
  it("should return a 409 status code with a message of 'Conflict' when registering a user with a duplicate email", async () => {
    const res = await request(app).post("/api/register").send({
      email: "cedric@hogwarts.edu",
      password: "potter"
    });

    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toEqual("Conflict");
  });

  // Add a new unit test to this chapter's test suite that checks if a 401 error is returned with a message of "Unauthorized" when the security answers are incorrect.
  it("should return a 401 status code with a message of 'Unauthorized' when the security answers are incorrect", async() => {
    const res = await request(app).post("/api/users/harry@hogwarts.edu/reset-password").send({
      securityQuestions: [
        {answer: "Fluffy"},
        {answer: "Quidditch Through the Ages"},
        {answer: "Evans"}
      ],
      newPassword: "newpassword"
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Unauthorized");
  });

  // Add a unit test to check if a status code of 400 is returned with a message of "Bad Request" when using too many or too few parameter values
  it("should return a 400 status code when registering a new user with too many or too few parameter values", async () => {
    const res = await request(app).post("/api/register").send({
      email: "cedric@hogwarts.edu",
      password: "diggory",
      extraKey: "extra"
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");

    const res2 = await request(app).post("/api/register").send({
      email: "cedric@hogwarts.edu"
    });

    expect(res2.statusCode).toEqual(400);
    expect(res2.body.message).toEqual("Bad Request");
  });

  // Return 400 status code when if id is not a number

    it("it should return a 400 error if the id is not a number", async () => {
      const res = await request(app).get("/api/recipes/foo");
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Input must be a number");
    });

    // Return a 400 status code when adding a new recipe with missing name

    it("should return a 400 status code when adding a new recipe with missing name", async () => {
      const res = await request(app)
        .post("/api/recipes")
        .send({
          id: 100,
          ingredients: ["bread", "cheese", "butter"],
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Bad Request");
    });

    // Return a 400 status code when the ID is not a number when updating a recipe
    it("should return a 400 status code when updating a recipe with a non-numeric id", async() => {
      const res = await request(app).put("/api/recipes/foo").send({
        name: "Test Recipe",
        ingredients: ["test", "test"],
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Input must be a number");
    });

    // Return a 400 status when updating a recipe with missing or extra keys
    it("should return a 400 status code when updating a recipe with missing keys or extra keys", async () => {
      const res = await request(app).put("/api/recipes/1").send({
        name: "Test Recipe",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");

    const res2 = await request(app).put("/api/recipes/1").send({
      name: "Test Recipe",
      ingredients: ["test", "test"],
      extraKey: "extra",
    });

    expect(res2.statusCode).toEqual(400);
    expect(res2.body.message).toEqual("Bad Request");

    });
});


const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory storage: data is reset whenever the server restarts.
let books = [];
let nextId = 1;

function validateBook(data) {
  if (
    !data ||
    typeof data.title !== "string" ||
    !data.title.trim() ||
    typeof data.author !== "string" ||
    !data.author.trim() ||
    data.year === undefined ||
    data.year === null ||
    data.year === "" ||
    !Number.isFinite(Number(data.year))
  ) {
    return "title, author and a valid numeric year are required.";
  }

  return null;
}

function titleAlreadyExists(title, exceptId = null) {
  const normalizedTitle = title.trim().toLowerCase();

  return books.some(
    (book) =>
      book.title.toLowerCase() === normalizedTitle && book.id !== exceptId
  );
}

// POST /api/books - Create a new book
app.post("/api/books", (req, res) => {
  const error = validateBook(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const title = req.body.title.trim();

  if (titleAlreadyExists(title)) {
    return res.status(409).json({ message: "A book with this title already exists." });
  }

  const newBook = {
    id: nextId++,
    title,
    author: req.body.author.trim(),
    year: Number(req.body.year)
  };

  books.push(newBook);
  return res.status(201).json({
    message: "Book created successfully.",
    book: newBook
  });
});

// GET /api/books - Get all books; optional author filter
app.get("/api/books", (req, res) => {
  const { author } = req.query;

  if (author) {
    const filteredBooks = books.filter(
      (book) => book.author.toLowerCase() === author.trim().toLowerCase()
    );
    return res.status(200).json(filteredBooks);
  }

  return res.status(200).json(books);
});

// GET /api/books/:id - Get one book
app.get("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(404).json({ message: "Book not found." });
  }

  const book = books.find((item) => item.id === id);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  return res.status(200).json(book);
});

// PUT /api/books/:id - Update a book
app.put("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((item) => item.id === id);

  if (!Number.isInteger(id) || !book) {
    return res.status(404).json({ message: "Book not found." });
  }

  const error = validateBook(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const title = req.body.title.trim();

  if (titleAlreadyExists(title, id)) {
    return res.status(409).json({ message: "A book with this title already exists." });
  }

  book.title = title;
  book.author = req.body.author.trim();
  book.year = Number(req.body.year);

  return res.status(200).json({
    message: "Book updated successfully.",
    book
  });
});

// DELETE /api/books/:id - Delete a book
app.delete("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookIndex = books.findIndex((item) => item.id === id);

  if (!Number.isInteger(id) || bookIndex === -1) {
    return res.status(404).json({ message: "Book not found." });
  }

  const deletedBook = books.splice(bookIndex, 1)[0];

  return res.status(200).json({
    message: "Book deleted successfully.",
    book: deletedBook
  });
});

// Return a clear response for invalid JSON bodies.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON request body." });
  }
  return next(err);
});

app.listen(PORT, () => {
  console.log(`Books API is running at http://localhost:${PORT}`);
});

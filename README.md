# Books API

A simple REST API built with **Node.js** and **Express.js**. It manages books using an in-memory JavaScript array. No database is used.

## Requirements

- Node.js (version 18 or later recommended)
- npm
- Postman or Thunder Client (for testing)

## Project setup

1. Open this folder in VS Code.
2. Open the terminal in the project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

The API runs at `http://localhost:3000`.

> **Note:** Books are stored in an array in memory. All data is lost when the server stops or restarts.

## Book fields

| Field | Type | Description |
|---|---|---|
| `id` | Number | Automatically generated |
| `title` | String | Book title |
| `author` | String | Author name |
| `year` | Number | Publication year |

## API routes

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/books` | Add a book |
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get a book by ID |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

### 1. Add a book

`POST http://localhost:3000/api/books`

Body (select **raw → JSON** in Postman):

```json
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "year": 1988
}
```

A successful creation returns **201 Created** and the new book with its automatic ID.

### 2. Get all books

`GET http://localhost:3000/api/books`

### 3. Get a book by ID

`GET http://localhost:3000/api/books/1`

### 4. Update a book

`PUT http://localhost:3000/api/books/1`

Send all three book fields:

```json
{
  "title": "The Alchemist - Updated",
  "author": "Paulo Coelho",
  "year": 1988
}
```

### 5. Delete a book

`DELETE http://localhost:3000/api/books/1`

### Filter by author

`GET http://localhost:3000/api/books?author=Robert`

The author filter is case-insensitive.

## Validation and status codes

| Situation | HTTP status |
|---|---:|
| Required data is missing or invalid | 400 Bad Request |
| A book with the same title already exists | 409 Conflict |
| Requested book ID does not exist | 404 Not Found |
| Book created successfully | 201 Created |
| Other successful requests | 200 OK |

Duplicate titles are checked without considering letter case. For example, `The Alchemist` and `the alchemist` are treated as the same title.

## Suggested testing order

1. POST two different books.
2. GET `/api/books` to view both.
3. GET `/api/books/1` to view one book.
4. GET `/api/books?author=Robert` to test filtering (first add a book whose author is Robert).
5. PUT `/api/books/1` to update a book.
6. Try POST with an existing title to check the 409 response.
7. Try GET `/api/books/999` to check the 404 response.
8. DELETE `/api/books/1`.

## Push the project to GitHub

Create a new empty repository on GitHub, then run these commands in this project folder:

```bash
git init
git add .
git commit -m "Create Books REST API"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your own repository URL. Do not include `node_modules` in Git; it is excluded by `.gitignore`.

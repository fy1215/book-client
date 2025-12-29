import { useEffect, useState } from "react";
import "./App.css";
function App() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [books, setBooks] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  const handleSubmit = async () => {
    if (editId) {
      await fetch(`http://localhost:3000/books/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author, year }),
      });
      setEditId(null);
    } else {
      await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author, year }),
      });
    }
    const res = await fetch("http://localhost:3000/books");
    const data = await res.json();
    setBooks(data);
  };

  const handleEdit = (book) => {
    setEditId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/books/${id}`, {
      method: "DELETE",
    });

    const res = await fetch("http://localhost:3000/books");
    const data = await res.json();
    setBooks(data);
  };

  return (
    <div className="bg-gray-900 min-h-[100vh]">
      <h1 className="text-3xl font-bold text-gray-300">本棚</h1>
      <input
        className="bg-white border m-2 p-1 rounded"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        type="text"
        placeholder="本の名前"
      />
      <input
        className="bg-white border m-2 p-1 rounded"
        onChange={(e) => setAuthor(e.target.value)}
        value={author}
        type="text"
        placeholder="著者"
      />
      <input
        className="bg-white border m-2 p-1 rounded"
        onChange={(e) => setYear(e.target.value)}
        value={year}
        type="text"
        placeholder="出版年"
      />
      <br />
      <button
        className="border rounded shadow bg-gray-300 hover:bg-gray-400 active:bg-gray-500 cursor-pointer py-1 px-10 text-black"
        onClick={handleSubmit}
      >
        保存
      </button>
      {books.map((book) => (
        <div key={book._id} className="my-3">
          <p className="text-gray-300">
            {book.title} - {book.author} ({book.year})
            <button
              className="border rounded shadow bg-gray-300 hover:bg-gray-400 active:bg-gray-500 cursor-pointer px-2 mx-1 text-black"
              onClick={() => handleDelete(book._id)}
            >
              削除
            </button>
            <button
              className="border rounded shadow bg-gray-300 hover:bg-gray-400 active:bg-gray-500 cursor-pointer px-2 text-black"
              onClick={() => handleEdit(book)}
            >
              変更
            </button>
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;

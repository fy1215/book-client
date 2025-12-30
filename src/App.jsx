import { useEffect, useState } from "react";
import "./App.css";
function App() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [books, setBooks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isRegister, setIsRegister] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:3000/books", {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => setBooks(data));
    }
  }, [token]);

  const handleSubmit = async () => {
    if (editId) {
      await fetch(`http://localhost:3000/books/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ title, author, year }),
      });
      setEditId(null);
    } else {
      await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ title, author, year }),
      });
    }
    const res = await fetch("http://localhost:3000/books", {
      headers: { Authorization: token },
    });
    const data = await res.json();
    setBooks(data);
    setTitle("");
    setAuthor("");
    setYear("");
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
      headers: { Authorization: token },
    });

    const res = await fetch("http://localhost:3000/books", {
      headers: { Authorization: token },
    });
    const data = await res.json();
    setBooks(data);
  };

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setToken(data.token);
    if (rememberMe) {
      localStorage.setItem("token", data.token);
    }
  };

  const handleRegister = async () => {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.message) {
      alert(data.message);
      setIsRegister(true);
      setEmail("");
      setPassword("");
    } else {
      alert(data.error);
      setEmail("");
      setPassword("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  if (token) {
    return (
      <div className="bg-gray-900 min-h-[100vh]">
        <div className="flex justify-center relative">
          <h1 className="text-3xl font-bold text-gray-300">本棚</h1>
          <h2
            className="absolute right-0 text-gray-300 my-3 mx-4 underline cursor-pointer"
            onClick={handleLogout}
          >
            ログアウト
          </h2>
        </div>
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
  } else if (isRegister) {
    return (
      <div className="bg-gray-900 min-h-[100vh]">
        <h1 className="text-3xl font-bold text-gray-300">ログイン</h1>
        <input
          type="email"
          placeholder="email"
          className="bg-white border m-2 p-1 rounded"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="password"
          className="bg-white border m-2 p-1 rounded"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <div className="flex flex-col items-center">
          <button
            className="border rounded shadow bg-gray-300 hover:bg-gray-400 active:bg-gray-500 cursor-pointer py-1 px-10 text-black w-fit"
            onClick={handleLogin}
          >
            ログイン
          </button>
          <label className="text-gray-300 m-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            ログインを保存
          </label>
          <button
            className="cursor-pointer py-1 px-8 my-5 text-gray-300 underline hover:text-gray-400"
            onClick={() => setIsRegister(false)}
          >
            新規登録はこちら
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-gray-900 min-h-[100vh]">
        <h1 className="text-3xl font-bold text-gray-300">新規登録</h1>
        <input
          type="email"
          placeholder="email"
          className="bg-white border m-2 p-1 rounded"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="password"
          className="bg-white border m-2 p-1 rounded"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <br />
        <button
          className="border rounded shadow bg-gray-300 hover:bg-gray-400 active:bg-gray-500 cursor-pointer py-1 px-10 text-black"
          onClick={handleRegister}
        >
          登録
        </button>
        <br />
        <button
          className="cursor-pointer py-1 px-8 my-10 text-black text-gray-300 underline hover:text-gray-400"
          onClick={() => setIsRegister(true)}
        >
          ログインはこちら
        </button>
      </div>
    );
  }
}

export default App;

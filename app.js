const express = require("express");
const path = require("path");

const app = express();
const port = 8081;

// Указываем Express, что статические файлы находятся в папке 'public'
app.use(express.static("public"));

// Маршрут для обработки корневого URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

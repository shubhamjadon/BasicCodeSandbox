const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const { customAlphabet } = require("nanoid");
const dedent = require("dedent");
const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456987",
  21
);

const PORT = process.env.PORT || 8886;

const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const loc = (relativePath) => path.join(__dirname, relativePath);

const getFileData = (fileName, token) => {
  const fileTypes = {
    html: "html",
    htm: "html",
    css: "css",
    js: "javascript",
  };
  let fileData = fs.readFileSync(loc(`/public/repls/${token}/${fileName}`));

  return {
    name: fileName,
    language: fileTypes[fileName.split(".")[1]],
    value: dedent`${fileData}`,
  };
};

app.get("/register-new-user", (req, res) => {
  let newToken = nanoid();

  fs.mkdirSync(loc(`/public/repls/${newToken}`));

  let files = {};

  let data = fs.readdirSync(path.join(__dirname, `/template`));
  data.forEach((fileName) => {
    fs.copyFileSync(
      loc(`/template/${fileName}`),
      loc(`/public/repls/${newToken}/${fileName}`)
    );

    files[fileName] = getFileData(fileName, newToken);
  });

  res.json({ message: "new user registered!", token: newToken, files: files });
});

app.get("/files", (req, res) => {
  const token = req.query.token;
  let files = {};
  let data = fs.readdirSync(loc(`/public/repls/${token}`));
  data.forEach((fileName) => {
    files[fileName] = getFileData(fileName, token);
  });
  res.json({ files: files });
});

app.post("/files", (req, res) => {
  const token = req.query.token;
  const filesData = req.body.files;
  Object.values(filesData).forEach((file) => {
    fs.writeFileSync(loc(`/public/repls/${token}/${file.name}`), file.value);
  });
  let data = fs.readdirSync(loc(`/public/repls/${token}`));
  if (data.length > Object.values(filesData).length) {
    data.forEach((fileName) => {
      if (!filesData[fileName])
        fs.unlinkSync(loc(`/public/repls/${token}/${fileName}`));
    });
  }
  res.json({ status: true });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

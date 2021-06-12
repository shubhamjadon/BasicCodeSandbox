import { useState, createContext, useMemo, useEffect } from "react";
import dedent from "dedent";
import Files from "./components/Files";
import Editor from "./components/Editor";
import Terminal from "./components/Terminal";
import { path } from "./Constants";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";

import "react-reflex/styles.css";

export const AppContext = createContext();
function App() {
  const [files, setFiles] = useState({});
  const [current, setCurrent] = useState(files[Object.keys(files)[0]] || {});
  const [opened, setOpened] = useState([]);
  const [userToken, setUserToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [changePreview, setChangePreview] = useState(Date.now());

  const fileTypes = {
    html: "html",
    htm: "html",
    css: "css",
    js: "javascript",
  };

  useEffect(() => {
    let token = localStorage.getItem("sandbox_token");
    if (token) {
      setUserToken(token);
      getUserData(token);
      setLoading(false);
    } else registerNewUser();
  }, []);

  useEffect(() => {
    if (userToken) {
      const timeout = setTimeout(() => {
        fetch(`${path}/files?token=${userToken}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ files: files }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.status) setChangePreview(Date.now());
          });
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [files]);

  const providerValue = useMemo(
    () => ({ files, setFiles, current, setCurrent, opened, setOpened }),
    [files, current, opened]
  );

  async function registerNewUser() {
    let res = await fetch(`${path}/register-new-user`);
    let data = await res.json();
    localStorage.setItem("sandbox_token", data.token);
    setFiles(data.files);
    setUserToken(data.token);
    setLoading(false);
  }

  async function getUserData(token) {
    let res = await fetch(`${path}/files?token=${token}`);
    let data = await res.json();
    setFiles(data ? data.files : {});
    setLoading(false);
  }

  function addFile(name) {
    if (!files[name])
      setFiles({
        ...files,
        [name]: {
          name: name,
          language: fileTypes[name.split(".")[1]],
          value: dedent``,
        },
      });
  }

  function deleteFile(name) {
    let newFiles = { ...files };
    delete newFiles[name];
    closeFile(name);
    setFiles(newFiles);
  }

  function renameFile(name, newName) {
    let newFiles = { ...files };
    newFiles[newName] = { ...files[name], name: newName };
    delete newFiles[name];
    setFiles(newFiles);
  }

  function changeCurrent(name) {
    name !== null ? setCurrent(files[name]) : setCurrent({});
  }

  function closeFile(name) {
    let newOpened = [...opened];
    const index = newOpened.indexOf(name);
    if (index > -1) {
      newOpened.splice(index, 1);

      if (name === current.name) {
        if (newOpened.length > 0) {
          changeCurrent(newOpened[0]);
        } else {
          changeCurrent(null);
        }
      }
      setOpened(newOpened);
    }
  }

  if (loading) return <div>Loading....</div>;
  else
    return (
      <AppContext.Provider
        value={{
          ...providerValue,
          addFile,
          deleteFile,
          renameFile,
          changeCurrent,
          closeFile,
        }}
      >
        <div
          className="App"
          style={{
            display: "flex",
            height: "100vh",
            width: "100vw",
          }}
        >
          <div
            className="files"
            style={{
              width: "12vw",
              backgroundColor: "#282C35",
              borderRight: "1px solid rgba(0, 0, 0, .08)",
            }}
          >
            <Files />
          </div>
          <ReflexContainer orientation="vertical">
            <ReflexElement className="left-pane">
              <div
                className="editor"
                style={{
                  borderRight: "1px solid rgba(0, 0, 0, .08)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  className="monaco-editor"
                  style={{
                    height: "80vh",
                    borderBottom: "1px solid rgba(0, 0, 0, .08)",
                  }}
                >
                  {Object.keys(files).length > 0 &&
                  current &&
                  current.name &&
                  opened.length > 0 ? (
                    <Editor />
                  ) : (
                    <div
                      style={{
                        backgroundColor: "#282C35",
                        height: "100%",
                        width: "100%",
                      }}
                    ></div>
                  )}
                </div>
                <div
                  className="terminal"
                  style={{
                    height: "20vh",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Terminal />
                </div>
              </div>
            </ReflexElement>
            <ReflexSplitter />
            <ReflexElement className="right-pane">
              {files["index.html"] ? (
                <div
                  className="preview"
                  style={{
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    key={changePreview}
                    src={`${path}/repls/${userToken}`}
                    height="100%"
                    width="100%"
                  />
                </div>
              ) : null}
            </ReflexElement>
          </ReflexContainer>
        </div>
      </AppContext.Provider>
    );
}

export default App;

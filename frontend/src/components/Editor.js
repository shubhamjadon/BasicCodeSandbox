import React, { useRef, useContext } from "react";
import { AppContext } from "../App";
import { X, File } from "react-feather";
import MonacoEditor from "@monaco-editor/react";
import dedent from "dedent";

const ListTile = ({ name, current, changeCurrent, closeFile }) => {
  const tileRef = useRef(null);

  return (
    <div
      className="tile"
      ref={tileRef}
      style={{
        display: "flex",
        cursor: "default",
        alignItems: "center",
        padding: "10px",
        backgroundColor: current.name === name ? "#100C08" : "transparent",
      }}
      onMouseOver={() =>
        current.name !== name
          ? (tileRef.current.style.backgroundColor = "#100C08")
          : null
      }
      onMouseOut={() =>
        current.name !== name
          ? (tileRef.current.style.backgroundColor = "transparent")
          : null
      }
    >
      <div
        style={{ display: "flex" }}
        onClick={() => {
          changeCurrent(name);
        }}
      >
        <div style={{ marginRight: "5px" }}>
          <File size={18} />
        </div>
        <div style={{ marginRight: "15px" }}>{name}</div>
      </div>
      <div
        className="close"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          cursor: "pointer",
        }}
        onClick={() => {
          closeFile(name);
        }}
      >
        <X size={16} />
      </div>
    </div>
  );
};

export default function Editor() {
  const { files, setFiles, current, changeCurrent, opened, closeFile } =
    useContext(AppContext);

  const handleEditorChange = (newValue) => {
    setFiles({
      ...files,
      [current.name]: { ...files[current.name], value: dedent`${newValue}` },
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        className="monaco-heading"
        style={{ display: "flex", backgroundColor: "#282C35", color: "white" }}
      >
        {opened.map((ele) => (
          <ListTile
            key={ele}
            name={ele}
            style={{ margin: "10px" }}
            current={current}
            changeCurrent={changeCurrent}
            closeFile={closeFile}
          />
        ))}
      </div>
      <div
        className="monaco-body"
        style={{ height: "100%", width: "100%", display: "flex", flexGrow: 1 }}
      >
        <MonacoEditor
          theme="vs-dark"
          defaultLanguage={current.language}
          defaultValue={current.value}
          path={current.name}
          onChange={handleEditorChange}
          loading={"Loading..."}
          style={{ height: "100%", width: "100%", flexGrow: 1 }}
        />
      </div>
    </div>
  );
}

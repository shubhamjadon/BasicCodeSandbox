import React, { useState, useRef, useContext } from "react";
import { FilePlus, File, Trash } from "react-feather";
import { Modal, ModalBody, ModalFooter, Button, Input } from "reactstrap";
import { AppContext } from "../App";

const ListTile = ({
  name,
  deleteFile,
  renameFile,
  current,
  changeCurrent,
  opened,
  setOpened,
}) => {
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [newFileName, setNewFileName] = useState(name);

  const tileRef = useRef(null);

  const toggle = () => setOpenRenameModal(!openRenameModal);

  return (
    <div
      className="tile"
      ref={tileRef}
      style={{
        display: "flex",
        padding: "5px 3%",
        cursor: "pointer",
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
        style={{ display: "flex", flexGrow: 4 }}
        onClick={() => {
          changeCurrent(name);
          if (!opened.includes(name)) setOpened([...opened, name]);
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <File size={18} />
        </div>
        <div
          style={{ flexGrow: 4 }}
          onDoubleClick={() => setOpenRenameModal(true)}
        >
          {name}
        </div>
      </div>
      <div
        className="trash"
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "flex-end",
          cursor: "pointer",
        }}
      >
        <Trash size={18} onClick={() => deleteFile(name)} />
      </div>

      <Modal
        isOpen={openRenameModal}
        toggle={toggle}
        centered={true}
        className="insert"
      >
        <ModalBody>
          <div style={{ marginBottom: "5px" }}>Enter new name for {name}</div>
          <Input
            placeholder="app.js"
            value={newFileName}
            onChange={(ele) => setNewFileName(ele.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              toggle();
              renameFile(name, newFileName);
            }}
          >
            Rename
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default function Files() {
  const {
    files,
    addFile,
    deleteFile,
    renameFile,
    current,
    changeCurrent,
    opened,
    setOpened,
  } = useContext(AppContext);
  const [openInsertModal, setOpenInsertModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const toggle = () => setOpenInsertModal(!openInsertModal);

  return (
    <div style={{ color: "white" }}>
      <div
        className="FilesHeading"
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#1a2228",
          padding: "5% 3%",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Files
        </div>
        <div onClick={() => setOpenInsertModal(true)}>
          <FilePlus color="white" size={18} style={{ cursor: "pointer" }} />
        </div>
      </div>
      <div className="FilesBody" style={{ padding: "5% 0" }}>
        {Object.values(files).map((ele) => (
          <ListTile
            key={ele.name}
            name={ele.name}
            deleteFile={deleteFile}
            renameFile={renameFile}
            current={current}
            changeCurrent={changeCurrent}
            opened={opened}
            setOpened={setOpened}
          />
        ))}
      </div>
      <Modal
        isOpen={openInsertModal}
        toggle={toggle}
        centered={true}
        className="insert"
      >
        <ModalBody>
          <div style={{ marginBottom: "5px" }}>Enter name of file to add</div>
          <Input
            placeholder="app.js"
            onChange={(ele) => setNewFileName(ele.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              toggle();
              addFile(newFileName);
            }}
          >
            Add
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

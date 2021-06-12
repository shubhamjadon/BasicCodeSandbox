import React from "react";
import Bash from "terminal-in-react";
import NodeEvalPlugin from "terminal-in-react-node-eval-plugin";
import pseudoFileSystem from "terminal-in-react-pseudo-file-system-plugin";
const FileSystemPlugin = pseudoFileSystem();

export default function Terminal() {
  return (
    <div style={{ overflow: "scroll", backgroundColor: "black" }}>
      <Bash
        style={{ width: "100%" }}
        hideTopBar={true}
        allowTabs={false}
        plugins={[
          FileSystemPlugin,
          {
            class: NodeEvalPlugin,
            config: {
              filesystem: FileSystemPlugin.displayName,
            },
          },
        ]}
      />
    </div>
  );
}

import { Button, Modal, TextField } from "@shopify/polaris";
import React, { useState } from "react";

const SaveTemplate = (props) => {
  const { template, exportHtml } = this.props;
  const [activeExport, setactiveExport] = useState(false);
  const [name, setName] = useState("");

  const savetemp = () => {
    const templateObj = { name, template };
    console.log(templateObj);
  };

  const handleExportModal = () => {
    setactiveExport(!activeExport);
  };

  const handleName = (newValue) => {
    setName(newValue);
  };

  return (
    <div>
      <Button
        onClick={() => {
          exportHtml();
          setactiveExport(true);
        }}
      >
        Save as Template
      </Button>
      <Modal
        open={activeExport}
        onClose={handleExportModal}
        title="Save Email Template"
        primaryAction={{
          content: "Save as Template",
          onAction: savetemp,
        }}
        secondaryActions={[
          {
            content: "Close",
            onAction: handleExportModal,
          },
        ]}
      >
        <TextField
          label="Enter a unique name for your Template"
          minLength={1}
          value={name}
          onChange={handleName}
        />
      </Modal>
    </div>
  );
};

export default SaveTemplate;

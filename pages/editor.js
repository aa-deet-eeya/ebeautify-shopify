import {
  Page,
  Modal,
  Button,
  TextContainer,
  TextField,
  Toast,
  Card,
  Frame,
} from "@shopify/polaris";
import React, { useEffect, useRef, useState } from "react";

import EmailEditor from "react-email-editor";
import Navbar from "../components/Navbar";
import axios from "axios";
import SaveTemplate from "../components/SaveTemplate";

const designInit = {
  counters: {},
  body: { rows: [], values: {} },
};

const htmlExportinit = { html: "", design: designInit };

const EmailEditorComp = () => {
  const emailEditorRef = useRef(null);
  const [htmlExport, setHtmlExport] = useState(htmlExportinit);
  const [display, setDisplay] = useState("");
  const [clickHTML, setClickHTML] = useState(true);
  const [active, setActive] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [templateObj, setTemplateObj] = useState({});

  useEffect(() => {
    if (clickHTML) setDisplay(htmlExport.html);
    else setDisplay(JSON.stringify(htmlExport.design));
  }, [clickHTML, htmlExport]);

  const onClickButton = (clickOnHTML) => {
    clickOnHTML ? setClickHTML(true) : setClickHTML(false);
  };

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      setHtmlExport(data);
      // setActive(true);
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(display);
    setShowToast(true);
  };

  const handleChange = () => {
    setActive(!active);
  };
  // const { template, exportHtml } = this.props;
  const [activeExport, setactiveExport] = useState(false);
  const [emptyName, setEmptyName] = useState(false);
  const [sent, setSent] = useState(false);
  const [msg, setMessage] = useState("");
  const [name, setName] = useState("");

  const savetemp = () => {
    if (name == "") setEmptyName(true);
    else {
      const templateObj = { name, template: htmlExport.design };
      console.log(templateObj);
      axios
        .post("/save", { name, template: htmlExport.design })
        .then((res) => {
          console.log(res.data);
          if (res.data.success) {
            setSent(true);
            setMessage("Successfully saved!!");
          } else {
            setSent(true);
            setMessage(`Error : ${res.data.error}`);
          }

          setName("");
          setactiveExport(false);
        })
        .catch((err) => {
          console.log(err);
          setName("");
        });
      setName("");
      setactiveExport(false);
    }
  };

  const handleExportModal = () => {
    setactiveExport(!activeExport);
  };

  const handleName = (newValue) => {
    setName(newValue);
  };

  const [viewTemp, setViewTemp] = useState(false);
  const [tempData, setTempData] = useState([]);
  const changeTemp = () => {
    setViewTemp(!viewTemp);
  };

  useEffect(() => {
    axios
      .get("/templates")
      .then((res) => {
        console.log(res.data);
        if (res.data.success) setTempData(res.data.templates);
      })
      .catch((err) => console.log(err));
  }, [viewTemp]);

  const LoadTemplate = (template) => {
    console.log(template);
    if (
      confirm(
        "Are You Sure You want to load this template? You will lose all your progress"
      )
    ) {
      setLoadtemp(template);
      emailEditorRef.current.editor.loadDesign(template);
      setViewTemp(false);
    }
  };

  const [loadtemp, setLoadtemp] = useState({});

  const onLoad = () => {
    if (JSON.stringify(loadtemp) !== "")
      emailEditorRef.current.editor.loadDesign(loadtemp);
  };

  return (
    <Frame>
      <Page>
        <Modal
          // activator={activator}
          open={active}
          onClose={handleChange}
          title="Export HTML/JSON"
          primaryAction={{
            content: "Save to Clipboard",
            onAction: copyToClipboard,
          }}
          secondaryActions={[
            {
              content: "Close",
              onAction: handleChange,
            },
          ]}
        >
          <Modal.Section>
            <div style={{ display: "flex" }}>
              <Button onClick={() => onClickButton(true)}>Show HTML</Button>
              <Button onClick={() => onClickButton(false)}>Show JSON</Button>
            </div>
            <TextContainer>
              <div style={{ height: "450px", overflow: "auto" }}>
                <p>{display}</p>
              </div>
              {showToast && (
                <Toast
                  content="Copied to Clipboard"
                  duration={1500}
                  onDismiss={() => setShowToast(false)}
                />
              )}
            </TextContainer>
          </Modal.Section>
        </Modal>
        <Button
          onClick={() => {
            exportHtml();
            setActive(true);
          }}
        >
          Export HTML/JSON
        </Button>
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
          <Modal.Section>
            <TextField
              label="Enter a unique name for your Template"
              value={name}
              onChange={handleName}
            />
            {emptyName && (
              <Toast
                content="Name cannot be Empty"
                duration={2000}
                onDismiss={() => setEmptyName(false)}
              />
            )}
          </Modal.Section>
        </Modal>
        {sent && (
          <Toast
            content={msg}
            duration={2000}
            onDismiss={() => setSent(false)}
          />
        )}
        <Button onClick={changeTemp}>Load a Template</Button>
        <Modal open={viewTemp} onClose={changeTemp} title="All Saved Templates">
          <Modal.Section>
            <div style={{ maxHeight: "500px", overflow: "auto" }}>
              {tempData.length > 0 &&
                tempData.map((temp) => (
                  <Button
                    onClick={() => LoadTemplate(temp.template)}
                    key={temp._id}
                  >
                    {temp.name}
                  </Button>
                ))}
            </div>
          </Modal.Section>
        </Modal>
        <EmailEditor ref={emailEditorRef} onLoad={onLoad} minHeight={700} />
      </Page>
    </Frame>
  );
};

export default EmailEditorComp;

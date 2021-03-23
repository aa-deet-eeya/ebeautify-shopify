import {
  Page,
  Modal,
  Button,
  TextContainer,
  TextField,
  Toast,
  Card,
  Frame,
  ButtonGroup,
  Spinner,
} from "@shopify/polaris";
import React, { useEffect, useRef, useState } from "react";

import EmailEditor from "react-email-editor";
import axios from "axios";

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
  const [activeExport, setactiveExport] = useState(false);
  const [emptyName, setEmptyName] = useState(false);
  const [sent, setSent] = useState(false);
  const [msg, setMessage] = useState("");
  const [name, setName] = useState("");
  const [viewTemp, setViewTemp] = useState(false);
  const [tempData, setTempData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [templatedId, setTemplatedId] = useState("");

  useEffect(() => {
    if (clickHTML) setDisplay(htmlExport.html);
    else setDisplay(JSON.stringify(htmlExport.design));
  }, [clickHTML, htmlExport]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/templates")
      .then((res) => {
        console.log(res.data);
        if (res.data.success) setTempData(res.data.templates);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [viewTemp]);

  const onClickButton = (clickOnHTML) => {
    clickOnHTML ? setClickHTML(true) : setClickHTML(false);
  };

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      setHtmlExport(data);
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(display);
    setShowToast(true);
  };

  const handleChange = () => {
    setActive(!active);
  };

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

  const changeTemp = () => {
    setViewTemp(!viewTemp);
  };

  const LoadTemplate = ({ _id, name, template }) => {
    console.log(template);
    if (
      confirm(
        "Are You Sure You want to load this template? You will lose all your current progress"
      )
    ) {
      // setLoadtemp(template);
      setTemplatedId(_id);
      emailEditorRef.current.editor.loadDesign(template);
      setName(name);
      setViewTemp(false);
    }
  };

  const save = () => {
    exportHtml();
    const templateObj = { name, template: htmlExport.design };
    console.log(templateObj);
    axios
      .post("/edit", templateObj)
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          setSent(true);
          setMessage("Successfully saved!!");
        } else {
          setSent(true);
          setMessage(`Error : ${res.data.error}`);
        }
        setactiveExport(false);
      })
      .catch((err) => {
        console.log(err);
      });
    setactiveExport(false);
  };

  const onLoad = () => {
    // if (JSON.stringify(loadtemp) !== "")
    //   emailEditorRef.current.editor.loadDesign(loadtemp);
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
              <ButtonGroup>
                <Button onClick={() => onClickButton(true)}>Show HTML</Button>
                <Button onClick={() => onClickButton(false)}>Show JSON</Button>
              </ButtonGroup>
            </div>
            <TextContainer>
              <div
                style={{ height: "450px", overflow: "auto", margin: "10px 0" }}
              >
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
        <Modal open={viewTemp} onClose={changeTemp} title="All Saved Templates">
          <Modal.Section>
            {loading ? (
              <div
                style={{
                  width: "100%",
                  margin: "40px 0",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Spinner size="large" />
              </div>
            ) : (
              <div style={{ maxHeight: "500px", overflow: "auto" }}>
                <ButtonGroup>
                  {tempData.length > 0 ? (
                    tempData.map((temp) => (
                      <Button onClick={() => LoadTemplate(temp)} key={temp._id}>
                        {temp.name}
                      </Button>
                    ))
                  ) : (
                    <p>No Templates Saved</p>
                  )}
                </ButtonGroup>
              </div>
            )}
          </Modal.Section>
        </Modal>
        <div
          style={{
            padding: "10px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ButtonGroup>
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
              Save as New Template
            </Button>
            <Button onClick={changeTemp}>Load a Template</Button>
          </ButtonGroup>
          {templatedId && <Button onClick={save}>Save</Button>}
        </div>
        <EmailEditor ref={emailEditorRef} onLoad={onLoad} minHeight={700} />
      </Page>
    </Frame>
  );
};

export default EmailEditorComp;

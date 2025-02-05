import React, { useState, useEffect } from "react";
import { Button, Offcanvas, Form, ListGroup, CloseButton, Spinner } from "react-bootstrap";
import { BsThreeDots, BsArrowLeft, BsTrash } from "react-icons/bs";
import {FiMenu } from "react-icons/fi";
import axios from "axios";
import getEnvironment from "./apiConfig";

const FloatingButtonMenu = ({
  _id,
  pharmacy_details,
  clinician_details,
  individual,
  notes,
  lab_tests: initialLabTests = [], // Pass labTests from parent
  medicines: initialMedicines = [], // Pass medicines from parent
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);
  const [note, setNote] = useState(notes);
  const [labTests, setLabTests] = useState(initialLabTests); // Initialize with passed labTests
  const [newLabTest, setNewLabTest] = useState("");
  const [medicines, setMedicines] = useState(initialMedicines); // Initialize with passed medicines
  const [newMedicine, setNewMedicine] = useState({ name: "", description: "" });
  const [videoCallDetails, setVideoCallDetails] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Track saving state
  const [isNoteChanged, setIsNoteChanged] = useState(false); // Track note changes
  const [isLabTestsChanged, setIsLabTestsChanged] = useState(false); // Track lab tests changes
  const [isMedicinesChanged, setIsMedicinesChanged] = useState(false); // Track medicines changes

  const baseURL = getEnvironment();

  // Track changes in note
  useEffect(() => {
    setIsNoteChanged(note !== notes);
  }, [note, notes]);

  // Track changes in lab tests
  useEffect(() => {
    setIsLabTestsChanged(JSON.stringify(labTests) !== JSON.stringify(initialLabTests));
  }, [labTests, initialLabTests]);

  // Track changes in medicines
  useEffect(() => {
    setIsMedicinesChanged(JSON.stringify(medicines) !== JSON.stringify(initialMedicines));
  }, [medicines, initialMedicines]);

  const openDrawer = (content) => {
    setDrawerContent(content);
    setShowDrawer(true);
  };

  const handleSaveNote = async () => {
    setIsSaving(true);
    try {
      await axios.patch(`${baseURL}/appointment/${_id}`, { notes: note });
      alert("Note saved successfully!");
      setIsNoteChanged(false); // Reset note change flag
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLabTest = () => {
    if (newLabTest) {
      setLabTests([...labTests.map(test=>({test_name: test.test_name})), { test_name: newLabTest }]); // Add new lab test
      setNewLabTest("");
      setIsLabTestsChanged(true); // Set lab tests change flag
    }
  };

  const handleSaveLabTests = async () => {
    setIsSaving(true);
    try {
      await axios.patch(`${baseURL}/appointment/lab-requests`, {
        appointmentId: _id,
        lab_tests: labTests,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
      );
      alert("Lab tests saved successfully!");
      setIsLabTestsChanged(false); // Reset lab tests change flag
    } catch (error) {
      console.error("Error saving lab tests:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.description) {
      setMedicines([...medicines, newMedicine]); // Add new medicine
      setNewMedicine({ name: "", description: "" });
      setIsMedicinesChanged(true); // Set medicines change flag
    }
  };

  const handleSaveMedicines = async () => {
    setIsSaving(true);
    try {
      await axios.post(`${baseURL}/vendor/pharmacies/orders`, {
        pharmacy: pharmacy_details,
        clinician: clinician_details._id ?? "",
        individual: individual._id,
        appointment: _id,
        medicines,
      });
      alert("Medicines saved successfully!");
      setIsMedicinesChanged(false); // Reset medicines change flag
    } catch (error) {
      console.error("Error saving medicines:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Button
        variant="primary"
        onClick={() => setShowDrawer(!showDrawer)}
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          borderRadius: "50%",
          padding: "12px",
          width: "56px",
          height: "56px",
        }}
      >
        <FiMenu size={24} />
      </Button>

      <Offcanvas show={showDrawer} onHide={() => setShowDrawer(false)} placement="bottom">
        <Offcanvas.Header>
          {drawerContent && (
            <Button variant="link" onClick={() => setDrawerContent(null)}>
              <BsArrowLeft size={20} />
            </Button>
          )}
          <CloseButton onClick={() => setShowDrawer(false)} />
        </Offcanvas.Header>
        <Offcanvas.Body>
          {!drawerContent ? (
            <div>
              <Button className="m-2" onClick={() => openDrawer("note")}>Add Note</Button>
              <Button className="m-2" onClick={() => openDrawer("lab")}>Suggest Lab Test</Button>
              <Button className="m-2" onClick={() => openDrawer("medication")}>Prescribe Medication</Button>
            </div>
          ) : drawerContent === "note" ? (
            <div>
              <h5>Add Note</h5>
              <Form.Control
                as="textarea"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mb-3"
              />
              <Button
                variant="success"
                onClick={handleSaveNote}
                disabled={!isNoteChanged || isSaving}
              >
                {isSaving ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  "Save Note"
                )}
              </Button>
            </div>
          ) : drawerContent === "lab" ? (
            <div>
              <h5>Suggest Lab Tests</h5>
              <Form.Control
                type="text"
                placeholder="New Lab Test"
                value={newLabTest}
                onChange={(e) => setNewLabTest(e.target.value)}
                className="mb-3"
              />
              <Button onClick={handleAddLabTest} variant="outline-primary" className="mb-2">Add Lab Test</Button>
              <ListGroup>
                {labTests.map((test, index) => (
                  <ListGroup.Item key={index}>
                    {test.test_name}
                    <Button
                      variant="link"
                      onClick={() => setLabTests(labTests.filter((_, i) => i !== index))}
                      className="float-end"
                    >
                      <BsTrash />
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button
                variant="success"
                onClick={handleSaveLabTests}
                disabled={!isLabTestsChanged || isSaving}
              >
                {isSaving ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  "Save Lab Tests"
                )}
              </Button>
            </div>
          ) : (
            <div>
              <h5>Prescribe Medication</h5>
              <Form.Control
                type="text"
                placeholder="Medicine Name"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                className="mb-2"
              />
              <Form.Control
                type="text"
                placeholder="Description"
                value={newMedicine.description}
                onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
                className="mb-3"
              />
              <Button onClick={handleAddMedicine} variant="outline-primary" className="mb-2">Add Medicine</Button>
              <ListGroup>
                {medicines.map((med, index) => (
                  <ListGroup.Item key={index}>
                    {med.name} - {med.description}
                    <Button
                      variant="link"
                      onClick={() => setMedicines(medicines.filter((_, i) => i !== index))}
                      className="float-end"
                    >
                      <BsTrash />
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button
                variant="success"
                onClick={handleSaveMedicines}
                disabled={!isMedicinesChanged || isSaving}
              >
                {isSaving ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  "Save Medicines"
                )}
              </Button>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default FloatingButtonMenu;
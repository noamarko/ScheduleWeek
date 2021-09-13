import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import {
  FormControlLabel,
  FormGroup,
  Checkbox,
  Box,
  FormControl,
  Button,
} from "@material-ui/core";

function InputData(props) {
  const [msg, setMsg] = useState("");
  const [studentName, setStudentName] = useState("");
  const [swimmingForm, setSwimmingForm] = useState({
    form1: "",
    form2: "",
    form3: "",
  });
  const [days, setDays] = useState({
    day1: "",
    day2: "",
    day3: "",
  });
  const [isPrivate, setPrivate] = useState(false);

  const handleStudentName = (event) => {
    setMsg("")
    setStudentName(event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1));
  };

  const handleSwimmingForm = (event) => {
    setSwimmingForm({
      ...swimmingForm,
      [event.target.placeholder]: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1),
    });
  };

  const handlePrivateLesson = (event) => {
    setPrivate(event.target.checked);
  };

  const handlePrefferedDays = (event) => {
    setDays({
      ...days,
      [event.target.placeholder]: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1),
    });
  };

  const isFilled = (form) => form.length > 0;

  const validateStudentSubmit = (name, swimmingForm) => {
    let forms = [
      "freestyle",
      "butterfly",
      "backstroke",
      "sidestroke",
      "breaststroke",
    ];
    if (name === "") {
      return {
        isValid: false,
        message: "Error: Student must have a name...",
      };
    }
    if (!Object.values(swimmingForm).some(isFilled)) {
      return {
        isValid: false,
        message: "Error: Must enter at least one swimming form...",
      };
    } else {
      let spellCheck = 0;
      let formLength = Object.values(swimmingForm).filter((form) => {
        return form !== "";
      }).length;
      Object.values(swimmingForm).map((sForm) => {
        if (sForm) {
          if (forms.includes(sForm.toLowerCase())) spellCheck++;
        }
      });
      if (spellCheck !== formLength)
        return {
          isValid: false,
          message: "Error: Check if swimming form is written correctly...",
        };
    }
    if (!Object.values(days).some(isFilled)) {
      return {
        isValid: false,
        message: "Error: Must enter at least one available day...",
      };
    } else {
      let counter = 0;
      Object.values(days).map((day) => {
        if (day.length > 0)
          if (!day.includes("-") || !day.includes("y")) counter++;
      });

      if (counter !== 0)
        return { isValid: false, message: "Error: Day input is incorrect..." };
    }
    return { isValid: true, message: "Data is valid!" };
  };

  const sendDataToServer = async () => {
    let { isValid, message } = validateStudentSubmit(
      studentName,
      swimmingForm,
      days
    );

    if (isValid) {
      const studentDetails = {
        name: studentName,
        swimmingForm: swimmingForm,
        days: days,
        private: isPrivate
      };
      fetch("http://127.0.0.1:5000/add", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentDetails),
      })
        .then((response) => {
          response.json();
          setStudentName("");
          setDays({ ...days, day1: "", day2: "", day3: "" });
          setSwimmingForm({ ...swimmingForm, form1: "", form2: "", form3: "" });
          setPrivate(false);
          message = "Data received!";
        })
        .then((data) => {
          props.updateData(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          message = error;
        });
      props.updateData();
    }
    setMsg(message);
  };

  const paperStyle1 = {
    width: "50%",
    height: "fit-content",
    borderRadius: "20px",
    padding: "20px",
    backgroundColor: "antiquewhite",
  };

  const paperStyle2 = {
    width: "25%",
    height: "fit-content",
    borderRadius: "20px",
    padding: "20px",
    right: "20%",
    position: "absolute",
    backgroundColor: "antiquewhite",
  };

  const buttonStyle = {
    position: "relative",
    color: "white",
    backgroundColor: "#63999c",
    width: "100%",
  };

  return (
    <div style={{ padding: "20px" }}>
      <Paper style={paperStyle2}>
        <strong>Instructors Days and Hours</strong>
        <br />
        <p>
          Johnny - Days: Sunday, Tuesday and Thursday
          <br />
          Hours: 10:00-19:00
        </p>
        <p>
          Yotam - Days: Monday and Thursday
          <br />
          Hours: 16:00-20:00
        </p>
        <p>
          Yoni - Days: Tuesday, Wednesday and Thursday
          <br />
          Hours: 08:00-15:00
        </p>
      </Paper>
      <Paper elevation={4} style={paperStyle1}>
        <h4 style={{ color: "black" }}>Input Student Details</h4>
        <div>
          <form id="example-form">
            <FormControl style={{ width: "100%", marginBottom: "4px" }}>
              <TextField
                variant="filled"
                type="string"
                onChange={handleStudentName}
                value={studentName}
                placeholder="Student name"
                label="Student full name"
              />
              <br />
              <h6 style={{ color: "black" }}>
                Please enter form of swimming
                <br />
                (Freestyle, Breaststroke, Backstroke, Sidestroke, Butterfly)
              </h6>
              {Object.keys(swimmingForm).map((form, index) => {
                return (
                  <>
                    <TextField
                      variant="filled"
                      type="string"
                      onChange={handleSwimmingForm}
                      value={swimmingForm[form]}
                      placeholder={form}
                      label={"Form " + (index + 1) + " preference"}
                    />
                    <br />
                  </>
                );
              })}
              <h6 style={{ color: "black" }}>
                Please enter which days and time you are available
                <br />
                (i.e Sunday 10-17)
              </h6>
              <FormGroup row>
                {Object.keys(days).map((day, index) => {
                  return (
                    <>
                      <TextField
                        variant="filled"
                        type="string"
                        onChange={handlePrefferedDays}
                        value={days[day]}
                        placeholder={day}
                        label={"Day " + (index + 1) + " preference"}
                      />
                    </>
                  );
                })}
              </FormGroup>
              <br />
              <h6 style={{ color: "black" }}>Check for private lesson</h6>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPrivate}
                    onChange={handlePrivateLesson}
                    name="private"
                    color="primary"
                  />
                }
                label="Private"
              />
            </FormControl>
            {msg.includes("Error") ? (
              <div style={{ textAlign: "center", color: "red" }}>{msg}</div>
            ) : (
              <div style={{ textAlign: "center", color: "blue" }}>{msg}</div>
            )}
            <Button
              value="Submit"
              onClick={sendDataToServer}
              style={buttonStyle}
            >
              Send
            </Button>
          </form>
          <h6 style={{ fontSize: "12px", color: "black", textAlign: "center" }}>
            Max capacity is 30 students per week
          </h6>
        </div>
      </Paper>
    </div>
  );
}

export default InputData;

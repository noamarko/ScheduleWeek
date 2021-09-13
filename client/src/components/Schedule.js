import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Resources,
  Appointments,
  AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { appointments } from "./data.js";

const weekDays = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
};

function Schedule(props) {

  const [poolData, setPoolData] = useState(appointments);
  const [mainResourceName, setMainResource] = useState("members");
  const [conflicts, setConflicts] = useState([]);

  const [resources, setResources] = useState({
    data: poolData,
    mainResourceName: mainResourceName,
    resources: [
      {
        fieldName: "location",
        title: "Location",
        instances: [{ id: "Pool", text: "Pool" }],
      },
      {
        fieldName: "members",
        title: "Members",
        allowMultiple: true,
        instances: props.studentNames,
      },
    ],
  });

  useEffect(() => {
    createPoolData();
  }, []);

  const checkRelevantDay = (studentDays, instructorDay, instructorStartTime) => {
    //returns if the instructor teaches on one of the students preffered days

    let temp = instructorStartTime.split("T");
    let lessonTime = temp[1].split(":");
    let chosenDay = -1;
    Object.values(studentDays).forEach((studentDay) => {
      if (studentDay) {
        studentDay = studentDay.split(" ");
        let studentTime = studentDay[1].split("-");
        if (weekDays[studentDay[0].toLowerCase()] === instructorDay
            &&
            parseInt(studentTime[0]) <= parseInt(lessonTime)
            &&
            parseInt(lessonTime) < parseInt(studentTime[1])
        ) {
          chosenDay = instructorDay;
        }
      }
    });
    return { relevantDay: chosenDay };
  };

  const checkSwimmingForm = (swimmingForms, instructorName) => {
    //returns the type of swimming form and if the instructor knows
    let { form1, form2, form3 } = { ...swimmingForms };
    if (instructorName.includes("-")) {
      let form = instructorName.split("-");
      let formOfSwim = form[1];
      if (formOfSwim.trim() === form1.toLowerCase().trim()) 
          return { relevantForm: true, typeOfForm: form1.toLowerCase().trim()};
      else 
        if (formOfSwim.trim() === form2.toLowerCase().trim()) 
          return { relevantForm: true, typeOfForm: form2.toLowerCase().trim()};
        else
          if (formOfSwim.trim() === form3.toLowerCase().trim()) 
            return { relevantForm: true, typeOfForm: form3.toLowerCase().trim()};
          else
            return { relevantForm: false, typeOfForm: "" };
    }
    let YonisForms = ["butterfly", "breaststroke"];
    if (instructorName.includes("Yoni`s")) {
      if (YonisForms.includes(form1.toLowerCase()))
        return { relevantForm: true, typeOfForm: form1.toLowerCase() };
      else if (YonisForms.includes(form2.toLowerCase()))
        return { relevantForm: true, typeOfForm: form2.toLowerCase() };
      else if (YonisForms.includes(form3.toLowerCase()))
        return { relevantForm: true, typeOfForm: form3.toLowerCase() };
      else {
        return {
          relevantForm: false,
          typeOfForm: "",
        };
      }
    } else {
      return { relevantForm: true, typeOfForm: form1.toLowerCase() };
    }
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeTimeOfLesson = (endTime) => {
    let temp = endTime.split("T");
    let time = temp[1].split(":");
    let hours = parseInt(time[0]) - 1;
    if (hours < 10) hours = "0" + hours.toString();
    else hours = hours.toString();
    let newTime = hours + ":45";
    newTime = temp[0] + "T" + newTime;
    return newTime;
  };

  const createPoolData = () => {
    if (props.data) {
      props.data.map((student, index) => {
        let isBooked = false;
        resources.data.map((instructor) => {
          if (instructor.members.includes(index)) isBooked = true;
          if (!isBooked) {
            const { relevantDay } = checkRelevantDay(student.days, instructor.id, instructor.startDate);
            const { relevantForm, typeOfForm } = checkSwimmingForm( student.swimmingForm, instructor.title);
            if (relevantForm){
              if (relevantDay !== -1
                  &&
                  !instructor.title.includes("private"))
              {
                if (!student.private) {
                  isBooked = true;
                  if (!instructor.members.includes(index)) {
                    // weekDays[instructor.id] += 1;
                    instructor.members.push(index);
                    if (!instructor.title.includes("-")) {
                      instructor.title = instructor.title + " - " + typeOfForm;
                    }
                  }
                } else {
                  if (instructor.members.length === 0) {
                    instructor.members.push(index);
                    instructor.title = instructor.title + " - Private";
                    instructor.endDate = changeTimeOfLesson(instructor.endDate);
                    isBooked = true;
                  }
                }
              }
            }
          }
          return true;
        });
        if (!isBooked && !conflicts.includes(index)) {
          let day = Object.values(student.days)[0];

          let reason =
            "Can't add "+student.name + " (Forms: " +
            Object.values(student.swimmingForm).filter(form=> form !=="")+
            " & Days: "+
            Object.values(student.days).filter(day=> day !=="")+")";
          conflicts.push({ index, reason });
        }
      return true;
      });
      setResources({
        ...resources,
        data: resources.data.filter((lesson) => lesson.members.length > 0),
      });
    }
    props.updateData();
  };

  const clearSchedule = async () => {
    fetch("http://127.0.0.1:5000/delete", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        appointments.map((lesson) => {
          lesson.members = [];
          let title = lesson.title.split("-");
          lesson.title = title[0].trim();
          if (lesson.endDate.includes("45")) {
            let temp = lesson.endDate.split("T");
            let hours = temp[1].split(":")[0];
            lesson.endDate =
              temp[0] + "T" + (parseInt(hours) + 1).toString() + ":00";
          }
          return true;
        });
        setConflicts([]);
        props.updateData([]);
        setPoolData({ poolData: appointments });
        setResources({ ...resources, data: data });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const buttonStyle = {
    position: "relative",
    color: "white",
    backgroundColor: "cadetblue",
    width: "84%",
  };

  return (
    <div style={{overflow:"visible"}}>
      {resources.data ? (
        <>
          <Paper>
            <Scheduler data={resources.data} height="550">
              <ViewState currentDate="2021-09-05" />
              <WeekView startDayHour={8} endDayHour={20} excludedDays={[6]} />
              <Appointments />
              <AppointmentTooltip />
              <Resources
                data={resources.resources}
                mainResourceName={resources.mainResourceName}
              />
            </Scheduler>
          </Paper>
        </>
      ) : (
        <h3>Loading...</h3>
      )}
      <br />
      <Button value="Submit" onClick={clearSchedule} style={buttonStyle}>
        Clear Schedule
      </Button>
      <br />
      <br />
      {conflicts.length > 0 ? (
        <>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClickOpen}
          >
            Open conflict report
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Conflicts in schedule creation"}
            </DialogTitle>
            {Object.values(conflicts).map((conflict) => {
              return (
                <DialogContent>
                  <DialogContentText
                    id="alert-dialog-description"
                    color="red"
                  >
                    {conflict["reason"]}
                  </DialogContentText>
                </DialogContent>
              );
            })}
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default Schedule;

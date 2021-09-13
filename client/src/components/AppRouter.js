import React, { useState, useEffect } from "react";
import InputData from "./InputData";
import { Switch, Route } from "react-router-dom";
import Schedule from "./Schedule";

function AppRouter(props) {

  const [data, setData] = useState([])
  const [studentNames, setStudentNames] = useState()
  const [members, setMembers] = useState()
  const getDataFromServer = async () =>{
    let data = await fetch('http://127.0.0.1:5000/get',{
        'method':'GET',
        headers:{
          'Content-Type':'applications/json'
        }
      })
      .then((res)=>res.json())
        .then((res)=> {return res})
    let names = data.map((student)=>{
      return student.name
    })
    let membersTemp = []
    names = names.map((name, index)=>{
      membersTemp.push(index)
      return {id: index, text:name}
    })
    setMembers(membersTemp);
    setStudentNames(names);
    setData(data);
    }
  
  useEffect(()=>{
    getDataFromServer();
  },[]);


  const divStyle = {
    position: "fixed",
    left: "15%",
    height: "80%",
    width: "100%",
    float: "left",
  };

  return (
    <div style={divStyle}>
      <Switch>
      <Route path="/Schedule">
          <Schedule updateData={getDataFromServer} data={data} members={members} studentNames={studentNames}/>
        </Route>
        <Route path="/">
          <InputData updateData={getDataFromServer}/>
        </Route>
        
      </Switch>
    </div>
  );
}
export default AppRouter;

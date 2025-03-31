"use client";
import noteContext from "./noteContext";
import { useState } from "react";


const NoteState = (props) =>{

   const val1 = {
    "user_name":null,
    "email_id":null,
    "user_role":"super_admin",
    "club_id":null,
    "board_id":null,
   };

   const [info , setInfo]= useState(val1);

   const update = (value) =>{
    setInfo(value);
   };
   
   return (
    <noteContext.Provider value={{info,update}}>
        {props.children}
    </noteContext.Provider>
   )
}

export default NoteState;
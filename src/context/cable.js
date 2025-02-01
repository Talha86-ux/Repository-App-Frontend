// import React from "react";
// import ActionCable from "actioncable";

// const CableContext = React.createContext();

// function CableProvider({ children }) {
//   const cable = ActionCable.createConsumer("ws://localhost:3001/cable");
//   return (
//     <CableContext.Provider value={cable}>{children}</CableContext.Provider>
//   );
// }

// export { CableProvider, CableContext };
import { createConsumer } from "@rails/actioncable";

const CableApp = {};
const token = localStorage.getItem("jwt");
CableApp.cable = createConsumer(`ws://localhost:3001/cable?token=${token}`);

export default CableApp;

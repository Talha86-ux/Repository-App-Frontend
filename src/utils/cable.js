import { createConsumer } from "@rails/actioncable";

const CableApp = {};
CableApp.cable = createConsumer("ws://localhost:3001/cable");

export default CableApp;

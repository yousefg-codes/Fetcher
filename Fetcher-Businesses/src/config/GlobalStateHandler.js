import { EventEmitter } from "events";
import { GOOGLE_MAPS_KEY } from "./keys";

class GlobalStateHandler {
  static businessData = null;
  static eventEmitter = new EventEmitter();
  static shouldDeleteModalRef = null;
  static businessLocation = null;
  static myKey = GOOGLE_MAPS_KEY;
  static canvasJS = fetch("https://canvasjs.com/assets/script/canvasjs.min.js");
}
export default GlobalStateHandler;

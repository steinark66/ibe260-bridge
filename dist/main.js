"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import  { serverInfo } from "./ServerInfo";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(function (inRequest, inResponse, inNext) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    inNext();
});
app.get("/", (req, res) => {
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send("Her kan jeg skrive mine aller første tegn tilbake til browseren");
});
app.listen(3030, () => {
    console.log("Server listening on port 3030");
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esc0RBQ2dFO0FBQ2hFLDZDQUE2QztBQUU3QyxNQUFNLEdBQUcsR0FBWSxJQUFBLGlCQUFPLEdBQUUsQ0FBQztBQUUvQixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUV4QixHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVMsU0FBa0IsRUFBRSxVQUFvQixFQUFFLE1BQW9CO0lBQzNFLFVBQVUsQ0FBQyxNQUFNLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEQsVUFBVSxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0lBQ2hGLFVBQVUsQ0FBQyxNQUFNLENBQUMsOEJBQThCLEVBQUUsZ0RBQWdELENBQUMsQ0FBQztJQUNwRyxNQUFNLEVBQUUsQ0FBQztBQUNiLENBQUMsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDeEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztJQUNwRCxHQUFHLENBQUMsSUFBSSxDQUFDLGlFQUFpRSxDQUFDLENBQUM7QUFDOUUsQ0FBQyxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQy9DLENBQUMsQ0FBQyxDQUFDIn0=
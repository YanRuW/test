//JavaScript Document
let express = require("express");
let app = express();
app.listen(3000, () => console.log("Http server is running at http://127.0.0.1:3000/"));

app.use(express.static(__dirname));

let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.raw());
app.use(bodyParser.text());

let allowOrigin = [
    "http://127.0.0.1:8080/",
    "http://127.0.0.1:3000/"
];

app.use((request, response, next) => {
    let {origin} = request.headers;
    if(allowOrigin.includes(origin)) {
        response.setHeader("Access-Control-Allow-Origin", origin);
        response.setHeader("Access-Control-Allow-Credentials", true);
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, HEAD, DELETE, OPTIONS");
        response.setHeader("X-Powered-By", "3.2.1");
        if(request.method.toUpperCase() == "OPTIONS") {
            response.statusCode = 204;
            response.end();
        }
    }
    next();
});

app.use("/", require("./router"));

app.all("*", (request, response) => {
    response.sendStatus(404);
});
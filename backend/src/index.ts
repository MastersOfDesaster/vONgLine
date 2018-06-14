import express = require("express");
import fs = require("fs");
import { log } from "./Logger";

const app = express();

// Configure REST Server
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.post("/vongline", (request, response) => {
    log.debug("Request: " + request.url);
    if (!isNaN(request.params)) {
        response
            .status(400)
            .send("No string as name");

    } else if (request.body !== null) {
        const filename = Math.floor(Math.random() * (0 - 100000 + 1)) + 100000;
        log.debug(request.body);

        fs.writeFile("tmp/" + filename + ".vsh", request.body.Code.toString(), function(err) {
            if (err) {
                log.error(err.toString());
            }
            log.info(filename + ".vsh saved");

            let exec = require("child_process").exec, child;
            child =  exec("java -jar ./java/vongc.jar ./tmp/" + filename + ".vsh",
            function(error: any, stdout: any, stderr: any) {
                log.info("vongc.jar stdout: " + stdout);
                if (stdout !== null) {
                    child =  exec("java -jar ./java/vong.jar ./tmp/" + filename + ".vch",
                    function(error: any, stdout: any, stderr: any) {
                        log.info("vong.jar stdout: " + stdout);
                        response.json(
                            {Response: stdout},
                        );
                        if (stderr) {
                            log.error("vong.jar stderr: " + stderr);
                        }
                        if (error !== null) {
                            log.error("vong.jar exec error: " + error);
                        }
                    });
                }
                if (stderr) {
                    log.error("vongc.jar stderr: " + stderr);
                }
                if (error !== null) {
                    log.error("vongc.jar exec error: " + error);
                }
            });
         });
    }
});

// Start REST server
app.listen(3000);

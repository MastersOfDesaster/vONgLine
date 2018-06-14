import express = require("express");
import fs = require("fs");
import { log } from "./Logger";

const app = express();

// Configure REST Server
app.use(express.json());

app.use((req, res, next) => {
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
        const filename: number = new Date().getTime();
        log.debug(request.body);

        fs.writeFile("tmp/" + filename + ".vsh", request.body.Code.toString(), (err) => {
            if (err) {
                log.error(err.toString());
            }
            log.info(filename + ".vsh saved");

            const exec = require("child_process").exec;
            exec("java -jar ./java/vongc.jar tmp/" + filename + ".vsh",
            (errorC: any, stdoutC: any, stderrC: any) => {
                log.info("vongc.jar stdout: " + stdoutC);
                if (stdoutC !== null) {
                    exec("java -jar ./java/vong.jar tmp/" + filename + ".vch",
                    (errorR: any, stdoutR: any, stderrR: any) => {
                        log.info("vong.jar stdout: " + stdoutR);
                        response.json(
                            {StdoutC: stdoutC,
                            StdoutR: stdoutR},
                        );
                        if (stderrR) {
                            log.error("vong.jar stderr: " + stderrR);
                        }
                        if (errorR !== null) {
                            log.error("vong.jar exec error: " + errorR);
                        }
                    });
                }
                if (stderrC) {
                    log.error("vongc.jar stderr: " + stderrC);
                }
                if (errorC !== null) {
                    log.error("vongc.jar exec error: " + errorC);
                }
            });
        });
    }
});

// Start REST server
app.listen(3000);

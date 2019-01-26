import express = require("express");
import fs = require("fs");
import https = require("https");
import { log } from "./Logger";

const app = express();

// Certificate
const privateKey = fs.readFileSync("/etc/letsencrypt/live/vongpiler.de/privkey.pem", "utf8");
const certificate = fs.readFileSync("/etc/letsencrypt/live/vongpiler.de/cert.pem", "utf8");
const ca = fs.readFileSync("/etc/letsencrypt/live/vongpiler.de/chain.pem", "utf8");

const credentials = {
  key: privateKey,
  cert: certificate,
	ca: ca
};

// Configure REST Server
app.use(express.json());
app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/compile", (request: any, response: any) => {
    log.debug("Request: " + request.url);
    if (!isNaN(request.params)) {
        response
          .status(400)
          .send("No string as name");

    } else if (request.body !== null) {
        let sessionId: number;
        let compiled = false;

        if (request.body.SessionId !== undefined) {
          sessionId = request.body.SessionId;

        } else {
          sessionId = new Date().getTime();
        }
        log.debug("SessionId: " + sessionId);
        log.debug(request.body.Code);

        fs.writeFile("./tmp/vsh/" + sessionId + ".vsh", request.body.Code.toString(), (err: any) => {
            if (err) {
                log.error(err.toString());
            }
            log.info(sessionId + ".vsh saved");

            const exec = require("child_process").exec;
            exec("docker exec vongline_compiler java -jar java/vongc.jar ./tmp/vsh/"
            + sessionId + ".vsh -o ./tmp/vch/" + sessionId + ".vch ",
            (errorC: any, stdoutC: any, stderrC: any) => {
                log.info("vongc.jar stdout: " + stdoutC);

                const regExp = new RegExp("(vong\.piler\.her\.generator\.ByteCodeWriter in main: "
                + "vong class her was successfully written)");
                compiled = regExp.test(stdoutC);

                response.json({
                    Compiled: compiled,
                    SessionId: sessionId,
                    StdoutC: stdoutC,
                    },
                );
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

app.post("/exec", (request: any, response: any) => {
    log.debug("Request: " + request.url);
    if (!isNaN(request.params)) {
        response
          .status(400)
          .send("No string as name");

    } else if (request.body !== null) {
        let sessionId: number;
        if (request.body.SessionId !== undefined) {
          sessionId = request.body.SessionId;
          log.debug("SessionId: " + sessionId);

          const exec = require("child_process").exec;
          exec("docker run --rm -v /tmp/vongline/vch:/app/tmp/vch:ro --name vongline_runtime-"
          + sessionId + " vongline_runtime java -jar java/vong.jar ./tmp/vch/" + sessionId + ".vch",
              (errorR: any, stdoutR: any, stderrR: any) => {
              log.info("vong.jar stdout: " + stdoutR);
              response.json({
                  SessionId: sessionId,
                  StdoutR: stdoutR,
                  },
              );
              if (stderrR) {
                  log.error("vong.jar stderr: " + stderrR);
              }
              if (errorR !== null) {
                  log.error("vong.jar exec error: " + errorR);
              }
          });

        } else {
            response
            .status(400)
            .send("SessionId not available");
            log.debug("SessionId not available");
        }
    }
});

const httpsServer = https.createServer(credentials, app);

// Start REST server
httpsServer.listen(8443, () => {
  log.info("HTTPS REST Server running on port 8443");
});

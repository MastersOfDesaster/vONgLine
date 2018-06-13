import express = require("express");

import { log } from "./Logger";




const app = express();

// Configure REST Server
app.get("/vongpiler/:source", (request, response) => {
    log.debug("Request: " + request.url);
    // tslint:disable-next-line:prefer-const
    let params = request.params;
    const query = request.query;

    if (!isNaN(params)) {
        response
            .status(400)
            .send("No string as name");

    } else {
        response.json(
        
            );
    }
});

// Start REST server
app.listen(3000);

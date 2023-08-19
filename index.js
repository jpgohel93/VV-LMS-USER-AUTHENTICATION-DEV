const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
const Sentry = require('@sentry/node');
const path = require('path');

const api = require('./src/api');

const app = express();

const { databaseConnection } = require('./src/database');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
// Use Helmet!
// app.use(helmet());

//connection with mongo db
databaseConnection();

//route call
api(app); 

app.use('/user', express.static(path.join(__dirname, 'uploads/user/')));
app.use('/email_assets', express.static(path.join(__dirname, 'uploads/email_assets/')));
app.use('/invoice_assets', express.static(path.join(__dirname, 'uploads/invoice_assets/')));

Sentry.init({
    dsn: "https://d7e7abfba6a84167b504ed1d8b0deaca@o1140263.ingest.sentry.io/4505278483726336",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        // Automatically instrument Node.js libraries and frameworks
        ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.listen({ port: process.env.PORT }, () => console.log(`🚀 Server ready at http://localhost:` + process.env.PORT))
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })
    .on('close', () => {
        channel.close();
    });
    
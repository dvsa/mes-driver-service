# mes-microservices-starter-template

A serverless microservice template.

## Structure

All serverless functions live in dedicated directories in `src/functions`.
Code that is common between multiple functions should reside in `src/common`.

As per the principles of Hexagonal Architecture, each function has the following directories to help us separate concerns:

* `framework` - contains all Inbound and Outbound Adapters, and all use of external/proprietary APIs - depends upon...
* `application` - contains all Inbound and Outbound Ports, doesn't use any external/proprietary APIs - depends upon...
* `domain` - contains all domain objects (Aggregates, Objects, Value classes etc) with all "business logic" (not just anaemic data holders), doesn't use any external/proprietary APIs.

## Bootstrap

The domain model for the service is maintained as a JSON Schema. In order to compile the project, you need to generate the type information:

```shell
npm run bootstrap
```

## Run locally

Use the following script to spin up the microservice locally

```shell
npm start
```

## Build

To build a zip file for every function to `build/artifacts`, run:

```shell
npm run package
```

To build a subset of the functions, pass a comma separated list of function names, like so:

```shell
npm run package -- get,set
```

*N.b. The build requires [jq](https://github.com/stedolan/jq).*

*Any functions delcared in serverless.yml that contain the word "local" will be ignored in the packaging process.*

## Test

To run the unit tests, simply run:

```shell
npm test
```

## Testing workflows locally

To run the GitHub actions locally for testing purposes, please see here:

https://github.com/nektos/act

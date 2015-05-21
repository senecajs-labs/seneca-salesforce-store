# Seneca Salesforce Store

[![Build Status](https://travis-ci.org/nearform/seneca-salesforce-store.png)](https://travis-ci.org/nearform/seneca-salesforce-store)
[![Coverage](https://coveralls.io/repos/nearform/seneca-salesforce-store/badge.svg?branch=master)](https://coveralls.io/r/nearform/seneca-salesforce-store?branch=master)

A Seneca [Data Store](https://github.com/rjrodger/seneca/blob/master/doc/data-store.md) for SalesForce. 

`seneca-salesforce-store` is built on top of [JSForce](https://www.npmjs.com/package/jsforce), which is documented in detail [here](https://jsforce.github.io/document/).

## Usage

```
  seneca.use('salesforce-store', {
    loginUrl: process.env.url,
    username: process.env.username,
    password: process.env.password
  });

  seneca.ready();

...

  var lead = seneca.make$('Lead');
  lead.Company = 'Test Company';
  lead.LastName = 'Test Name';
  lead.save$(function (err) {
...

```

See [test-basic](test/accept/test-basic.js') for more.

## Tests

Basic unit tests with `npm test`, everything is mocked.

There are acceptance tests which hit SalesForce (creatings test Leads etc), to run these you need to provide your own Salesforce Sandbox environment and credentials. To run:

```
env url='https://test.salesforce.com' username=foo@example.com password=Password1 ./node_modules/.bin/turbo test/accept
```

## Debug

`seneca-salesforce-store` uses [debug](https://www.npmjs.com/package/debug), to enable, pass `DEBUG=seneca-salesforce-store` environment variable.

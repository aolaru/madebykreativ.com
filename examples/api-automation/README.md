# Synthetic API Automation Demonstration

A small Java, RestAssured and JUnit suite demonstrating API test design. This
is an independently built demonstration, not a client engagement, security audit
or test of a production service. All data and the public demo token are synthetic.

## Run

Install JDK 17 or newer and Apache Maven 3.9 or newer, then run from this folder:

```sh
mvn -B -ntp verify
```

Every test starts an isolated HTTP fixture on an ephemeral loopback port and
stops it afterward. There are no outbound API requests, secrets, paid accounts
or shared test data. Maven downloads the pinned dependencies on the first run.
Surefire XML and text reports appear in `target/surefire-reports/`.

## Coverage

| Risk | Check |
| --- | --- |
| Service availability | Health status and JSON content type |
| Unauthenticated access | Missing and incorrect tokens return 401 |
| Contract drift | Order ID, status, currency and numeric total |
| Missing records | 404 with an error code and no stack trace |
| Invalid pagination | Negative limit returns 400 |
| List shape | Fixed envelope, one item and pagination marker |
| Unsupported operation | DELETE returns 405 with Allow: GET |
| Protected-response caching | Cache-Control: no-store |
| Ineffective assertions | An explicit fault changes total to a string; the contract assertion must reject it |

The last test deliberately verifies an assertion failure with `assertThrows`.
It is not a production bug or a hidden ignored test. No latency threshold,
full authentication model, database persistence, load test, penetration test or
real business workflow coverage is claimed.

## CI And Handover

The repository's **API Automation Demo** workflow runs on changes to this
example and can be started manually. It publishes Surefire reports even when
tests fail. To adapt the approach to a real engagement, first agree the API
contract, authorized environment, test-data lifecycle and coverage boundaries.

Copyright 2026 Andrei Olaru. This demonstration is provided under the MIT license
in `LICENSE`. No employer or client code is included.

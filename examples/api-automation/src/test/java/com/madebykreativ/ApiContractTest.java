package com.madebykreativ;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import io.restassured.specification.RequestSpecification;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertThrows;

/** Synthetic loopback fixture only. No client system or real customer data. */
class ApiContractTest {
    private HttpServer server;
    private String base;

    @BeforeEach void startFixture() throws IOException {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/", this::respond);
        server.start();
        base = "http://127.0.0.1:" + server.getAddress().getPort();
    }

    @AfterEach void stopFixture() { server.stop(0); }

    private RequestSpecification api() {
        return given().baseUri(base).header("Authorization", "Bearer public-demo-token");
    }

    @Test void healthHasAnExplicitJsonContract() {
        given().baseUri(base).get("/health").then().statusCode(200)
            .contentType("application/json").body("status", equalTo("ok"));
    }

    @Test void missingAuthenticationIsRejected() {
        given().baseUri(base).get("/orders/42").then().statusCode(401)
            .body("error", equalTo("unauthorized"));
    }

    @Test void incorrectAuthenticationIsRejected() {
        given().baseUri(base).header("Authorization", "Bearer incorrect-demo-token")
            .get("/orders/42").then().statusCode(401);
    }

    @Test void authorizedOrderHasStableTypesAndValues() {
        api().get("/orders/42").then().statusCode(200).contentType("application/json")
            .body("id", equalTo(42), "status", equalTo("paid"),
                  "currency", equalTo("EUR"), "total", instanceOf(Number.class));
    }

    @Test void missingOrderHasAnActionableErrorWithoutAStackTrace() {
        api().get("/orders/999").then().statusCode(404)
            .body("error", equalTo("order_not_found"), "$", not(hasKey("stack")));
    }

    @Test void invalidPaginationIsRejected() {
        api().queryParam("limit", -1).get("/orders").then().statusCode(400)
            .body("error", equalTo("invalid_limit"));
    }

    @Test void aValidListKeepsTheDocumentedEnvelope() {
        api().queryParam("limit", 1).get("/orders").then().statusCode(200)
            .body("items", hasSize(1), "items[0].id", equalTo(42), "next", nullValue());
    }

    @Test void unsupportedMethodsDoNotCreateAnOrder() {
        api().delete("/orders/42").then().statusCode(405)
            .header("Allow", equalTo("GET"));
    }

    @Test void responsesPreventAccidentalCachingOfProtectedData() {
        api().get("/orders/42").then().statusCode(200)
            .header("Cache-Control", equalTo("no-store"));
    }

    @Test void contractAssertionDetectsTheDeliberatelyInvalidFixture() {
        // A test of the assertion itself, not a disguised production defect.
        assertThrows(AssertionError.class, () -> api()
            .header("X-Demo-Fault", "wrong-total-type").get("/orders/42")
            .then().statusCode(200).body("total", instanceOf(Number.class)));
    }

    private void respond(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.getResponseHeaders().set("Cache-Control", "no-store");
        if (path.equals("/health")) { send(exchange, 200, "{\"status\":\"ok\"}"); return; }
        if (!"Bearer public-demo-token".equals(exchange.getRequestHeaders().getFirst("Authorization"))) {
            send(exchange, 401, "{\"error\":\"unauthorized\"}"); return;
        }
        if (!exchange.getRequestMethod().equals("GET")) {
            exchange.getResponseHeaders().set("Allow", "GET");
            send(exchange, 405, "{\"error\":\"method_not_allowed\"}"); return;
        }
        if (path.equals("/orders/42")) {
            boolean fault = "wrong-total-type".equals(exchange.getRequestHeaders().getFirst("X-Demo-Fault"));
            send(exchange, 200, "{\"id\":42,\"status\":\"paid\",\"currency\":\"EUR\",\"total\":" + (fault ? "\"unknown\"" : "19.00") + "}"); return;
        }
        if (path.equals("/orders")) {
            if (!"limit=1".equals(exchange.getRequestURI().getQuery())) {
                send(exchange, 400, "{\"error\":\"invalid_limit\"}"); return;
            }
            send(exchange, 200, "{\"items\":[{\"id\":42}],\"next\":null}"); return;
        }
        send(exchange, 404, "{\"error\":\"order_not_found\"}");
    }

    private void send(HttpExchange exchange, int status, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(status, bytes.length);
        try (var output = exchange.getResponseBody()) { output.write(bytes); }
    }
}

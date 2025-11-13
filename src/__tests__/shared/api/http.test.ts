import { httpClient } from "@/shared/api/http";
import { AppError } from "@/shared/api/AppError";
import { server } from "@/../mocks/server";
import { http, HttpResponse } from "msw";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

describe("httpClient", () => {
  describe("response interceptor", () => {
    it("should convert error response to AppError", async () => {
      server.use(
        http.get("http://localhost/api/error", () => {
          return HttpResponse.json(
            { message: "Not found", code: "NOT_FOUND" },
            { status: 404 }
          );
        })
      );

      try {
        await httpClient.get("/error");
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
        expect((error as AppError).code).toBe("NOT_FOUND");
        expect((error as AppError).message).toBe("Not found");
      }
    });

    it("should handle 401 error as regular error", async () => {
      server.use(
        http.get("http://localhost/api/unauthorized", () => {
          return HttpResponse.json(
            { message: "Unauthorized", code: "UNAUTHORIZED" },
            { status: 401 }
          );
        })
      );

      try {
        await httpClient.get("/unauthorized");
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(401);
        expect((error as AppError).code).toBe("UNAUTHORIZED");
        expect((error as AppError).message).toBe("Unauthorized");
      }
    });

    it("should handle ValidationError (422)", async () => {
      server.use(
        http.get("http://localhost/api/validation-error", () => {
          return HttpResponse.json(
            {
              detail: [
                {
                  loc: ["query", "email"],
                  msg: "Field required",
                  type: "value_error.missing",
                },
              ],
            },
            { status: 422 }
          );
        })
      );

      try {
        await httpClient.get("/validation-error");
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(422);
        expect((error as AppError).code).toBe("VALIDATION_ERROR");
        expect((error as AppError).message).toBe("Field required");
      }
    });

    it("should handle network errors", async () => {
      server.use(
        http.get("http://localhost/api/network-error", () => {
          return HttpResponse.error();
        })
      );

      try {
        await httpClient.get("/network-error");
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
      }
    });
  });
});

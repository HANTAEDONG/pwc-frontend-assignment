import { http, HttpResponse, delay } from "msw";
import { db } from "./db";
import type {
  FavoriteCompanyCreate,
  FavoriteCompanyUpdate,
  FavoriteCompanyResponse,
  PaginatedFavoriteCompanyResponse,
  MessageResponse,
} from "@/entities/favorite/api";
import type { HTTPValidationError } from "@/shared/api/types";
import { env } from "@/shared/config/env";

const API_BASE_URL = env.apiBaseUrl;

const randomDelay = () => delay(Math.random() * 300 + 200);

const PAGE_SIZE = 11;

export const handlers = [
  http.get(`${API_BASE_URL}/companies`, async () => {
    await randomDelay();
    if (Math.random() < 0.1) {
      return HttpResponse.json(
        { message: "Internal server error", code: "SERVER_ERROR" },
        { status: 500 }
      );
    }
    return HttpResponse.json({ companies: db.companies });
  }),

  http.get(`${API_BASE_URL}/favorites`, async ({ request }) => {
    await randomDelay();
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const page = Number(url.searchParams.get("page")) || 1;

    if (!email) {
      const validationError: HTTPValidationError = {
        detail: [
          {
            loc: ["query", "email"],
            msg: "Field required",
            type: "value_error.missing",
          },
        ],
      };
      return HttpResponse.json(validationError, { status: 422 });
    }

    const userFavorites = db.favorites.filter((f) => f.email === email);
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedItems = userFavorites.slice(startIndex, endIndex);

    const response: PaginatedFavoriteCompanyResponse = {
      total: userFavorites.length,
      page,
      page_size: PAGE_SIZE,
      total_pages: Math.ceil(userFavorites.length / PAGE_SIZE),
      items: paginatedItems.map((f) => ({
        id: f.id,
        company_name: f.company_name,
        memo: f.memo,
        created_at: f.created_at,
      })),
    };

    return HttpResponse.json(response);
  }),

  http.get(
    `${API_BASE_URL}/favorites/:favorite_id`,
    async ({ params, request }) => {
      await randomDelay();
      const { favorite_id } = params;
      const url = new URL(request.url);
      const email = url.searchParams.get("email");

      if (!email) {
        const validationError: HTTPValidationError = {
          detail: [
            {
              loc: ["query", "email"],
              msg: "Field required",
              type: "value_error.missing",
            },
          ],
        };
        return HttpResponse.json(validationError, { status: 422 });
      }

      const favorite = db.favorites.find(
        (f) => f.id === Number(favorite_id) && f.email === email
      );

      if (!favorite) {
        return HttpResponse.json(
          { message: "Favorite not found", code: "NOT_FOUND" },
          { status: 404 }
        );
      }

      return HttpResponse.json(favorite);
    }
  ),

  http.post(`${API_BASE_URL}/favorites`, async ({ request }) => {
    await randomDelay();
    const body = (await request.json()) as Partial<FavoriteCompanyCreate>;

    if (!body.email || !body.company_name) {
      const validationError: HTTPValidationError = {
        detail: [
          {
            loc: ["body", !body.email ? "email" : "company_name"],
            msg: "Field required",
            type: "value_error.missing",
          },
        ],
      };
      return HttpResponse.json(validationError, { status: 422 });
    }

    const existingFavorite = db.favorites.find(
      (f) => f.email === body.email && f.company_name === body.company_name
    );

    if (existingFavorite) {
      return HttpResponse.json(
        { message: "Duplicate favorite company", code: "DUPLICATE_ERROR" },
        { status: 400 }
      );
    }

    const newFavorite: FavoriteCompanyResponse = {
      id: db.favorites.length + 1,
      email: body.email,
      company_name: body.company_name,
      memo: body.memo ?? null,
      created_at: new Date().toISOString(),
    };

    db.favorites.push(newFavorite);

    const response: MessageResponse = {
      message: "Favorite company created successfully",
    };

    return HttpResponse.json(response, { status: 201 });
  }),

  http.put(
    `${API_BASE_URL}/favorites/:favorite_id`,
    async ({ params, request }) => {
      await randomDelay();
      const { favorite_id } = params;
      const url = new URL(request.url);
      const email = url.searchParams.get("email");
      const body = (await request.json()) as Partial<FavoriteCompanyUpdate>;

      if (!email) {
        const validationError: HTTPValidationError = {
          detail: [
            {
              loc: ["query", "email"],
              msg: "Field required",
              type: "value_error.missing",
            },
          ],
        };
        return HttpResponse.json(validationError, { status: 422 });
      }

      const index = db.favorites.findIndex(
        (f) => f.id === Number(favorite_id) && f.email === email
      );

      if (index === -1) {
        return HttpResponse.json(
          { message: "Favorite not found", code: "NOT_FOUND" },
          { status: 404 }
        );
      }

      db.favorites[index] = {
        ...db.favorites[index],
        memo: body.memo ?? null,
      };

      const response: MessageResponse = {
        message: "Favorite company updated successfully",
      };

      return HttpResponse.json(response);
    }
  ),

  http.delete(
    `${API_BASE_URL}/favorites/:favorite_id`,
    async ({ params, request }) => {
      await randomDelay();
      const { favorite_id } = params;
      const url = new URL(request.url);
      const email = url.searchParams.get("email");

      if (!email) {
        const validationError: HTTPValidationError = {
          detail: [
            {
              loc: ["query", "email"],
              msg: "Field required",
              type: "value_error.missing",
            },
          ],
        };
        return HttpResponse.json(validationError, { status: 422 });
      }

      const index = db.favorites.findIndex(
        (f) => f.id === Number(favorite_id) && f.email === email
      );

      if (index === -1) {
        return HttpResponse.json(
          { message: "Favorite not found", code: "NOT_FOUND" },
          { status: 404 }
        );
      }

      db.favorites.splice(index, 1);

      if (Math.random() < 0.5) {
        return HttpResponse.json(null, { status: 204 });
      }

      const response: MessageResponse = {
        message: "Favorite company deleted successfully",
      };

      return HttpResponse.json(response);
    }
  ),

  http.get(`${API_BASE_URL}/auth/error`, async () => {
    await randomDelay();
    return HttpResponse.json(
      { message: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }),

  http.get(`${API_BASE_URL}/server/error`, async () => {
    await randomDelay();
    return HttpResponse.json(
      { message: "Internal server error", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }),
];

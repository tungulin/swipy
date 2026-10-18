import type { RouteConfig } from "@react-router/dev/routes";

import { index, layout, route } from "@react-router/dev/routes";

export default [
  route("auth", "routes/auth.tsx"),

  layout("./routes/protected-route.tsx", [
    index("./routes/home/route.tsx"),
    route("profile", "./routes/profile.tsx"),
  ]),
] satisfies RouteConfig;

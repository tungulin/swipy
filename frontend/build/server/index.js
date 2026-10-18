import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withErrorBoundaryProps, UNSAFE_withComponentProps, Outlet, Meta, Links, ScrollRestoration, Scripts, useNavigate, useLocation, Navigate, Link } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { RefreshCwIcon, BombIcon, InfoIcon, CheckIcon, Loader2Icon, SunIcon, MoonIcon, ChevronLeftIcon, HistoryIcon, UserIcon, LogOutIcon, CalculatorIcon, ChevronDownIcon, XIcon, ChevronRightIcon, PlaneIcon, BusFrontIcon, HouseIcon } from "lucide-react";
import { Toaster, toast } from "sonner";
import { QueryClient, QueryClientProvider, useMutation, useQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import * as React from "react";
import React__default, { createContext, use, useState, useMemo, useRef, useEffect } from "react";
import { useLocalStorage, usePreferredColorScheme, getCookie, useIsomorphicLayoutEffect, setCookie, useTimer, useBoolean, useMount, useControllableState, useDisclosure, useStep } from "@siberiacancode/reactuse";
import { Button as Button$1 } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import clsx$1, { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate } from "date-fns";
import { FormProvider, useFormContext, Controller, useForm } from "react-hook-form";
import { withMask } from "use-mask-input";
import axios from "axios";
import { Input as Input$1 } from "@base-ui/react/input";
import { OTPInput, OTPInputContext } from "input-otp";
import { Combobox as Combobox$1 } from "@base-ui/react";
import { Dialog as Dialog$1 } from "@base-ui/react/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import z$1, { z } from "zod";
import { Separator as Separator$1 } from "@base-ui/react/separator";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { Progress as Progress$1 } from "@base-ui/react/progress";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup as RadioGroup$1 } from "@base-ui/react/radio-group";
import { useQueryStates, parseAsJson } from "nuqs";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const PREFIX = "jbp-projects";
const AUTH_TOKEN = `${PREFIX}-token`;
const useAuthTokenLocalStorage = () => useLocalStorage(AUTH_TOKEN);
const useUserLocalStorage = () => useLocalStorage(`${PREFIX}-user`);
const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const tokenStorage = useAuthTokenLocalStorage();
  const userStorage = useUserLocalStorage();
  return /* @__PURE__ */ jsx(
    AuthContext,
    {
      value: {
        token: tokenStorage.value,
        user: userStorage.value,
        isAuthenticated: !!tokenStorage.value
      },
      children
    }
  );
};
const useAuth = () => use(AuthContext);
const PREFIX_COOKIE = "jbp-projects";
const THEME_COOKIE_KEY = `${PREFIX_COOKIE}-theme`;
const PHONE_REGEX = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
const SINGLE_WORD_REGEX = new RegExp("^\\p{L}+$", "u");
const getTheme = (theme) => {
  if (theme === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
};
const ThemeContext = createContext({
  value: "light",
  set: () => {
  }
});
const ThemeProvider = ({ children }) => {
  const colorScheme = usePreferredColorScheme();
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "system";
    return getCookie(THEME_COOKIE_KEY) ?? "system";
  });
  useIsomorphicLayoutEffect(() => {
    const root2 = document.documentElement;
    const activeTheme = getTheme(theme);
    setCookie(THEME_COOKIE_KEY, theme, {
      path: "/"
    });
    root2.classList.remove("light", "dark");
    root2.classList.add(activeTheme);
  }, [theme, colorScheme]);
  const value = useMemo(() => ({ value: getTheme(theme), set: setTheme }), [theme]);
  return /* @__PURE__ */ jsx(ThemeContext, { value, children });
};
const useTheme = () => use(ThemeContext);
const queryClient = new QueryClient();
const Provider = ({ children }) => /* @__PURE__ */ jsx(NuqsAdapter, { children: /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(AuthProvider, { children }) }) }) });
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-full px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 rounded-full px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs": "size-6 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 ",
        "icon-lg": "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = ({
  className,
  variant = "default",
  size = "default",
  ...props
}) => /* @__PURE__ */ jsx(
  Button$1,
  {
    className: cn(buttonVariants({ variant, size, className })),
    "data-slot": "button",
    ...props
  }
);
const toasterProps = {
  icons: {
    success: /* @__PURE__ */ jsx(CheckIcon, {
      size: 16
    }),
    info: /* @__PURE__ */ jsx(InfoIcon, {
      size: 16
    }),
    warning: null,
    error: /* @__PURE__ */ jsx(BombIcon, {
      size: 16
    }),
    loading: null
  },
  toastOptions: {
    classNames: {
      toast: "rounded-2xl! border-brand/20!",
      title: "font-semibold!",
      closeButton: "border-brand/20!"
    }
  }
};
const Layout = ({
  children
}) => /* @__PURE__ */ jsxs("html", {
  lang: "en",
  children: [/* @__PURE__ */ jsxs("head", {
    children: [/* @__PURE__ */ jsx("meta", {
      charSet: "utf-8"
    }), /* @__PURE__ */ jsx("meta", {
      content: "width=device-width, initial-scale=1",
      name: "viewport"
    }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
  }), /* @__PURE__ */ jsx("body", {
    children: /* @__PURE__ */ jsxs(Provider, {
      children: [children, /* @__PURE__ */ jsx(Toaster, {
        closeButton: true,
        ...toasterProps
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })
  })]
});
const App = () => /* @__PURE__ */ jsx(Outlet, {});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(() => /* @__PURE__ */ jsxs("main", {
  className: "flex min-h-screen flex-col items-center justify-center gap-4 text-center",
  children: [/* @__PURE__ */ jsx("img", {
    alt: "error",
    className: "w-64",
    src: "/error-feedback.png"
  }), /* @__PURE__ */ jsx("h1", {
    className: "text-2xl font-bold",
    children: "Оооой!"
  }), /* @__PURE__ */ jsx("p", {
    className: "text-muted-foreground",
    children: "Что-то пошло не так. Попробуйте обновить страницу"
  }), /* @__PURE__ */ jsxs(Button, {
    onClick: () => window.location.reload(),
    children: [/* @__PURE__ */ jsx(RefreshCwIcon, {
      size: 20
    }), "Обновить страницу"]
  })]
}));
const root = UNSAFE_withComponentProps(App);
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
const instance = axios.create({
  baseURL: "https://juniorsbootcamp.ru"
});
instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
const getApiDeliveryOrderByOrderId = ({
  config,
  path,
  headers
}) => instance.request({
  method: "GET",
  url: `/api/delivery/orders/${path.orderId}`,
  headers,
  ...config
});
const getApiDeliveryOrderByOrderIdMutationKey = "getApiDeliveryOrderByOrderIdMutationKey";
const useGetApiDeliveryOrderByOrderIdMutation = (settings) => useMutation({
  mutationKey: [getApiDeliveryOrderByOrderIdMutationKey],
  mutationFn: async (params) => getApiDeliveryOrderByOrderId({ ...settings?.request, ...params }),
  ...settings?.params
});
const getApiDeliveryOrders = ({
  config,
  headers
} = {}) => instance.request({
  method: "GET",
  url: "/api/delivery/orders",
  headers,
  ...config
});
const getApiDeliveryOrdersQueryKey = "getApiDeliveryOrdersQueryKey";
const getApiDeliveryOrdersQueryOptions = (settings) => queryOptions({
  queryKey: [
    getApiDeliveryOrdersQueryKey,
    ...settings?.request?.path ? [settings?.request?.path] : [],
    ...settings?.request?.query ? [settings?.request?.query] : [],
    ...settings?.request?.body ? [settings?.request?.body] : []
  ],
  queryFn: async () => getApiDeliveryOrders({ ...settings?.request }),
  ...settings?.params
});
const useGetApiDeliveryOrdersQuery = (...args) => useQuery(getApiDeliveryOrdersQueryOptions(...args));
const getApiDeliveryPackageTypes = ({
  config
} = {}) => instance.request({
  method: "GET",
  url: "/api/delivery/package/types",
  ...config
});
const getApiDeliveryPackageTypesQueryKey = "getApiDeliveryPackageTypesQueryKey";
const getApiDeliveryPackageTypesQueryOptions = (settings) => queryOptions({
  queryKey: [
    getApiDeliveryPackageTypesQueryKey,
    ...settings?.request?.path ? [settings?.request?.path] : [],
    ...settings?.request?.query ? [settings?.request?.query] : [],
    ...settings?.request?.body ? [settings?.request?.body] : []
  ],
  queryFn: async () => getApiDeliveryPackageTypes({ ...settings?.request }),
  ...settings?.params
});
const useGetApiDeliveryPackageTypesQuery = (...args) => useQuery(getApiDeliveryPackageTypesQueryOptions(...args));
const getApiDeliveryPoints = ({ config } = {}) => instance.request({
  method: "GET",
  url: "/api/delivery/points",
  ...config
});
const getApiDeliveryPointsQueryKey = "getApiDeliveryPointsQueryKey";
const getApiDeliveryPointsQueryOptions = (settings) => queryOptions({
  queryKey: [
    getApiDeliveryPointsQueryKey,
    ...settings?.request?.path ? [settings?.request?.path] : [],
    ...settings?.request?.query ? [settings?.request?.query] : [],
    ...settings?.request?.body ? [settings?.request?.body] : []
  ],
  queryFn: async () => getApiDeliveryPoints({ ...settings?.request }),
  ...settings?.params
});
const useGetApiDeliveryPointsQuery = (...args) => useQuery(getApiDeliveryPointsQueryOptions(...args));
const postApiDeliveryCalc = ({
  config,
  body
}) => instance.request({
  method: "POST",
  url: "/api/delivery/calc",
  data: body,
  ...config
});
const postApiDeliveryCalcMutationKey = "postApiDeliveryCalcMutationKey";
const usePostApiDeliveryCalcMutation = (settings) => useMutation({
  mutationKey: [postApiDeliveryCalcMutationKey],
  mutationFn: async (params) => postApiDeliveryCalc({ ...settings?.request, ...params }),
  ...settings?.params
});
const postApiDeliveryOrder = ({
  config,
  body
}) => instance.request({
  method: "POST",
  url: "/api/delivery/order",
  data: body,
  ...config
});
const postApiDeliveryOrderMutationKey = "postApiDeliveryOrderMutationKey";
const usePostApiDeliveryOrderMutation = (settings) => useMutation({
  mutationKey: [postApiDeliveryOrderMutationKey],
  mutationFn: async (params) => postApiDeliveryOrder({ ...settings?.request, ...params }),
  ...settings?.params
});
const putApiDeliveryOrdersCancel = ({
  config,
  body,
  headers
}) => instance.request({
  method: "PUT",
  url: "/api/delivery/orders/cancel",
  data: body,
  headers,
  ...config
});
const putApiDeliveryOrdersCancelMutationKey = "putApiDeliveryOrdersCancelMutationKey";
const usePutApiDeliveryOrdersCancelMutation = (settings) => useMutation({
  mutationKey: [putApiDeliveryOrdersCancelMutationKey],
  mutationFn: async (params) => putApiDeliveryOrdersCancel({ ...settings?.request, ...params }),
  ...settings?.params
});
const postApiAuthOtp = ({
  config,
  body
}) => instance.request({
  method: "POST",
  url: "/api/auth/otp",
  data: body,
  ...config
});
const postApiAuthOtpMutationKey = "postApiAuthOtpMutationKey";
const usePostApiAuthOtpMutation = (settings) => useMutation({
  mutationKey: [postApiAuthOtpMutationKey],
  mutationFn: async (params) => postApiAuthOtp({ ...settings?.request, ...params }),
  ...settings?.params
});
const getApiOtps = ({
  config
} = {}) => instance.request({
  method: "GET",
  url: "/api/otps",
  ...config
});
const patchApiUsersProfile = ({
  config,
  body,
  headers
}) => instance.request({
  method: "PATCH",
  url: "/api/users/profile",
  data: body,
  headers,
  ...config
});
const patchApiUsersProfileMutationKey = "patchApiUsersProfileMutationKey";
const usePatchApiUsersProfileMutation = (settings) => useMutation({
  mutationKey: [patchApiUsersProfileMutationKey],
  mutationFn: async (params) => patchApiUsersProfile({ ...settings?.request, ...params }),
  ...settings?.params
});
const postApiUsersSignin = ({
  config,
  body
}) => instance.request({
  method: "POST",
  url: "/api/users/signin",
  data: body,
  ...config
});
const postApiUsersSigninMutationKey = "postApiUsersSigninMutationKey";
const usePostApiUsersSigninMutation = (settings) => useMutation({
  mutationKey: [postApiUsersSigninMutationKey],
  mutationFn: async (params) => postApiUsersSignin({ ...settings?.request, ...params }),
  ...settings?.params
});
const Label = ({ className, htmlFor, ...props }) => /* @__PURE__ */ jsx(
  "label",
  {
    className: cn(
      "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className
    ),
    "data-slot": "label",
    htmlFor,
    ...props
  }
);
const Separator = ({
  className,
  orientation = "horizontal",
  ...props
}) => /* @__PURE__ */ jsx(
  Separator$1,
  {
    className: cn(
      "bg-border shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
      className
    ),
    "data-slot": "separator",
    orientation,
    ...props
  }
);
const fieldVariants = cva("group/field flex w-full gap-2 data-[invalid=true]:text-destructive", {
  variants: {
    orientation: {
      vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
      horizontal: "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      responsive: "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
    }
  },
  defaultVariants: {
    orientation: "vertical"
  }
});
const Field = ({
  className,
  orientation = "vertical",
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(fieldVariants({ orientation }), className),
    "data-orientation": orientation,
    "data-slot": "field",
    role: "group",
    ...props
  }
);
const FieldLabel = ({ className, htmlFor, ...props }) => /* @__PURE__ */ jsx(
  Label,
  {
    className: cn(
      "group/field-label peer/field-label has-data-checked:border-primary/30 has-data-checked:bg-primary/5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5",
      "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
      className
    ),
    "data-slot": "field-label",
    htmlFor,
    ...props
  }
);
const FieldDescription = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "p",
  {
    className: cn(
      "text-muted-foreground text-left text-sm leading-normal font-normal group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
      "last:mt-0 nth-last-2:-mt-1",
      "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
      className
    ),
    "data-slot": "field-description",
    ...props
  }
);
const FieldError = ({
  className,
  children,
  errors,
  ...props
}) => {
  const content = useMemo(() => {
    if (children) {
      return children;
    }
    if (!errors?.length) {
      return null;
    }
    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];
    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }
    return /* @__PURE__ */ jsx("ul", { className: "ml-4 flex list-disc flex-col gap-1", children: uniqueErrors.map((error, index) => error?.message && /* @__PURE__ */ jsx("li", { children: error.message }, index)) });
  }, [children, errors]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("text-destructive ml-2 min-h-4 text-xs font-normal", className),
      "data-slot": "field-error",
      role: "alert",
      ...props,
      children: content
    }
  );
};
const Input = ({ className, type, ...props }) => /* @__PURE__ */ jsx(
  Input$1,
  {
    className: cn(
      "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 h-11 w-full min-w-0 rounded-full border bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
      className
    ),
    "data-slot": "input",
    type,
    ...props
  }
);
const Textarea = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "textarea",
  {
    className: cn(
      "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex field-sizing-content min-h-16 w-full rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
      className
    ),
    "data-slot": "textarea",
    ...props
  }
);
const Form = ({ form, onSubmit, ...other }) => /* @__PURE__ */ jsx(FormProvider, { ...form, children: /* @__PURE__ */ jsx("form", { ...other, onSubmit: form.handleSubmit(onSubmit) }) });
const FormInput = ({ label, description, name, ...other }) => {
  const form = useFormContext();
  return /* @__PURE__ */ jsx(
    Controller,
    {
      render: ({ field, fieldState }) => /* @__PURE__ */ jsxs(Field, { children: [
        label && /* @__PURE__ */ jsx(FieldLabel, { "data-invalid": fieldState.invalid, children: label }),
        /* @__PURE__ */ jsx(Input, { ...field, ...other }),
        description && /* @__PURE__ */ jsx(FieldDescription, { children: "Your API key is encrypted and stored securely." }),
        /* @__PURE__ */ jsx(FieldError, { errors: [fieldState.error] })
      ] }),
      control: form.control,
      name,
      rules: { required: true }
    }
  );
};
const FormTextarea = ({ label, description, name, ...other }) => {
  const form = useFormContext();
  return /* @__PURE__ */ jsx(
    Controller,
    {
      render: ({ field, fieldState }) => /* @__PURE__ */ jsxs(Field, { children: [
        label && /* @__PURE__ */ jsx(FieldLabel, { "data-invalid": fieldState.invalid, children: label }),
        /* @__PURE__ */ jsx(Textarea, { ...field, ...other }),
        description && /* @__PURE__ */ jsx(FieldDescription, { children: "Your API key is encrypted and stored securely." }),
        /* @__PURE__ */ jsx(FieldError, { errors: [fieldState.error] })
      ] }),
      control: form.control,
      name,
      rules: { required: true }
    }
  );
};
const InputOTP = ({
  className,
  containerClassName,
  ...props
}) => /* @__PURE__ */ jsx(
  OTPInput,
  {
    containerClassName: cn(
      "cn-input-otp flex items-center has-disabled:opacity-50",
      containerClassName
    ),
    className: cn("disabled:cursor-not-allowed", className),
    "data-slot": "input-otp",
    spellCheck: false,
    ...props
  }
);
const InputOTPGroup = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "has-aria-invalid:border-destructive has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 flex items-center rounded-lg has-aria-invalid:ring-3",
      className
    ),
    "data-slot": "input-otp-group",
    ...props
  }
);
const InputOTPSlot = ({
  index,
  className,
  ...props
}) => {
  const inputOTPContext = React.use(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "border-input aria-invalid:border-destructive data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40 relative flex size-8 items-center justify-center border-y border-r text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg data-[active=true]:z-10 data-[active=true]:ring-3",
        className
      ),
      "data-active": isActive,
      "data-slot": "input-otp-slot",
      ...props,
      children: [
        char,
        hasFakeCaret && /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-caret-blink bg-foreground h-4 w-px duration-1000" }) })
      ]
    }
  );
};
const Spinner = ({ className, ...props }) => /* @__PURE__ */ jsx(
  Loader2Icon,
  {
    "aria-label": "Loading",
    className: cn("size-4 animate-spin", className),
    role: "status",
    ...props
  }
);
const createComponent = (tag, defaultClassName, displayName) => {
  const Component = ({
    ref,
    ...props
  }) => React__default.createElement(
    tag,
    { ...props, ref, className: cn(defaultClassName, props.className) },
    props.children
  );
  Component.displayName = displayName;
  return Component;
};
createComponent(
  "h1",
  "scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl",
  "H1"
);
const H2 = createComponent(
  "h2",
  "scroll-m-20 py-2 text-2xl font-semibold tracking-tight first:mt-0",
  "H2"
);
const H3 = createComponent(
  "h3",
  "scroll-m-20 text-xl font-semibold tracking-tight",
  "H3"
);
const H4 = createComponent(
  "h4",
  "scroll-m-20 text-l font-semibold tracking-tight",
  "H4"
);
createComponent(
  "p",
  "text-xl text-muted-foreground",
  "Lead"
);
const P = createComponent(
  "p",
  "leading-7 [&:not(:first-child)]:mt-4",
  "P"
);
const Large = createComponent("div", "text-lg font-semibold", "Large");
const Small = createComponent(
  "p",
  "text-sm font-medium leading-none",
  "Small"
);
const Muted = createComponent(
  "span",
  "text-sm text-muted-foreground",
  "Muted"
);
createComponent(
  "code",
  "relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  "InlineCode"
);
createComponent(
  "pre",
  "relative rounded-sm bg-muted p-4 font-mono text-sm font-semibold overflow-x-auto",
  "MultilineCode"
);
createComponent(
  "ul",
  "my-6 ml-6 list-disc [&>li]:mt-2",
  "List"
);
createComponent(
  "blockquote",
  "mt-6 border-l-2 pl-6 italic text-muted-foreground",
  "Quote"
);
const findOtpByPhone = (phone, html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const rows = doc.querySelectorAll("tbody tr");
  for (const row of rows) {
    const cells = row.querySelectorAll("td");
    if (cells[0]?.textContent === phone) {
      return cells[1]?.textContent ?? null;
    }
  }
  return null;
};
const Auth = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const formPhone = useForm();
  const otpTimer = useTimer(120, {
    immediately: false
  });
  const authOtpMutation = usePostApiAuthOtpMutation();
  const signInUserMutation = usePostApiUsersSigninMutation();
  const authTokenStorage = useAuthTokenLocalStorage();
  const userStorage = useUserLocalStorage();
  const [code, setCode] = useState("");
  const [isSendingPhone, togglIsSendingPhone] = useBoolean(true);
  const handleSubmitPhone = (data) => {
    const phone = data.phone.replace(/\D/g, "");
    authOtpMutation.mutate({
      body: {
        phone
      }
    }, {
      onSuccess: () => {
        togglIsSendingPhone();
        otpTimer.start();
        getApiOtps().then((response) => {
          toast.info(`Твой код: ${findOtpByPhone(phone, response.data)}`);
        });
      },
      onError: () => toast.error("Не удалось получить otp код")
    });
  };
  const handleSubmitOtpCode = () => {
    const phone = formPhone.getValues().phone.replace(/\D/g, "");
    signInUserMutation.mutate({
      body: {
        phone,
        code: Number(code)
      }
    }, {
      onSuccess: (resp) => {
        authTokenStorage.set(resp.data.token);
        userStorage.set(resp.data.user);
        navigate("/");
      },
      onError: () => toast.error("Не удалось авторизоваться")
    });
  };
  const handleChangeMode = () => theme.set(theme.value === "dark" ? "light" : "dark");
  return /* @__PURE__ */ jsxs("div", {
    className: "relative flex h-screen flex-col items-center justify-center",
    children: [/* @__PURE__ */ jsx(Button, {
      className: "border-border absolute top-5 right-5 h-10 w-10 md:top-20 md:right-20 md:h-8 md:w-8",
      size: "icon",
      variant: "secondary",
      onClick: handleChangeMode,
      children: theme.value === "dark" ? /* @__PURE__ */ jsx(SunIcon, {}) : /* @__PURE__ */ jsx(MoonIcon, {})
    }), /* @__PURE__ */ jsxs("div", {
      className: "mx-5 flex max-w-[380px] flex-col items-center justify-center md:mx-0",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "mb-7 flex items-center justify-center gap-1",
        children: [/* @__PURE__ */ jsx("img", {
          alt: "delivery",
          className: "h-8 w-8",
          src: "/logo.png"
        }), /* @__PURE__ */ jsx(H3, {
          children: "DELIVERY"
        })]
      }), isSendingPhone ? /* @__PURE__ */ jsxs(Fragment, {
        children: [/* @__PURE__ */ jsx(H2, {
          children: "Авторизация"
        }), /* @__PURE__ */ jsx(P, {
          className: "mb-6",
          children: "Введите номер телефона для входа в свой профиль"
        }), /* @__PURE__ */ jsxs(Form, {
          className: "w-full",
          form: formPhone,
          onSubmit: handleSubmitPhone,
          children: [/* @__PURE__ */ jsx(FormInput, {
            ref: withMask("+7 (999) 999-99-99"),
            className: "min-w-full",
            label: "Телефон",
            name: "phone",
            placeholder: "+7 (___) ___-__-__"
          }), /* @__PURE__ */ jsxs(Button, {
            className: "mt-8 w-full",
            disabled: authOtpMutation.isPending,
            size: "lg",
            type: "submit",
            children: [authOtpMutation.isPending && /* @__PURE__ */ jsx(Spinner, {
              "data-icon": "inline-start"
            }), "Войти"]
          })]
        }, "phone_form")]
      }) : /* @__PURE__ */ jsxs(Fragment, {
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex w-full items-center justify-between",
          children: [/* @__PURE__ */ jsx(ChevronLeftIcon, {
            className: "cursor-pointer",
            onClick: () => togglIsSendingPhone()
          }), /* @__PURE__ */ jsx(H2, {
            children: "Проверочный код"
          }), /* @__PURE__ */ jsx("div", {})]
        }), /* @__PURE__ */ jsx(P, {
          className: "mb-6",
          children: "На указанный вами номер был отправлен проверочный код"
        }), /* @__PURE__ */ jsx(InputOTP, {
          maxLength: 6,
          onChange: setCode,
          children: /* @__PURE__ */ jsxs(InputOTPGroup, {
            children: [/* @__PURE__ */ jsx(InputOTPSlot, {
              className: "h-[40px] w-[63px]",
              index: 0
            }), /* @__PURE__ */ jsx(InputOTPSlot, {
              className: "h-[40px] w-[63px]",
              index: 1
            }), /* @__PURE__ */ jsx(InputOTPSlot, {
              className: "h-[40px] w-[63px]",
              index: 2
            }), /* @__PURE__ */ jsx(InputOTPSlot, {
              className: "h-[40px] w-[63px]",
              index: 3
            }), /* @__PURE__ */ jsx(InputOTPSlot, {
              className: "h-[40px] w-[63px]",
              index: 4
            }), /* @__PURE__ */ jsx(InputOTPSlot, {
              className: "h-[40px] w-[63px]",
              index: 5
            })]
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-8 flex w-full flex-col gap-4",
          children: [/* @__PURE__ */ jsxs(Button, {
            disabled: signInUserMutation.isPending,
            size: "lg",
            onClick: () => handleSubmitOtpCode(),
            children: [signInUserMutation.isPending && /* @__PURE__ */ jsx(Spinner, {
              "data-icon": "inline-start"
            }), "Войти"]
          }), /* @__PURE__ */ jsx(Button, {
            disabled: otpTimer.active,
            size: "lg",
            type: "submit",
            variant: "outline",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex w-full justify-between",
              children: [/* @__PURE__ */ jsx("div", {}), /* @__PURE__ */ jsx("div", {
                children: "Отправить код повторно"
              }), /* @__PURE__ */ jsx("div", {
                children: otpTimer.active && formatDate(new Date(otpTimer.count * 1e3), "mm:ss")
              })]
            })
          })]
        })]
      })]
    })]
  });
};
const auth = UNSAFE_withComponentProps(Auth);
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: auth
}, Symbol.toStringTag, { value: "Module" }));
const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const tokenStorage = useAuthTokenLocalStorage();
  const handleChangeMode = () => theme.set(theme.value === "dark" ? "light" : "dark");
  const handleNavigateToProfile = () => navigate("/profile");
  const handleNavigateToHome = () => navigate("/");
  const handleNavigateToHistory = () => navigate("/history");
  const handleExit = () => {
    navigate("/auth");
    tokenStorage.remove();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-3 mt-5 hidden items-center justify-between rounded-full border p-3 md:flex xl:mx-auto xl:max-w-[75rem]", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          className: "flex cursor-pointer items-center gap-1",
          tabIndex: 0,
          onClick: handleNavigateToHome,
          children: [
            /* @__PURE__ */ jsx("img", { alt: "delivery", className: "h-8 w-8", src: "/logo.png" }),
            /* @__PURE__ */ jsx(H4, { children: "Delivery" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Button, { size: "icon", variant: "secondary", onClick: handleNavigateToHistory, children: /* @__PURE__ */ jsx(HistoryIcon, {}) }),
        /* @__PURE__ */ jsx(Button, { size: "icon", variant: "secondary", onClick: handleNavigateToProfile, children: /* @__PURE__ */ jsx(UserIcon, {}) }),
        /* @__PURE__ */ jsx(Button, { size: "icon", variant: "secondary", onClick: handleChangeMode, children: theme.value === "dark" ? /* @__PURE__ */ jsx(SunIcon, {}) : /* @__PURE__ */ jsx(MoonIcon, {}) }),
        /* @__PURE__ */ jsxs(Button, { className: "bg-brand text-white", size: "sm", onClick: handleExit, children: [
          "Выйти",
          /* @__PURE__ */ jsx(LogOutIcon, {})
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "fixed right-3 bottom-4 left-3 z-10 h-[58px] rounded-full border md:hidden", children: /* @__PURE__ */ jsxs("div", { className: "bg-background grid h-full grid-cols-3 rounded-full p-1", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          className: clsx$1(location.pathname === "/" && "bg-brand text-white", "h-full w-full"),
          variant: "ghost",
          onClick: handleNavigateToHome,
          children: [
            /* @__PURE__ */ jsx(CalculatorIcon, {}),
            "Расчёт"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          className: clsx$1(
            location.pathname === "/history" && "bg-brand text-white",
            "h-full w-full"
          ),
          variant: "ghost",
          onClick: handleNavigateToHistory,
          children: [
            /* @__PURE__ */ jsx(HistoryIcon, {}),
            "История"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          className: clsx$1(
            location.pathname === "/profile" && "bg-brand text-white",
            "h-full w-full"
          ),
          variant: "ghost",
          onClick: handleNavigateToProfile,
          children: [
            /* @__PURE__ */ jsx(UserIcon, {}),
            "Профиль"
          ]
        }
      )
    ] }) })
  ] });
};
const ProtectedRoute = () => {
  const {
    isAuthenticated
  } = useAuth();
  const [mounted, setMounted] = useState(false);
  useMount(() => setMounted(true));
  if (!mounted) return null;
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsx(Navigate, {
      replace: true,
      to: "/auth"
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "relative",
    children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsx(Outlet, {})]
  });
};
const protectedRoute = UNSAFE_withComponentProps(ProtectedRoute);
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: protectedRoute
}, Symbol.toStringTag, { value: "Module" }));
const Main = ({ children, className, ...props }) => /* @__PURE__ */ jsx("div", { className: `mx-3 pb-20 lg:pb-0 xl:mx-auto xl:max-w-[75rem] ${className ?? ""}`, ...props, children });
const EllipseIcon = (props) => /* @__PURE__ */ jsx("svg", { height: "16", viewBox: "0 0 16 16", width: "16", xmlns: "http://www.w3.org/2000/svg", ...props, children: /* @__PURE__ */ jsx(
  "path",
  {
    d: "M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM3.36 8C3.36 10.5626 5.4374 12.64 8 12.64C10.5626 12.64 12.64 10.5626 12.64 8C12.64 5.4374 10.5626 3.36 8 3.36C5.4374 3.36 3.36 5.4374 3.36 8Z",
    fill: "currentColor"
  }
) });
const GitHubIcon = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    height: "1024",
    viewBox: "0 0 1024 1024",
    width: "1024",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        "clip-rule": "evenodd",
        d: "M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z",
        fill: "currentColor",
        "fill-rule": "evenodd",
        transform: "scale(64)"
      }
    )
  }
);
const Footer = () => /* @__PURE__ */ jsxs("div", { className: "col-span-2 flex items-center justify-between rounded-3xl border px-4 py-4", children: [
  /* @__PURE__ */ jsx(Muted, { children: "@Your Delivery" }),
  /* @__PURE__ */ jsxs(
    "a",
    {
      className: "flex items-center gap-2",
      href: "https://github.com/tungulin/juniorsbootcamp-projects",
      target: "_blank",
      children: [
        /* @__PURE__ */ jsx(GitHubIcon, { height: 20, width: 20 }),
        /* @__PURE__ */ jsx(Muted, { children: "Project" })
      ]
    }
  )
] });
const InputGroup = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "group/input-group border-input has-disabled:bg-input/50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 relative flex h-8 w-full min-w-0 items-center rounded-lg border transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-3 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
      className
    ),
    "data-slot": "input-group",
    role: "group",
    ...props
  }
);
const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
        "inline-end": "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
        "block-start": "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "block-end": "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2"
      }
    },
    defaultVariants: {
      align: "inline-start"
    }
  }
);
const InputGroupAddon = ({
  className,
  align = "inline-start",
  onClick,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(inputGroupAddonVariants({ align }), className),
    "data-align": align,
    "data-slot": "input-group-addon",
    role: "presentation",
    onClick: (e) => {
      if (e.target.closest("button")) {
        return;
      }
      e.currentTarget.parentElement?.querySelector("input")?.focus();
      onClick?.(e);
    },
    ...props
  }
);
const inputGroupButtonVariants = cva("flex items-center gap-2 text-sm shadow-none", {
  variants: {
    size: {
      xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
      sm: "",
      "icon-xs": "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
      "icon-sm": "size-8 p-0 has-[>svg]:p-0"
    }
  },
  defaultVariants: {
    size: "xs"
  }
});
const InputGroupButton = ({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}) => /* @__PURE__ */ jsx(
  Button,
  {
    className: cn(inputGroupButtonVariants({ size }), className),
    "data-size": size,
    type,
    variant,
    ...props
  }
);
const InputGroupInput = ({ className, ...props }) => /* @__PURE__ */ jsx(
  Input,
  {
    className: cn(
      "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
      className
    ),
    "data-slot": "input-group-control",
    ...props
  }
);
const Combobox = Combobox$1.Root;
const ComboboxTrigger = ({ className, children, ...props }) => /* @__PURE__ */ jsxs(
  Combobox$1.Trigger,
  {
    className: cn("[&_svg:not([class*='size-'])]:size-4", className),
    "data-slot": "combobox-trigger",
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDownIcon, { className: "text-muted-foreground pointer-events-none size-4" })
    ]
  }
);
const ComboboxClear = ({ className, ...props }) => /* @__PURE__ */ jsx(
  Combobox$1.Clear,
  {
    className: cn(className),
    "data-slot": "combobox-clear",
    render: /* @__PURE__ */ jsx(InputGroupButton, { size: "icon-xs", variant: "ghost" }),
    ...props,
    children: /* @__PURE__ */ jsx(XIcon, { className: "pointer-events-none" })
  }
);
const ComboboxInput = ({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}) => /* @__PURE__ */ jsxs(InputGroup, { className: cn("w-auto", className), children: [
  /* @__PURE__ */ jsx(Combobox$1.Input, { render: /* @__PURE__ */ jsx(InputGroupInput, { disabled }), ...props }),
  /* @__PURE__ */ jsxs(InputGroupAddon, { align: "inline-end", children: [
    showTrigger && /* @__PURE__ */ jsx(
      InputGroupButton,
      {
        className: "group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent",
        "data-slot": "input-group-button",
        disabled,
        render: /* @__PURE__ */ jsx(ComboboxTrigger, {}),
        size: "icon-xs",
        variant: "ghost"
      }
    ),
    showClear && /* @__PURE__ */ jsx(ComboboxClear, { disabled })
  ] }),
  children
] });
const ComboboxContent = ({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}) => /* @__PURE__ */ jsx(Combobox$1.Portal, { children: /* @__PURE__ */ jsx(
  Combobox$1.Positioner,
  {
    align,
    alignOffset,
    anchor,
    className: "isolate z-50",
    side,
    sideOffset,
    children: /* @__PURE__ */ jsx(
      Combobox$1.Popup,
      {
        className: cn(
          "group/combobox-content bg-popover text-popover-foreground ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-lg shadow-md ring-1 duration-100 data-[chips=true]:min-w-(--anchor-width) *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:shadow-none",
          className
        ),
        "data-chips": !!anchor,
        "data-slot": "combobox-content",
        ...props
      }
    )
  }
) });
const ComboboxList = ({ className, ...props }) => /* @__PURE__ */ jsx(
  Combobox$1.List,
  {
    className: cn(
      "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
      className
    ),
    "data-slot": "combobox-list",
    ...props
  }
);
const ComboboxItem = ({ className, children, ...props }) => /* @__PURE__ */ jsxs(
  Combobox$1.Item,
  {
    className: cn(
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    ),
    "data-slot": "combobox-item",
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(
        Combobox$1.ItemIndicator,
        {
          render: /* @__PURE__ */ jsx(
            "span",
            {
              className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center",
              "data-slot": "combobox-item-indicator"
            }
          ),
          children: /* @__PURE__ */ jsx(CheckIcon, { className: "pointer-events-none" })
        }
      )
    ]
  }
);
const ComboboxEmpty = ({ className, ...props }) => /* @__PURE__ */ jsx(
  Combobox$1.Empty,
  {
    className: cn(
      "text-muted-foreground hidden w-full justify-center py-2 text-center text-sm group-data-empty/combobox-content:flex",
      className
    ),
    "data-slot": "combobox-empty",
    ...props
  }
);
function useComboboxAnchor() {
  return React.useRef(null);
}
const CityCombobox = (props) => {
  const { label, onChange, colorPoint, placeholder } = props;
  const anchor = useComboboxAnchor();
  const getDeliveryPointsQuery = useGetApiDeliveryPointsQuery();
  const [value, setValue] = useControllableState({
    initialValue: null,
    onChange
  });
  const cities = getDeliveryPointsQuery.data?.data?.points ?? [];
  const suggestedCities = useMemo(() => cities.slice(0, 3), [cities]);
  const handleClickSuggestedCity = (city) => setValue(city);
  const disabled = getDeliveryPointsQuery.isError || getDeliveryPointsQuery.isLoading;
  return /* @__PURE__ */ jsxs(
    Combobox,
    {
      disabled,
      items: cities,
      itemToStringLabel: (_package) => _package.name,
      value,
      onValueChange: setValue,
      children: [
        /* @__PURE__ */ jsxs("div", { ref: anchor, children: [
          label && /* @__PURE__ */ jsx(Small, { className: "text-muted-foreground mb-3", children: label }),
          /* @__PURE__ */ jsx(
            ComboboxInput,
            {
              className: "h-[48px] rounded-full",
              disabled,
              placeholder,
              children: /* @__PURE__ */ jsx(InputGroupAddon, { children: /* @__PURE__ */ jsx(EllipseIcon, { className: "mr-1", color: colorPoint }) })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mt-3 flex h-[14px] cursor-pointer gap-3", children: suggestedCities.map((city) => /* @__PURE__ */ jsx(
            Small,
            {
              className: "text-muted-foreground underline",
              onClick: () => handleClickSuggestedCity(city),
              children: city.name
            },
            city.id
          )) })
        ] }),
        /* @__PURE__ */ jsxs(ComboboxContent, { anchor, side: "bottom", children: [
          /* @__PURE__ */ jsx(ComboboxEmpty, { children: "Такого города нету..." }),
          /* @__PURE__ */ jsx(ComboboxList, { children: (city) => /* @__PURE__ */ jsx(ComboboxItem, { value: city, children: city.name }, city.name) })
        ] })
      ]
    }
  );
};
const Dialog = ({ ...props }) => /* @__PURE__ */ jsx(Dialog$1.Root, { "data-slot": "dialog", ...props });
const DialogPortal = ({ ...props }) => /* @__PURE__ */ jsx(Dialog$1.Portal, { "data-slot": "dialog-portal", ...props });
const DialogOverlay = ({ className, ...props }) => /* @__PURE__ */ jsx(
  Dialog$1.Backdrop,
  {
    className: cn(
      "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs",
      className
    ),
    "data-slot": "dialog-overlay",
    ...props
  }
);
const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  ...props
}) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    Dialog$1.Popup,
    {
      className: cn(
        "bg-popover text-popover-foreground ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-3xl p-4 text-sm ring-1 duration-100 outline-none sm:max-w-sm",
        className
      ),
      "data-slot": "dialog-content",
      ...props,
      children: [
        children,
        showCloseButton && /* @__PURE__ */ jsxs(
          Dialog$1.Close,
          {
            "data-slot": "dialog-close",
            render: /* @__PURE__ */ jsx(Button, { className: "absolute top-2 right-2", size: "icon-sm", variant: "ghost" }),
            children: [
              /* @__PURE__ */ jsx(XIcon, {}),
              /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
            ]
          }
        )
      ]
    }
  )
] });
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col gap-2", className), "data-slot": "dialog-header", ...props });
const DialogTitle = ({ className, ...props }) => /* @__PURE__ */ jsx(
  Dialog$1.Title,
  {
    className: cn("font-heading text-base leading-none font-medium", className),
    "data-slot": "dialog-title",
    ...props
  }
);
const DialogDescription = ({ className, ...props }) => /* @__PURE__ */ jsx(
  Dialog$1.Description,
  {
    className: cn(
      "text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3",
      className
    ),
    "data-slot": "dialog-description",
    ...props
  }
);
const STATUS_MAP = {
  in_processing: "В обработке",
  waiting_courier: "Ожидание курьера",
  on_my_way: "В пути",
  success: "Доставлен",
  canceled: "Отменен"
};
const OrderDialog = (props) => {
  const { order, open, onOpenChange } = props;
  if (!order) {
    return null;
  }
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-lg", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
      "Заказ #",
      order._id
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Статус" }),
        /* @__PURE__ */ jsx("span", { children: STATUS_MAP[order.status] ?? order.status })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Тип доставки" }),
        /* @__PURE__ */ jsx("span", { children: order.option === "EXPRESS" ? "Экспресс" : "Стандарт" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Стоимость" }),
        /* @__PURE__ */ jsxs("span", { children: [
          order.price,
          " ₽"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Плательщик" }),
        /* @__PURE__ */ jsx("span", { children: order.payer === "SENDER" ? "Отправитель" : "Получатель" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Откуда" }),
        /* @__PURE__ */ jsx("span", { children: order.senderPoint.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Куда" }),
        /* @__PURE__ */ jsx("span", { children: order.receiverPoint.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Отправитель" }),
        /* @__PURE__ */ jsxs("span", { children: [
          order.sender.lastname,
          " ",
          order.sender.firstname
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Получатель" }),
        /* @__PURE__ */ jsxs("span", { children: [
          order.receiver.lastname,
          " ",
          order.receiver.firstname
        ] })
      ] })
    ] })
  ] }) });
};
const toSizeString = (value) => `${value.height}x${value.width}x${value.length}`;
const PackageSizeCombobox = (props) => {
  const { onChange } = props;
  const getTypesPackageQuery = useGetApiDeliveryPackageTypesQuery();
  const packages = getTypesPackageQuery.data?.data?.packages ?? [];
  const [value, setValue] = useControllableState({
    initialValue: null,
    onChange
  });
  const disabled = getTypesPackageQuery.isError || getTypesPackageQuery.isLoading;
  return /* @__PURE__ */ jsxs(
    Combobox,
    {
      disabled,
      items: packages,
      itemToStringLabel: (_package) => _package.name,
      value,
      onValueChange: setValue,
      children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Small, { className: "text-muted-foreground mb-3", children: "Размер посылки" }),
          /* @__PURE__ */ jsx(ComboboxInput, { readOnly: true, className: "h-[48px] rounded-full", placeholder: "Выберите размер" })
        ] }),
        /* @__PURE__ */ jsx(ComboboxContent, { className: "rounded-xl p-4", side: "bottom", children: /* @__PURE__ */ jsx(ComboboxList, { children: packages.map((packageSize) => /* @__PURE__ */ jsx(
          ComboboxItem,
          {
            className: "relative my-2 h-[80px] p-0 data-highlighted:bg-transparent data-highlighted:text-inherit",
            value: packageSize,
            children: /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center gap-3 rounded-xl border-1 p-4", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Large, { children: packageSize.name }),
              /* @__PURE__ */ jsxs(Small, { className: "text-foreground", children: [
                toSizeString(packageSize),
                " см"
              ] })
            ] }) })
          },
          packageSize.id
        )) }) })
      ]
    }
  );
};
const Home = () => {
  const navigate = useNavigate();
  const [senderPoint, setSenderPoint] = useState(null);
  const [receiverPoint, setReceiverPoint] = useState(null);
  const [sizePackage, setSizePackage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const orderIdRef = useRef("");
  const searchOrderMutation = useGetApiDeliveryOrderByOrderIdMutation();
  const handleCalculateDelivery = () => {
    const params = new URLSearchParams({
      senderPoint: JSON.stringify(senderPoint),
      receiverPoint: JSON.stringify(receiverPoint),
      size: JSON.stringify(sizePackage)
    });
    navigate(`/delivery?${params}`);
  };
  const handleSearchOrder = () => {
    if (!orderIdRef.current.trim()) return;
    searchOrderMutation.mutate({
      path: {
        orderId: orderIdRef.current
      }
    }, {
      onSuccess: () => setDialogOpen(true),
      onError: () => toast.error("Заказ не найден")
    });
  };
  const disabled = !senderPoint || !receiverPoint || !sizePackage;
  const order = searchOrderMutation.data?.data?.order;
  return /* @__PURE__ */ jsxs(Main, {
    children: [/* @__PURE__ */ jsxs("div", {
      className: "mt-5 flex grid-cols-2 flex-col gap-4 md:grid",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "rounded-3xl border p-4 lg:p-8",
        children: [/* @__PURE__ */ jsx(H3, {
          className: "mb-6",
          children: "Рассчитать доставку"
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col gap-10",
          children: [/* @__PURE__ */ jsx(CityCombobox, {
            colorPoint: "green",
            label: "Город отправки",
            placeholder: "Укажи город отправления",
            onChange: setSenderPoint
          }), /* @__PURE__ */ jsx(CityCombobox, {
            label: "Город назначения",
            placeholder: "Укажи город назначения",
            onChange: setReceiverPoint
          }), /* @__PURE__ */ jsx(PackageSizeCombobox, {
            onChange: setSizePackage
          }), /* @__PURE__ */ jsx(Button, {
            className: "bg-brand text-white",
            disabled,
            size: "lg",
            onClick: handleCalculateDelivery,
            children: "Рассчитать"
          })]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex h-full flex-col gap-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "relative h-[50%] rounded-3xl border bg-[#6AC66A] bg-[url('/bg-muted.png')] bg-cover bg-center p-4 lg:p-8",
          children: [/* @__PURE__ */ jsx(H3, {
            className: "text-white",
            children: "Бесплатная доставка"
          }), /* @__PURE__ */ jsx(P, {
            className: "font-normal text-white",
            children: "за приведенного друга"
          }), /* @__PURE__ */ jsx("img", {
            alt: "доставщик",
            className: "absolute top-0 right-0 h-full w-auto",
            src: "/deliver.png"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "h-[50%] rounded-3xl border bg-[url('/bg-muted-2.png')] bg-cover bg-center p-4 lg:p-8",
          children: [/* @__PURE__ */ jsx(H3, {
            className: "mb-6 text-white",
            children: "Отследить поссылку"
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(Input, {
              className: "bg-white! text-black! placeholder:text-gray-400!",
              placeholder: "Номер заказа",
              onChange: (e) => orderIdRef.current = e.target.value
            }), /* @__PURE__ */ jsx(Button, {
              className: "w-[5rem]",
              disabled: searchOrderMutation.isPending,
              size: "lg",
              onClick: handleSearchOrder,
              children: "Найти"
            })]
          })]
        })]
      }), /* @__PURE__ */ jsx(Footer, {})]
    }), /* @__PURE__ */ jsx(OrderDialog, {
      open: dialogOpen,
      order,
      onOpenChange: setDialogOpen
    })]
  });
};
const route$1 = UNSAFE_withComponentProps(Home);
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: route$1
}, Symbol.toStringTag, { value: "Module" }));
const profileSchema = z.object({
  lastname: z.string().min(2, "Фамилия должна содержать минимум 2 символа").max(20, "Фамилия слишком длинная"),
  firstname: z.string().min(2, "Имя должно содержать минимум 2 символа").max(20, "Имя слишком длинное"),
  middlename: z.string().max(20, "Отчество слишком длинное").optional().or(z.literal("")),
  email: z.email("Некорректный email"),
  city: z.string().min(2, "Укажите город").max(100, "Название города слишком длинное")
});
const Profile = () => {
  const {
    user
  } = useAuth();
  const userStorage = useUserLocalStorage();
  const patchProfileMutation = usePatchApiUsersProfileMutation();
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      lastname: user?.lastname ?? "",
      firstname: user?.firstname ?? "",
      email: user?.email ?? "",
      middlename: user?.middlename ?? "",
      city: user?.city ?? ""
    }
  });
  const handleSubmitForm = (fields) => {
    patchProfileMutation.mutate({
      body: {
        profile: fields,
        phone: user.phone
      }
    }, {
      onSuccess: (response) => {
        userStorage.set(response.data.user);
      }
    });
  };
  return /* @__PURE__ */ jsxs(Main, {
    children: [/* @__PURE__ */ jsx(H2, {
      children: "Профиль"
    }), /* @__PURE__ */ jsx(Form, {
      form,
      onSubmit: handleSubmitForm,
      children: /* @__PURE__ */ jsxs("div", {
        className: "mt-8 flex grid-cols-2 flex-col gap-2 md:grid md:gap-4",
        children: [/* @__PURE__ */ jsx(FormInput, {
          label: "Фамилия",
          name: "lastname",
          placeholder: "Диназавриков"
        }), /* @__PURE__ */ jsx(FormInput, {
          disabled: true,
          ref: withMask("+7 (999) 999-99-99"),
          label: "Телефон",
          name: "phone",
          placeholder: "+7 (___) ___-__-__",
          value: user.phone
        }), /* @__PURE__ */ jsx(FormInput, {
          label: "Имя",
          name: "firstname",
          placeholder: "Динозаврик"
        }), /* @__PURE__ */ jsx(FormInput, {
          label: "Email",
          name: "email",
          placeholder: "ivanov@example.com"
        }), /* @__PURE__ */ jsx(FormInput, {
          label: "Отчество",
          name: "middlename",
          placeholder: "Динозаврикович"
        }), /* @__PURE__ */ jsx(FormInput, {
          label: "Город",
          name: "city",
          placeholder: "Москва"
        }), /* @__PURE__ */ jsxs(Button, {
          className: "mt-8",
          disabled: patchProfileMutation.isPending,
          size: "lg",
          type: "submit",
          children: [patchProfileMutation.isPending && /* @__PURE__ */ jsx(Spinner, {
            "data-icon": "inline-start"
          }), "Обновить данные"]
        })]
      })
    })]
  });
};
const profile = UNSAFE_withComponentProps(Profile);
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: profile
}, Symbol.toStringTag, { value: "Module" }));
const formatAddress = (address) => `ул. ${address.street}, д. ${address.house}, кв. ${address.apartment}`;
const formatFio = (person) => `${person.lastname} ${person.firstname} ${person.middlename}, ${person.phone}`;
const STATUS_MAPA = {
  in_processing: "В процессе",
  waiting_courier: "Ожидание курьера",
  success: "Доставлен",
  on_my_way: "В пути",
  canceled: "Отменен"
};
const History = () => {
  const deliveryOrderQuery = useGetApiDeliveryOrdersQuery();
  const cancelDeliveryMutation = usePutApiDeliveryOrdersCancelMutation();
  const queryClient2 = useQueryClient();
  const orders = deliveryOrderQuery.data?.data?.orders ?? [];
  const handleCancelDelivery = (orderId) => cancelDeliveryMutation.mutate({
    body: {
      orderId
    }
  }, {
    onSuccess: () => {
      toast.success("Заказ отменен!");
      queryClient2.invalidateQueries({
        queryKey: [getApiDeliveryOrdersQueryKey]
      });
    },
    onError: () => toast.error("Не удалось отменить заказ")
  });
  if (deliveryOrderQuery.isLoading) {
    return /* @__PURE__ */ jsxs(Main, {
      children: [/* @__PURE__ */ jsx(H4, {
        className: "mt-5",
        children: "История отправлений"
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-center justify-center",
        children: [/* @__PURE__ */ jsx("img", {
          alt: "loading",
          className: "mt-20 w-50",
          src: "/deliver-calc.png"
        }), /* @__PURE__ */ jsx(Large, {
          children: "Загружает вашу историю..."
        })]
      })]
    });
  }
  if (deliveryOrderQuery.isError) {
    return /* @__PURE__ */ jsx(Main, {
      children: /* @__PURE__ */ jsxs("div", {
        className: "w-full",
        children: [/* @__PURE__ */ jsx(H4, {
          className: "mt-5",
          children: "История отправлений"
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col items-center justify-center gap-5",
          children: [/* @__PURE__ */ jsx("img", {
            alt: "error",
            className: "mt-20 w-50",
            src: "/error-feedback.png"
          }), /* @__PURE__ */ jsx(Large, {
            children: "Не удалось отобразить историю"
          }), /* @__PURE__ */ jsxs(Button, {
            onClick: () => window.location.reload(),
            children: [/* @__PURE__ */ jsx(RefreshCwIcon, {
              size: 20
            }), "Обновить страницу"]
          })]
        })]
      })
    });
  }
  return /* @__PURE__ */ jsxs(Main, {
    children: [/* @__PURE__ */ jsx(H4, {
      className: "mt-5",
      children: "История отправлений"
    }), /* @__PURE__ */ jsx("div", {
      className: "mt-6",
      children: orders.map((order) => /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex flex-col gap-1 py-3 md:hidden",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            children: [/* @__PURE__ */ jsx(Small, {
              className: "font-medium",
              children: STATUS_MAPA[order.status] ?? order.status
            }), order.status !== "canceled" && /* @__PURE__ */ jsx(Button, {
              size: "sm",
              variant: "outline",
              onClick: () => handleCancelDelivery(order._id),
              children: "Отменить"
            })]
          }), /* @__PURE__ */ jsx(Small, {
            className: "text-muted-foreground",
            children: formatAddress(order.receiverAddress)
          }), /* @__PURE__ */ jsx(Small, {
            className: "text-muted-foreground",
            children: order._id
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "hidden h-[60px] grid-cols-8 items-center md:grid",
          children: [/* @__PURE__ */ jsx(Small, {
            className: "col-span-1",
            children: STATUS_MAPA[order.status] ?? order.status
          }), /* @__PURE__ */ jsx(Small, {
            className: "col-span-3",
            children: formatAddress(order.receiverAddress)
          }), /* @__PURE__ */ jsx(Small, {
            className: "col-span-3",
            children: order._id
          }), /* @__PURE__ */ jsx("div", {
            className: "col-span-1",
            children: order.status !== "canceled" && /* @__PURE__ */ jsx(Button, {
              variant: "outline",
              onClick: () => handleCancelDelivery(order._id),
              children: "Отменить"
            })
          })]
        }), /* @__PURE__ */ jsx(Separator, {})]
      }, order._id))
    })]
  });
};
const history = UNSAFE_withComponentProps(History);
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: history
}, Symbol.toStringTag, { value: "Module" }));
const Breadcrumb = ({ className, ...props }) => /* @__PURE__ */ jsx("nav", { "aria-label": "breadcrumb", className: cn(className), "data-slot": "breadcrumb", ...props });
const BreadcrumbList = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "ol",
  {
    className: cn(
      "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-word",
      className
    ),
    "data-slot": "breadcrumb-list",
    ...props
  }
);
const BreadcrumbItem = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "li",
  {
    className: cn("inline-flex items-center gap-1", className),
    "data-slot": "breadcrumb-item",
    ...props
  }
);
function BreadcrumbLink({ className, render, ...props }) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps(
      {
        className: cn("transition-colors hover:text-foreground", className)
      },
      props
    ),
    render,
    state: {
      slot: "breadcrumb-link"
    }
  });
}
const BreadcrumbSeparator = ({ children, className, ...props }) => /* @__PURE__ */ jsx(
  "li",
  {
    "aria-hidden": "true",
    className: cn("[&>svg]:size-3.5", className),
    "data-slot": "breadcrumb-separator",
    role: "presentation",
    ...props,
    children: children ?? /* @__PURE__ */ jsx(ChevronRightIcon, {})
  }
);
const ProgressTrack = ({ className, ...props }) => /* @__PURE__ */ jsx(
  Progress$1.Track,
  {
    className: cn(
      "bg-muted relative flex h-1 w-full items-center overflow-x-hidden rounded-full",
      className
    ),
    "data-slot": "progress-track",
    ...props
  }
);
const ProgressIndicator = ({ className, ...props }) => /* @__PURE__ */ jsx(
  Progress$1.Indicator,
  {
    className: cn("bg-primary h-full transition-all", className),
    "data-slot": "progress-indicator",
    ...props
  }
);
const Progress = ({ className, children, value, ...props }) => /* @__PURE__ */ jsxs(
  Progress$1.Root,
  {
    className: cn("flex flex-wrap gap-3", className),
    "data-slot": "progress",
    value,
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ProgressTrack, { children: /* @__PURE__ */ jsx(ProgressIndicator, {}) })
    ]
  }
);
const createBareContext = (value) => {
  const Context = createContext(null);
  const useUnsafeContext = () => use(Context);
  const Provider2 = ({ children, value: value2 }) => /* @__PURE__ */ jsx(Context, { value: value2, children });
  return [Provider2, useUnsafeContext];
};
const [DeliveryProvider, useDeliveryContext] = createBareContext();
const deliveryAddressFormSchema = z$1.object({
  street: z$1.string().min(2, "Введите название улицы").max(30, "Название улицы слишком длинное"),
  house: z$1.string().min(1, "Введите номер дома").regex(/^\d+$/, "Только цифры"),
  apartment: z$1.string().min(1, "Введите номер квартиры").regex(/^\d+$/, "Только цифры"),
  comment: z$1.string()
});
const DeliveryAddressStep = () => {
  const context = useDeliveryContext();
  const senderAddress = context.deliveryOrder.senderAddress ?? {};
  const form = useForm({
    resolver: zodResolver(deliveryAddressFormSchema),
    defaultValues: {
      street: senderAddress.street ?? "",
      house: senderAddress.house ?? "",
      apartment: senderAddress.apartment ?? "",
      comment: senderAddress.comment ?? ""
    }
  });
  const handleSubmitForm = (fields) => {
    context.setDeliveryOrder({ ...context.deliveryOrder, senderAddress: fields });
    context.stepper.next();
  };
  return /* @__PURE__ */ jsxs(Form, { className: "w-full", form, onSubmit: handleSubmitForm, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 pr-4", children: [
      /* @__PURE__ */ jsx(FormInput, { label: "Улица", name: "street", placeholder: "Улица" }),
      /* @__PURE__ */ jsx(FormInput, { inputMode: "numeric", label: "Дом", name: "house", placeholder: "Номер дома" }),
      /* @__PURE__ */ jsx(
        FormInput,
        {
          inputMode: "numeric",
          label: "Квартира",
          name: "apartment",
          placeholder: "Номер квартиры"
        }
      ),
      /* @__PURE__ */ jsx(
        FormTextarea,
        {
          className: "max-h-40",
          label: "Заметка для курьера",
          maxLength: 200,
          name: "comment",
          placeholder: "Комментарий для курьера"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "mt-5 flex gap-2", children: [
      /* @__PURE__ */ jsx(Button, { className: "flex-1", size: "lg", variant: "secondary", onClick: context.stepper.back, children: "Назад" }),
      /* @__PURE__ */ jsx(Button, { className: "flex-1", size: "lg", type: "submit", children: "Вперед" })
    ] }) })
  ] }, "phone_form");
};
const RadioGroup = ({ className, ...props }) => /* @__PURE__ */ jsx(
  RadioGroup$1,
  {
    className: cn("grid w-full gap-2", className),
    "data-slot": "radio-group",
    ...props
  }
);
const RadioGroupItem = ({ className, ...props }) => /* @__PURE__ */ jsx(
  Radio.Root,
  {
    className: cn(
      "group/radio-group-item peer border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary relative flex aspect-square size-4 shrink-0 rounded-full border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3",
      className
    ),
    "data-slot": "radio-group-item",
    ...props,
    children: /* @__PURE__ */ jsx(
      Radio.Indicator,
      {
        className: "flex size-4 items-center justify-center",
        "data-slot": "radio-group-indicator",
        children: /* @__PURE__ */ jsx("span", { className: "bg-primary-foreground absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full" })
      }
    )
  }
);
const DeliveryPaymentStep = () => {
  const context = useDeliveryContext();
  const [payer, setPayer] = useState(context.deliveryOrder.payer ?? "sender");
  const handleClickNext = () => {
    context.setDeliveryOrder({ ...context.deliveryOrder, payer });
    context.stepper.next();
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsx(Small, { className: "mb-6", children: "Кто оплачивает доставку" }),
    /* @__PURE__ */ jsxs(
      RadioGroup,
      {
        className: "flex w-fit flex-col gap-5",
        defaultValue: payer,
        onValueChange: setPayer,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(RadioGroupItem, { id: "r1", value: "receiver" }),
            /* @__PURE__ */ jsx(Label, { htmlFor: "r1", children: "Получатель" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(RadioGroupItem, { id: "r2", value: "sender" }),
            /* @__PURE__ */ jsx(Label, { htmlFor: "r2", children: "Отправитель" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-20 flex gap-2", children: [
      /* @__PURE__ */ jsx(Button, { className: "flex-1", size: "lg", variant: "secondary", onClick: context.stepper.back, children: "Назад" }),
      /* @__PURE__ */ jsx(Button, { className: "flex-1", size: "lg", onClick: handleClickNext, children: "Вперед" })
    ] })
  ] });
};
const nounWord = (value, words) => {
  const _value = Math.abs(value) % 100;
  const num = _value % 10;
  if (_value > 10 && _value < 20) {
    return words[2];
  }
  if (num > 1 && num < 5) {
    return words[1];
  }
  if (num === 1) {
    return words[0];
  }
  return words[2];
};
const pointSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number()
});
const sizeSchema = z.object({
  height: z.number(),
  id: z.string(),
  length: z.number(),
  name: z.string(),
  weight: z.number(),
  width: z.number()
});
const formatPrice = (price) => new Intl.NumberFormat("ru-RU").format(price);
const DeliveryTypeStep = () => {
  const [{ senderPoint, receiverPoint, size }] = useQueryStates({
    senderPoint: parseAsJson(pointSchema.parse),
    receiverPoint: parseAsJson(pointSchema.parse),
    size: parseAsJson(sizeSchema.parse)
  });
  const calcDeliveryMutation = usePostApiDeliveryCalcMutation();
  const context = useDeliveryContext();
  const [deliveries, setDeliveries] = useState([]);
  useEffect(() => {
    if (senderPoint && receiverPoint && size) {
      context.setDeliveryOrder({
        ...context.deliveryOrder,
        senderPointId: senderPoint.id,
        receiverPointId: receiverPoint.id,
        size
      });
      calcDeliveryMutation.mutate(
        {
          body: {
            package: size,
            receiverPoint: {
              latitude: receiverPoint.latitude,
              longitude: receiverPoint.longitude
            },
            senderPoint: {
              latitude: senderPoint.latitude,
              longitude: senderPoint.longitude
            }
          }
        },
        {
          onSuccess: (data) => setDeliveries(data.data.options)
        }
      );
    }
  }, [senderPoint, receiverPoint, size]);
  const handleClickTypeDelivery = (delivery) => {
    context.stepper.next();
    if (size && delivery) {
      context.setDeliveryOrder({
        ...context.deliveryOrder,
        packageId: size.id,
        price: delivery.price,
        days: delivery.days,
        optionType: delivery.type
      });
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4", children: deliveries.map((delivery) => /* @__PURE__ */ jsxs(
    "button",
    {
      className: "flex h-[116px] flex-1 rounded-xl border-1 p-4",
      onClick: () => handleClickTypeDelivery(delivery),
      children: [
        /* @__PURE__ */ jsx("div", { className: "bg-secondary flex h-12 w-12 items-center justify-center rounded-full", children: delivery.type === "express" ? /* @__PURE__ */ jsx(PlaneIcon, { size: 18 }) : /* @__PURE__ */ jsx(BusFrontIcon, { size: 18 }) }),
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx(Small, { className: "text-muted-foreground font-light", children: delivery.name }),
              /* @__PURE__ */ jsx(ChevronRightIcon, {})
            ] }),
            /* @__PURE__ */ jsxs(H3, { className: "text-left", children: [
              formatPrice(delivery.price),
              " ₽"
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Small, { className: "text-muted-foreground mt-1 text-left text-sm font-light", children: [
            delivery.days,
            " ",
            nounWord(delivery.days, ["рабочий день", "рабочих дня", "рабочих дней"])
          ] })
        ] }) })
      ]
    },
    delivery.id
  )) });
};
const OrderReviewStep = () => {
  const context = useDeliveryContext();
  const deliveryOrderMutation = usePostApiDeliveryOrderMutation();
  const {
    packageId,
    payer,
    price,
    optionType,
    senderAddress,
    senderPointId,
    receiverPointId,
    receiverAddress,
    sender,
    receiver
  } = context.deliveryOrder;
  const successDisclosure = useDisclosure();
  const navigate = useNavigate();
  const handleCreateDelivery = () => {
    deliveryOrderMutation.mutate(
      {
        body: {
          packageId,
          optionType,
          payer,
          receiver,
          receiverAddress,
          receiverPointId,
          sender,
          senderAddress,
          senderPointId
        }
      },
      {
        onSuccess: () => successDisclosure.open(),
        onError: () => toast.error("Не удалось создать заявку")
      }
    );
  };
  const handleNavigateToHome = () => navigate("/");
  const handleNavigateToHistory = () => navigate("/history");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(H3, { className: "mt-6", children: "Ваш заказ" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-1 gap-8 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-span-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(Small, { className: "text-muted-foreground font-light", children: "Тип доставки" }),
          /* @__PURE__ */ jsx(Small, { className: "font-light", children: optionType === "default" ? "Обычная доставка" : "Экспресс доставка" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(Small, { className: "text-muted-foreground font-light", children: "Откуда забрать" }),
          /* @__PURE__ */ jsx(Small, { className: "font-light", children: formatAddress(receiverAddress) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(Small, { className: "text-muted-foreground font-light", children: "Получатель" }),
          /* @__PURE__ */ jsx(Small, { className: "font-light", children: formatFio(receiver) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(Small, { className: "text-muted-foreground font-light", children: "Куда доставить" }),
          /* @__PURE__ */ jsx(Small, { className: "font-light", children: formatAddress(senderAddress) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(Small, { className: "text-muted-foreground font-light", children: "Отправитель" }),
          /* @__PURE__ */ jsx(Small, { className: "font-light", children: formatFio(sender) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-1 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx(Small, { className: "text-muted-foreground font-light", children: "Кто оплачивает доставку" }),
          /* @__PURE__ */ jsx(Small, { className: "font-light", children: payer === "sender" ? "Отправитель" : "Получатель" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "col-span-1 flex flex-col gap-2", children: /* @__PURE__ */ jsxs(H2, { children: [
          "Итого: ",
          price,
          "₽"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 flex gap-2", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "flex-1",
            disabled: deliveryOrderMutation.isPending,
            size: "lg",
            variant: "secondary",
            onClick: context.stepper.back,
            children: "Назад"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "flex-1",
            disabled: deliveryOrderMutation.isPending,
            size: "lg",
            onClick: handleCreateDelivery,
            children: "Продолжить"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: successDisclosure.opened, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-lg", showCloseButton: false, children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Посылка уже в пути!" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Мы приняли заявку и скоро передадим её курьеру. Отслеживать статус доставки можно в разделе «Мои заказы»." })
      ] }),
      /* @__PURE__ */ jsx("img", { alt: "success-feedback", className: "mx-auto my-8 w-48", src: "/success-feedback.png" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(Button, { className: "flex-1", size: "lg", onClick: handleNavigateToHome, children: "На главную" }),
        /* @__PURE__ */ jsx(Button, { className: "bg-brand flex-1", size: "lg", onClick: handleNavigateToHistory, children: "Статус заявки" })
      ] })
    ] }) })
  ] });
};
const receiveAddressFormSchema = z$1.object({
  street: z$1.string().min(2, "Введите название улицы").max(30, "Название улицы слишком длинное"),
  house: z$1.string().min(1, "Введите номер дома").regex(/^\d+$/, "Только цифры"),
  apartment: z$1.string().min(1, "Введите номер квартиры").regex(/^\d+$/, "Только цифры"),
  comment: z$1.string()
});
const PickupAddressStep = () => {
  const context = useDeliveryContext();
  const receiverAddress = context.deliveryOrder.receiverAddress ?? {};
  const form = useForm({
    resolver: zodResolver(receiveAddressFormSchema),
    defaultValues: {
      street: receiverAddress.street ?? "",
      house: receiverAddress.house ?? "",
      apartment: receiverAddress.apartment ?? "",
      comment: receiverAddress.comment ?? ""
    }
  });
  const handleSubmitForm = (fields) => {
    context.setDeliveryOrder({ ...context.deliveryOrder, receiverAddress: fields });
    context.stepper.next();
  };
  return /* @__PURE__ */ jsxs(Form, { className: "w-full", form, onSubmit: handleSubmitForm, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 pr-4", children: [
      /* @__PURE__ */ jsx(FormInput, { label: "Улица", name: "street", placeholder: "Улица" }),
      /* @__PURE__ */ jsx(FormInput, { label: "Дом", name: "house", placeholder: "Номер дома" }),
      /* @__PURE__ */ jsx(FormInput, { label: "Квартира", name: "apartment", placeholder: "Номер квартиры" }),
      /* @__PURE__ */ jsx(
        FormTextarea,
        {
          className: "max-h-40",
          label: "Заметка для курьера",
          maxLength: 200,
          name: "comment",
          placeholder: "Комментарий для курьера"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "mt-5 flex gap-2", children: [
      /* @__PURE__ */ jsx(Button, { className: "flex-1", size: "lg", variant: "secondary", onClick: context.stepper.back, children: "Назад" }),
      /* @__PURE__ */ jsx(Button, { className: "flex-1", size: "lg", type: "submit", children: "Вперед" })
    ] }) })
  ] }, "phone_form");
};
const receiverFormSchema = z$1.object({
  lastname: z$1.string().min(2, "Фамилия должна содержать минимум 2 символа").max(20, "Фамилия слишком длинная").regex(SINGLE_WORD_REGEX, "Должно быть одним словом без пробелов"),
  firstname: z$1.string().min(2, "Имя должно содержать минимум 2 символа").max(20, "Имя слишком длинное").regex(SINGLE_WORD_REGEX, "Должно быть одним словом без пробелов"),
  middlename: z$1.string().min(2, "Отчество должно содержать минимум 2 символа").max(20, "Отчество слишком длинное").regex(SINGLE_WORD_REGEX, "Должно быть одним словом без пробелов"),
  phone: z$1.string().regex(PHONE_REGEX, "Введите телефон в формате +7 (999) 999-99-99")
});
const ReceiverFormStep = () => {
  const context = useDeliveryContext();
  const receiver = context.deliveryOrder.receiver ?? {};
  const form = useForm({
    resolver: zodResolver(receiverFormSchema),
    defaultValues: {
      lastname: receiver.lastname ?? "",
      firstname: receiver.firstname ?? "",
      middlename: receiver.middlename ?? "",
      phone: receiver.phone ?? ""
    }
  });
  const handleSubmitForm = (fields) => {
    const phone = fields.phone.replace(/\D/g, "");
    context.setDeliveryOrder({ ...context.deliveryOrder, receiver: { ...fields, phone } });
    context.stepper.next();
  };
  return /* @__PURE__ */ jsxs(Form, { className: "w-full", form, onSubmit: handleSubmitForm, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 pr-4", children: [
      /* @__PURE__ */ jsx(FormInput, { label: "Фамилия", name: "lastname", placeholder: "Диназавриков" }),
      /* @__PURE__ */ jsx(FormInput, { label: "Имя", name: "firstname", placeholder: "Динозаврик" }),
      /* @__PURE__ */ jsx(FormInput, { label: "Отчество", name: "middlename", placeholder: "Динозаврикович" }),
      /* @__PURE__ */ jsx(
        FormInput,
        {
          ref: withMask("+7 (999) 999-99-99"),
          label: "Телефон",
          name: "phone",
          placeholder: "+7 (___) ___-__-__"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "mt-5 flex gap-2", children: [
      /* @__PURE__ */ jsx(Button, { className: "flex-1", size: "lg", variant: "secondary", onClick: context.stepper.back, children: "Назад" }),
      /* @__PURE__ */ jsx(Button, { className: "flex-1", size: "lg", type: "submit", children: "Вперед" })
    ] }) })
  ] }, "phone_form");
};
const senderFormSchema = z$1.object({
  lastname: z$1.string().min(2, "Фамилия должна содержать минимум 2 символа").max(20, "Фамилия слишком длинная").regex(SINGLE_WORD_REGEX, "Должно быть одним словом без пробелов"),
  firstname: z$1.string().min(2, "Имя должно содержать минимум 2 символа").max(20, "Имя слишком длинное").regex(SINGLE_WORD_REGEX, "Должно быть одним словом без пробелов"),
  middlename: z$1.string().min(2, "Отчество должно содержать минимум 2 символа").max(20, "Отчество слишком длинное").regex(SINGLE_WORD_REGEX, "Должно быть одним словом без пробелов"),
  phone: z$1.string().regex(PHONE_REGEX, "Введите телефон в формате +7 (999) 999-99-99")
});
const SenderFormStep = () => {
  const context = useDeliveryContext();
  const sender = context.deliveryOrder.sender ?? {};
  const form = useForm({
    resolver: zodResolver(senderFormSchema),
    defaultValues: {
      lastname: sender.lastname ?? "",
      firstname: sender.firstname ?? "",
      middlename: sender.middlename ?? "",
      phone: sender.phone ?? ""
    }
  });
  const handleSubmitForm = (fields) => {
    const phone = fields.phone.replace(/\D/g, "");
    context.setDeliveryOrder({ ...context.deliveryOrder, sender: { ...fields, phone } });
    context.stepper.next();
  };
  return /* @__PURE__ */ jsxs(Form, { className: "w-full", form, onSubmit: handleSubmitForm, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 pr-4", children: [
      /* @__PURE__ */ jsx(FormInput, { label: "Фамилия", name: "lastname", placeholder: "Диназавриков" }),
      /* @__PURE__ */ jsx(FormInput, { label: "Имя", name: "firstname", placeholder: "Динозаврик" }),
      /* @__PURE__ */ jsx(FormInput, { label: "Отчество", name: "middlename", placeholder: "Динозаврикович" }),
      /* @__PURE__ */ jsx(
        FormInput,
        {
          ref: withMask("+7 (999) 999-99-99"),
          label: "Телефон",
          name: "phone",
          placeholder: "+7 (___) ___-__-__"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "mt-5 flex gap-2", children: [
      /* @__PURE__ */ jsx(Button, { className: "flex-1", size: "lg", variant: "secondary", onClick: context.stepper.back, children: "Назад" }),
      /* @__PURE__ */ jsx(Button, { className: "flex-1", size: "lg", type: "submit", children: "Вперед" })
    ] }) })
  ] }, "phone_form");
};
const STEPPERS = [{
  title: "Тип доставки",
  node: DeliveryTypeStep
}, {
  title: "Получатель",
  node: ReceiverFormStep
}, {
  title: "Отправитель",
  node: SenderFormStep
}, {
  title: "Откуда забрать",
  node: PickupAddressStep
}, {
  title: "Куда доставить",
  node: DeliveryAddressStep
}, {
  title: "Оплата доставки",
  node: DeliveryPaymentStep
}, {
  title: "Проверка данных",
  node: OrderReviewStep
}];
const Delivery = () => {
  const stepper = useStep(7);
  const [deliveryOrder, setDeliveryOrder] = useState({});
  const Step = STEPPERS[stepper.currentStep - 1].node;
  const {
    optionType,
    receiver,
    sender,
    senderAddress,
    receiverAddress,
    payer
  } = deliveryOrder;
  return /* @__PURE__ */ jsx(DeliveryProvider, {
    value: {
      stepper,
      deliveryOrder,
      setDeliveryOrder
    },
    children: /* @__PURE__ */ jsx(Main, {
      children: /* @__PURE__ */ jsxs("div", {
        className: "mt-5",
        children: [/* @__PURE__ */ jsx(Breadcrumb, {
          className: "mb-5",
          children: /* @__PURE__ */ jsxs(BreadcrumbList, {
            children: [/* @__PURE__ */ jsx(BreadcrumbItem, {
              children: /* @__PURE__ */ jsx(BreadcrumbLink, {
                render: /* @__PURE__ */ jsx(Link, {
                  to: "/",
                  children: /* @__PURE__ */ jsx(HouseIcon, {
                    size: 16
                  })
                })
              })
            }), /* @__PURE__ */ jsx(BreadcrumbSeparator, {}), Array.from({
              length: stepper.currentStep
            }).map((_, index) => {
              const title = STEPPERS[index].title;
              return /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx(BreadcrumbItem, {
                  onClick: () => stepper.set(index),
                  children: title
                }), stepper.counts !== index + 1 && /* @__PURE__ */ jsx(BreadcrumbSeparator, {})]
              }, title);
            })]
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex h-full min-h-[600px] grid-cols-3 flex-col gap-4 md:grid",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "col-span-2 h-full",
            children: [/* @__PURE__ */ jsx(H3, {
              children: STEPPERS[stepper.currentStep - 1].title
            }), /* @__PURE__ */ jsxs("div", {
              className: "my-5",
              children: [/* @__PURE__ */ jsxs(Small, {
                children: ["Шаг ", stepper.currentStep, " из 7"]
              }), /* @__PURE__ */ jsx(Progress, {
                className: "mt-3",
                value: stepper.currentStep / 7 * 100
              })]
            }), Step && /* @__PURE__ */ jsx(Step, {})]
          }), stepper.currentStep !== 7 && /* @__PURE__ */ jsxs("div", {
            className: "bg-secondary hidden flex-1 rounded-2xl p-6 md:block",
            children: [/* @__PURE__ */ jsx(H3, {
              className: "mb-4",
              children: "Ваш заказ"
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-6",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-2",
                children: [/* @__PURE__ */ jsx(Small, {
                  className: "text-muted-foreground font-light",
                  children: "Тип доставки"
                }), /* @__PURE__ */ jsx(Small, {
                  className: "font-light",
                  children: optionType ? optionType === "express" ? "Экспресс-доставка" : "Обычная доставка" : "-"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-2",
                children: [/* @__PURE__ */ jsx(Small, {
                  className: "text-muted-foreground font-light",
                  children: "Получатель"
                }), /* @__PURE__ */ jsx(Small, {
                  className: "font-light",
                  children: receiver ? formatFio(receiver) : "-"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-2",
                children: [/* @__PURE__ */ jsx(Small, {
                  className: "text-muted-foreground font-light",
                  children: "Отправитель"
                }), /* @__PURE__ */ jsx(Small, {
                  className: "font-light",
                  children: sender ? formatFio(sender) : "-"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-2",
                children: [/* @__PURE__ */ jsx(Small, {
                  className: "text-muted-foreground font-light",
                  children: "Куда доставить"
                }), /* @__PURE__ */ jsx(Small, {
                  className: "font-light",
                  children: receiverAddress ? formatAddress(receiverAddress) : "-"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-2",
                children: [/* @__PURE__ */ jsx(Small, {
                  className: "text-muted-foreground font-light",
                  children: "Откуда забрать"
                }), /* @__PURE__ */ jsx(Small, {
                  className: "font-light",
                  children: senderAddress ? formatAddress(senderAddress) : "-"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col gap-2",
                children: [/* @__PURE__ */ jsx(Small, {
                  className: "text-muted-foreground font-light",
                  children: "Кто оплачивает доставку"
                }), /* @__PURE__ */ jsx(Small, {
                  className: "font-light",
                  children: payer ? payer === "receiver" ? "Получатель" : "Отправитель" : "-"
                })]
              })]
            })]
          })]
        })]
      })
    })
  });
};
const route = UNSAFE_withComponentProps(Delivery);
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: route
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-7Rn4-KvN.js", "imports": ["/assets/chunk-LFPYN7LY-BgkXjyOj.js", "/assets/index-B-5nVgwq.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/root-ByRTVQZB.js", "imports": ["/assets/chunk-LFPYN7LY-BgkXjyOj.js", "/assets/index-B-5nVgwq.js", "/assets/index-C60CeXIL.js", "/assets/provider-Brwi1-0V.js", "/assets/button-D18mvz4w.js", "/assets/check-I_o0Sdrg.js", "/assets/refresh-cw-CyiI4BjP.js", "/assets/query-C5-TJBLH.js", "/assets/compare-Br3z3FUS-BU_jvOf_.js"], "css": ["/assets/root-DHJv6nue.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/auth": { "id": "routes/auth", "parentId": "root", "path": "auth", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/auth-devMiZ86.js", "imports": ["/assets/chunk-LFPYN7LY-BgkXjyOj.js", "/assets/button-D18mvz4w.js", "/assets/form-D8z5tkgA.js", "/assets/index-C60CeXIL.js", "/assets/provider-Brwi1-0V.js", "/assets/axiosInstance-DN0JG7ld.js", "/assets/spinner-BFHTaH7M.js", "/assets/typography-CC1dL3fe.js", "/assets/sun-DQVgGT7l.js", "/assets/input-B-OfX-rd.js", "/assets/index-B-5nVgwq.js", "/assets/query-C5-TJBLH.js", "/assets/compare-Br3z3FUS-BU_jvOf_.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/protected-route": { "id": "routes/protected-route", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/protected-route-DCE5XYq1.js", "imports": ["/assets/chunk-LFPYN7LY-BgkXjyOj.js", "/assets/provider-Brwi1-0V.js", "/assets/button-D18mvz4w.js", "/assets/typography-CC1dL3fe.js", "/assets/sun-DQVgGT7l.js", "/assets/query-C5-TJBLH.js", "/assets/compare-Br3z3FUS-BU_jvOf_.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home/route": { "id": "routes/home/route", "parentId": "routes/protected-route", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/route-x6JqW_we.js", "imports": ["/assets/chunk-LFPYN7LY-BgkXjyOj.js", "/assets/index-C60CeXIL.js", "/assets/axiosInstance-DN0JG7ld.js", "/assets/button-D18mvz4w.js", "/assets/typography-CC1dL3fe.js", "/assets/main-U9Fm1Lh-.js", "/assets/input-B-OfX-rd.js", "/assets/queryOptions-BNttjVcD.js", "/assets/check-I_o0Sdrg.js", "/assets/dialog-CV5qVE_U.js", "/assets/index-B-5nVgwq.js", "/assets/query-C5-TJBLH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/profile": { "id": "routes/profile", "parentId": "routes/protected-route", "path": "profile", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/profile-B28-ggEO.js", "imports": ["/assets/chunk-LFPYN7LY-BgkXjyOj.js", "/assets/schemas-B74z_jL7.js", "/assets/form-D8z5tkgA.js", "/assets/provider-Brwi1-0V.js", "/assets/button-D18mvz4w.js", "/assets/axiosInstance-DN0JG7ld.js", "/assets/typography-CC1dL3fe.js", "/assets/main-U9Fm1Lh-.js", "/assets/spinner-BFHTaH7M.js", "/assets/input-B-OfX-rd.js", "/assets/query-C5-TJBLH.js", "/assets/compare-Br3z3FUS-BU_jvOf_.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/history": { "id": "routes/history", "parentId": "routes/protected-route", "path": "history", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/history-B282EXAN.js", "imports": ["/assets/chunk-LFPYN7LY-BgkXjyOj.js", "/assets/button-D18mvz4w.js", "/assets/index-C60CeXIL.js", "/assets/axiosInstance-DN0JG7ld.js", "/assets/queryOptions-BNttjVcD.js", "/assets/typography-CC1dL3fe.js", "/assets/main-U9Fm1Lh-.js", "/assets/format-BPZr_6K0.js", "/assets/refresh-cw-CyiI4BjP.js", "/assets/index-B-5nVgwq.js", "/assets/query-C5-TJBLH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/delivery/route": { "id": "routes/delivery/route", "parentId": "routes/protected-route", "path": "delivery", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/route-jfsf2UdL.js", "imports": ["/assets/chunk-LFPYN7LY-BgkXjyOj.js", "/assets/button-D18mvz4w.js", "/assets/typography-CC1dL3fe.js", "/assets/main-U9Fm1Lh-.js", "/assets/format-BPZr_6K0.js", "/assets/dialog-CV5qVE_U.js", "/assets/schemas-B74z_jL7.js", "/assets/form-D8z5tkgA.js", "/assets/input-B-OfX-rd.js", "/assets/compare-Br3z3FUS-BU_jvOf_.js", "/assets/axiosInstance-DN0JG7ld.js", "/assets/index-C60CeXIL.js", "/assets/index-B-5nVgwq.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-260d30f2.js", "version": "260d30f2", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "unstable_previewServerPrerendering": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/auth": {
    id: "routes/auth",
    parentId: "root",
    path: "auth",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/protected-route": {
    id: "routes/protected-route",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/home/route": {
    id: "routes/home/route",
    parentId: "routes/protected-route",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route3
  },
  "routes/profile": {
    id: "routes/profile",
    parentId: "routes/protected-route",
    path: "profile",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/history": {
    id: "routes/history",
    parentId: "routes/protected-route",
    path: "history",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/delivery/route": {
    id: "routes/delivery/route",
    parentId: "routes/protected-route",
    path: "delivery",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  }
};
const allowedActionOrigins = false;
export {
  allowedActionOrigins,
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};

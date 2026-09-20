package core_http_server

import (
	"fmt"
	"net/http"
)

type ApiVersion string

type APIVersionRouter struct {
	*http.ServeMux
	apiVersion ApiVersion
}

func NewApiVersionRouter(apiVersion ApiVersion) *APIVersionRouter {
	return &APIVersionRouter{
		ServeMux: http.NewServeMux(), apiVersion: apiVersion,
	}
}

func (r *APIVersionRouter) RegiisterRouters(routes ...Route) {
	for _, route := range routes {
		pattern := fmt.Sprintf("%s %s", route.Method, route.Path)
		r.Handle(pattern, route.Handler)
	}
}

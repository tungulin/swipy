package server

import (
	"fmt"
	"net/http"

	scalar "github.com/MarceloPetrucio/go-scalar-api-reference"
	"github.com/tungulin/swipy/api"
	core_logger "github.com/tungulin/swipy/internal/core/logger"
	core_http_response "github.com/tungulin/swipy/internal/core/transport/http/response"
	"go.uber.org/zap"
)

func DocsHandler(rw http.ResponseWriter, r *http.Request) {
	log := core_logger.FromContext(r.Context())
	responseHandler := core_http_response.NewHTTPResponseHandler(log, rw)

	html, err := scalar.ApiReferenceHTML(&scalar.Options{
		SpecContent: api.OpenAPISpec,
		CustomOptions: scalar.CustomOptions{
			PageTitle: "Swipy API",
		},
		DarkMode: true,
	})
	if err != nil {
		responseHandler.ErrorResponse(err, "failed to render API reference")
		return
	}

	rw.Header().Set("Content-Type", "text/html; charset=utf-8")
	rw.WriteHeader(http.StatusOK)

	if _, err := fmt.Fprint(rw, html); err != nil {
		log.Error("write API reference", zap.Error(err))
	}
}

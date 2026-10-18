package api

import _ "embed"

// OpenAPISpec — спецификация API, вшитая в бинарник: страница документации не зависит
// от рабочей директории при запуске.
//
//go:embed openapi.yaml
var OpenAPISpec string

package core_vk

import (
	"fmt"
	"net/url"
	"strconv"

	"github.com/SevereCloud/vksdk/v3/vkapps"
	core_errors "github.com/tungulin/swipy/internal/core/errors"
)

type LaunchParams struct {
	UserID   int64
	Language string
}

// VerifyLaunchParams проверяет sign в строке launch params вида vk_user_id=...&sign=...
// vkapps.ParamsVerify ждёт полный URL и параметры после "?", поэтому строка передаётся как RawQuery.
func VerifyLaunchParams(launchParams string, clientSecret string) error {
	verification := vkapps.NewParamsVerification(clientSecret)

	isVerified, err := verification.Verify(&url.URL{RawQuery: launchParams})
	if err != nil {
		return fmt.Errorf("parse VK launch params: %v: %w", err, core_errors.ErrUnauthorized)
	}

	if !isVerified {
		return fmt.Errorf("invalid VK sign: %w", core_errors.ErrUnauthorized)
	}

	return nil
}

func ParseLaunchParams(launchParams string) (LaunchParams, error) {
	params, err := url.ParseQuery(launchParams)
	if err != nil {
		return LaunchParams{}, fmt.Errorf("parse VK launch params: %v: %w", err, core_errors.ErrInvalidArgument)
	}

	vkUserID, err := strconv.ParseInt(params.Get("vk_user_id"), 10, 64)
	if err != nil {
		return LaunchParams{}, fmt.Errorf("parse vk_user_id: %v: %w", err, core_errors.ErrInvalidArgument)
	}

	return LaunchParams{
		UserID:   vkUserID,
		Language: params.Get("vk_language"),
	}, nil
}

from datetime import timedelta
import os
from pathlib import Path

from corsheaders.defaults import default_headers, default_methods
from django.utils.translation import gettext_lazy as _
from dotenv import load_dotenv

load_dotenv(override=False)

# Common settings

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "secret_key")
DEBUG = os.getenv("DJANGO_DEBUG", "true").lower() in ("true", "1", "yes", "y")
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "*").split(" ")
INTERNAL_IPS = os.getenv("DJANGO_INTERNAL_IPS", "127.0.0.1").split(" ")


# Application definition

INSTALLED_APPS = [
    # Django apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Other
    "debug_toolbar",
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    # Project's apps
    "core.apps.CoreConfig",
    "user.apps.UserConfig",
    "files.apps.FilesConfig",
    "albums.apps.AlbumsConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "GribCloud.wsgi.application"
ROOT_URLCONF = "GribCloud.urls"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Database

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "GriBD.sqlite3",
    },
}

# Auth settings

AUTH_USER_MODEL = "user.User"

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

AUTHENTICATION_BACKENDS = [
    "user.backends.AuthenticationBackend",
]


# Internationalization

LANGUAGE_CODE = "en-us"
LANGUAGES = (
    ("en", _("English")),
    ("ru", _("Russian")),
)
LOCALE_PATHS = [
    BASE_DIR / "locale",
]
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = "static/"


# CORS settings

CORS_ORIGIN_ALLOW_ALL = True

CORS_ALLOW_METHODS = (*default_methods,)
CORS_ALLOW_HEADERS = (
    *default_headers,
    "WWW-Authenticate",
    "Authorization",
    "Proxy-Authenticate",
    "Proxy-Authorization",
    "Age",
    "Cache-Control",
    "Clear-Site-Data",
    "Expires",
    "Pragma",
    "Warning",
    "Accept-CH",
    "Accept-CH-Lifetime",
    "Sec-CH-UA",
    "Sec-CH-UA-Arch",
    "Sec-CH-UA-Bitness",
    "Sec-CH-UA-Full-Version",
    "Sec-CH-UA-Full-Version-List",
    "Sec-CH-UA-Mobile",
    "Sec-CH-UA-Model",
    "Sec-CH-UA-Platform",
    "Sec-CH-UA-Platform-Version",
    "Content-DPR",
    "Device-Memory",
    "DPR",
    "Viewport-Width",
    "Width",
    "Downlink",
    "ECT",
    "RTT",
    "Save-Data",
    "Last-Modified",
    "ETag",
    "If-Match",
    "If-None-Match",
    "If-Modified-Since",
    "If-Unmodified-Since",
    "Vary",
    "Connection",
    "Keep-Alive",
    "Accept",
    "Accept-Encoding",
    "Accept-Language",
    "Expect",
    "Max-Forwards",
    "Cookie",
    "Set-Cookie",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods",
    "Access-Control-Expose-Headers",
    "Access-Control-Max-Age",
    "Access-Control-Request-Headers",
    "Access-Control-Request-Method",
    "Origin",
    "Timing-Allow-Origin",
    "Content-Disposition",
    "Content-Length",
    "Content-Type",
    "Content-Encoding",
    "Content-Language",
    "Content-Location",
    "Forwarded",
    "X-Forwarded-For",
    "X-Forwarded-Host",
    "X-Forwarded-Proto",
    "Via",
    "Location",
    "From",
    "Host",
    "Referer",
    "Referrer-Policy",
    "User-Agent",
    "Allow",
    "Server",
    "Accept-Ranges",
    "Range",
    "If-Range",
    "Content-Range",
    "Cross-Origin-Embedder-Policy",
    "Cross-Origin-Opener-Policy",
    "Cross-Origin-Resource-Policy",
    "Content-Security-Policy",
    "Content-Security-Policy-Report-Only",
    "Expect-CT",
    "Feature-Policy",
    "Origin-Isolation",
    "Strict-Transport-Security",
    "Upgrade-Insecure-Requests",
    "X-Content-Type-Options",
    "X-Download-Options",
    "X-Frame-Options",
    "X-Permitted-Cross-Domain-Policies",
    "X-Powered-By",
    "X-XSS-Protection",
    "Sec-Fetch-Site",
    "Sec-Fetch-Mode",
    "Sec-Fetch-User",
    "Sec-Fetch-Dest",
    "Service-Worker-Navigation-Preload",
    "Last-Event-ID",
    "NEL",
    "Ping-From",
    "Ping-To",
    "Report-To",
    "Transfer-Encoding",
    "TE",
    "Trailer",
    "Sec-WebSocket-Key",
    "Sec-WebSocket-Extensions",
    "Sec-WebSocket-Accept",
    "Sec-WebSocket-Protocol",
    "Sec-WebSocket-Version",
    "Accept-Push-Policy",
    "Accept-Signature",
    "Alt-Svc",
    "Date",
    "Early-Data",
    "Large-Allocation",
    "Link",
    "Push-Policy",
    "Retry-After",
    "Signature",
    "Signed-Headers",
    "Server-Timing",
    "Service-Worker-Allowed",
    "SourceMap",
    "Upgrade",
    "X-DNS-Prefetch-Control",
    "X-Firefox-Spdy",
    "X-Pingback",
    "X-Requested-With",
    "X-Robots-Tag",
    "X-UA-Compatible",
    "ContentType",
    "Content-type",
    "content-type",
    "contenttype",
    "contentType",
    "accept",
    "authorization",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
    "accept-encoding",
    "Contentype",
)

CORS_ALLOW_CREDENTIALS = True


# RestFramework settings

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": "",
    "AUDIENCE": None,
    "ISSUER": None,
    "JSON_ENCODER": None,
    "JWK_URL": None,
    "LEEWAY": 0,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",
    "JTI_CLAIM": "jti",
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
    "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}

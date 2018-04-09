<?php

namespace Igniter\Flame\Translation;

use Closure;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\Request;

class Localization
{
    protected static $authLocalResolver;

    protected $request;
    protected $locale;

    protected $supportedLocales;

    protected $sessionKey = 'igniter.flame.translation.locale';

    public function __construct(Request $request, $locale, array $supportedLocales = [])
    {
        $this->request = $request;
        $this->locale = $locale;
        $this->supportedLocales = $supportedLocales;
    }

    public function loadLocale()
    {
        $locale = $this->getLocale();

        if ($this->locale != $locale)
            app()->setLocale($locale);
    }

    public function getLocale()
    {
        // Check request for locale
        $routeLocale = $this->getRouteLocale();
        if ($routeLocale AND $this->isValid($routeLocale)) {
            return $routeLocale;
        }

        // Get locale from session
        $sessionLocale = $this->getSessionLocale();
        if ($sessionLocale AND $this->isValid($sessionLocale)) {
            return $sessionLocale;
        }

        // Get locale from user browser
        $browserLocale = $this->getBrowserLocale();
        if ($browserLocale AND $this->isValid($browserLocale)) {
            return $browserLocale;
        }

        return $this->locale;
    }

    public function supportedLocales()
    {
        return $this->supportedLocales;
    }

    public function isValid($locale)
    {
        return in_array($locale, $this->supportedLocales());
    }

    public function setSessionLocale($locale)
    {
        return $this->request->getSession()->put([$this->sessionKey => $locale]);
    }

    public function getSessionLocale()
    {
        return $this->request->getSession()->get($this->sessionKey);
    }

    protected function getRouteLocale()
    {
        $paths = explode('/', $this->request->path());

        return $paths[0] ?? null;
    }

    protected function getBrowserLocale()
    {
        return substr($this->request->server('HTTP_ACCEPT_LANGUAGE'), 0, 2);
    }
}
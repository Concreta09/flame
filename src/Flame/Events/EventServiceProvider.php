<?php

namespace Igniter\Flame\Events;

use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Event::macro('fire', function ($event, $payload = [], $halt = false) {
            return $this->dispatch($event, $payload, $halt);
        });
    }
}

<?php

namespace Igniter\Flame\Cart;

use Closure;
use Igniter\Flame\Cart\Contracts\Buyable;
use Igniter\Flame\Cart\Exceptions\InvalidRowIDException;
use Igniter\Flame\Cart\Exceptions\UnknownModelException;
use Illuminate\Events\Dispatcher;
use Illuminate\Session\Store;
use Illuminate\Support\Collection;

class Cart
{
    const DEFAULT_INSTANCE = 'default';

    /**
     * Instance of the session manager.
     *
     * @var \Illuminate\Session\Store
     */
    protected $session;

    /**
     * Instance of the event dispatcher.
     *
     * @var \Illuminate\Contracts\Events\Dispatcher
     */
    protected $events;

    /**
     * Holds the current cart instance.
     *
     * @var string
     */
    protected $instance;

    protected $conditionPriorities;

    /**
     * Cart constructor.
     *
     * @param \Illuminate\Session\Store $session
     * @param \Illuminate\Events\Dispatcher $events
     */
    public function __construct(Store $session, Dispatcher $events)
    {
        $this->session = $session;
        $this->events = $events;

        $this->instance(self::DEFAULT_INSTANCE);
    }

    /**
     * Set the current cart instance.
     *
     * @param string|null $instance
     *
     * @return \Igniter\Flame\Cart\Cart
     */
    public function instance($instance = null)
    {
        $instance = $instance ?: self::DEFAULT_INSTANCE;

        $this->instance = sprintf('%s.%s', 'cart', $instance);

        $this->fireEvent('created', $instance);

        return $this;
    }

    /**
     * Get the current cart instance.
     *
     * @return string
     */
    public function currentInstance()
    {
        return str_replace('cart.', '', $this->instance);
    }

    /**
     * Add an item to the cart.
     *
     * @param mixed $id
     * @param mixed $name
     * @param int|float $qty
     * @param float $price
     * @param array $options
     *
     * @return \Igniter\Flame\Cart\CartItem
     */
    public function add($id, $name = null, $qty = null, $price = null, array $options = [])
    {
        if ($this->isMulti($id)) {
            return array_map(function ($item) {
                return $this->add($item);
            }, $id);
        }

        $cartItem = $this->createCartItem($id, $name, $qty, $price, $options);

        $this->fireEvent('adding', $cartItem);

        $content = $this->getContent();

        if ($content->has($cartItem->rowId)) {
            $cartItem->qty += $content->get($cartItem->rowId)->qty;
        }

        $content->put($cartItem->rowId, $cartItem);

        $this->fireEvent('added', $cartItem);

        $this->putSession('content', $content);

        return $cartItem;
    }

    /**
     * Update the cart item with the given rowId.
     *
     * @param string $rowId
     * @param mixed $qty
     *
     * @return \Igniter\Flame\Cart\CartItem|bool
     */
    public function update($rowId, $qty)
    {
        $cartItem = $this->get($rowId);

        $this->fireEvent('updating', $cartItem);

        if ($qty instanceof Buyable) {
            $cartItem->updateFromBuyable($qty);
        }
        elseif (is_array($qty)) {
            $cartItem->updateFromArray($qty);
        }
        else {
            $cartItem->qty = $qty;
        }

        $content = $this->getContent();

        if ($rowId !== $cartItem->rowId) {
            $content->pull($rowId);

            if ($content->has($cartItem->rowId)) {
                $existingCartItem = $this->get($cartItem->rowId);
                $cartItem->setQuantity($existingCartItem->qty + $cartItem->qty);
            }
        }

        if ($cartItem->qty <= 0) {
            $this->remove($cartItem->rowId);

            return $cartItem->rowId;
        }
        else {
            $content->put($cartItem->rowId, $cartItem);
        }

        $this->fireEvent('updated', $cartItem);

        $this->putSession('content', $content);

        return $cartItem;
    }

    /**
     * Remove the cart item with the given rowId from the cart.
     *
     * @param string $rowId
     *
     * @return void
     */
    public function remove($rowId)
    {
        $cartItem = $this->get($rowId);

        $this->fireEvent('removing', $cartItem);

        $content = $this->getContent();

        $content->pull($cartItem->rowId);

        $this->fireEvent('removed', $cartItem);

        $this->putSession('content', $content);
    }

    /**
     * Get a cart item from the cart by its rowId.
     *
     * @param string $rowId
     *
     * @return \Igniter\Flame\Cart\CartItem
     */
    public function get($rowId)
    {
        $content = $this->getContent();

        if (!$content->has($rowId))
            throw new InvalidRowIDException("The cart does not contain rowId {$rowId}.");

        return $content->get($rowId);
    }

    /**
     * Destroy the current cart instance.
     *
     * @return void
     */
    public function destroy()
    {
        $this->fireEvent('clearing');

        $this->session->remove($this->instance);

        $this->fireEvent('cleared');
    }

    /**
     * Get the content of the cart.
     *
     * @return \Igniter\Flame\Cart\CartContent
     */
    public function content()
    {
        return $this->getContent();
    }

    /**
     * Get the number of items in the cart.
     *
     * @return int|float
     */
    public function count()
    {
        return $this->getContent()->quantity();
    }

    /**
     * Get the total price of the items (after conditions) in the cart.
     *
     * @return string
     */
    public function total()
    {
        $conditions = $this->conditions();

        $subTotal = $this->subtotal();

        $total = $conditions->reduce(function ($total, CartCondition $condition) {
            $newTotal = $condition->apply($total);

            return ($newTotal === FALSE) ? $total : $newTotal;
        }, $subTotal);

        return $total;
    }

    /**
     * Get the subtotal (before conditions) of the items in the cart.
     *
     * @return float
     */
    public function subtotal()
    {
        return $this->getContent()->subtotal();
    }

    /**
     * Search the cart content for a cart item matching the given search closure.
     *
     * @param \Closure $search
     *
     * @return \Igniter\Flame\Cart\CartContent
     */
    public function search(Closure $search)
    {
        $content = $this->getContent();

        return $content->filter($search);
    }

    /**
     * Associate the cart item with the given rowId with the given model.
     *
     * @param string $rowId
     * @param mixed $model
     *
     * @return void
     */
    public function associate($rowId, $model)
    {
        if (is_string($model) AND !class_exists($model)) {
            throw new UnknownModelException("The supplied model {$model} does not exist.");
        }

        $cartItem = $this->get($rowId);

        $cartItem->associate($model);

        $content = $this->getContent();

        $content->put($cartItem->rowId, $cartItem);

        $this->putSession('content', $content);
    }

    /**
     * Store the current instance of the cart.
     *
     * @param mixed $identifier
     *
     * @return void
     */
//    public function store($identifier)
//    {
//        $content = $this->getContent();
//
//        if ($this->storedCartWithIdentifierExists($identifier)) {
//            throw new CartAlreadyStoredException("A cart with identifier {$identifier} was already stored.");
//        }
//
//        $this->getConnection()->table($this->getTableName())->insert([
//            'identifier' => $identifier,
//            'instance'   => $this->currentInstance(),
//            'content'    => serialize($content),
//        ]);
//
//        $this->fireEvent('stored', $identifier);
//    }

    /**
     * Restore the cart with the given identifier.
     *
     * @return \Igniter\Flame\Cart\CartContent
     */
//    public function restore($identifier)
//    {
//        if (!$this->storedCartWithIdentifierExists($identifier)) {
//            return;
//        }
//
//        $stored = $this->getStoredCartByIdentifier($identifier);
//
//        $storedContent = unserialize($stored->content);
//
//        $currentInstance = $this->currentInstance();
//
//        $this->instance($stored->instance);
//
//        $content = $this->getContent();
//
//        foreach ($storedContent as $cartItem) {
//            $content->put($cartItem->rowId, $cartItem);
//        }
//
//        $this->fireEvent('restored');
//
//        $this->putSession('content', $content);
//
//        $this->instance($currentInstance);
//
////        $this->getConnection()->table($this->getTableName())
////             ->where('identifier', $identifier)->delete();
//    }

    public function conditions()
    {
        $conditions = $this->getSortedConditions();

        $conditions->each(function (CartCondition $condition) {
            $condition->applyContent($this->getContent());
        });

        return $conditions;
    }

    public function condition(CartCondition $condition)
    {
        $conditions = $this->getConditions();

        // Check if priority has been applied
        if ($condition->priority == 0) {
            $last = $conditions->last();
            $condition->setPriority(!is_null($last) ? $last->priority + 1 : 1);
        }

        $conditions->put($condition->uniqueId, $condition);

        $conditions = $conditions->sortBy(function ($condition, $key) {
            return $condition->priority;
        });

        $this->putSession('conditions', $conditions);
    }

    /**
     * get condition applied on the cart by its name
     *
     * @param $uniqueId
     *
     * @return CartCondition
     */
    public function getCondition($uniqueId)
    {
        return $this->getConditions()->get($uniqueId);
    }

    /**
     * Get all the condition filtered by name
     *
     * @param $name
     *
     * @return \Igniter\Flame\Cart\CartContent
     */
    public function getConditionByName($name)
    {
        return $this->getConditions()->first(function (CartCondition $condition) use ($name) {
            return $condition->name == $name;
        });
    }

    /**
     * Removes a condition on a cart by unique id,
     *
     * @param $uniqueId
     */
    public function removeCondition($uniqueId)
    {
        $conditions = $this->getConditions();

        $conditions->pull($uniqueId);

        $this->putSession('conditions', $conditions);
    }

    /**
     * Removes a condition on a cart by name,
     *
     * @param $name
     */
    public function removeConditionByName($name)
    {
        $condition = $this->getConditionByName($name);

        if ($condition)
            $this->removeCondition($condition->uniqueId);
    }

    public function clearConditions()
    {
        $this->putSession('conditions', null);
    }

    public function setConditionsPriorities($conditionPriorities)
    {
        $this->conditionPriorities = $conditionPriorities;
    }

    /**
     * Get the carts content, if there is no cart content set yet, return a new empty Collection
     *
     * @return \Igniter\Flame\Cart\CartContent
     */
    protected function getContent()
    {
        if (!$content = $this->getSession('content'))
            $content = new CartContent;

        return $content;
    }

    /**
     * Get the carts conditions, if there is no cart condition set yet, return a new empty Collection
     *
     * @return \Igniter\Flame\Cart\CartContent
     */
    protected function getConditions()
    {
        if (!$conditions = $this->getSession('conditions'))
            $conditions = new Collection;

        return $conditions;
    }

    public function getSortedConditions()
    {
        $sorted = $this->getConditions()->sortBy(function ($condition, $key) {
            return array_get($this->conditionPriorities, $condition->name, $condition->priority);
        });

        return $sorted;
    }

    public function allTotals()
    {
        $totals = [
            [
                'name'     => 'subtotal',
                'label'    => 'Subtotal',
                'value'    => $this->subtotal(),
                'priority' => array_get($this->conditionPriorities, 'subtotal', 0),
            ],
            [
                'name'     => 'total',
                'label'    => 'Order Total',
                'value'    => $this->total(),
                'priority' => array_get($this->conditionPriorities, 'total', 999),
            ],
        ];

        foreach ($this->getSortedConditions() as $condition) {
            $totals[] = [
                'name'     => $condition->name,
                'label'    => $condition->label,
                'value'    => $condition->result(),
                'priority' => array_get($this->conditionPriorities, 'priority', $condition->priority),
            ];
        }

        return $totals;
    }

    /**
     * Create a new CartItem from the supplied attributes.
     *
     * @param mixed $id
     * @param mixed $name
     * @param int|float $qty
     * @param float $price
     * @param array $options
     *
     * @return \Igniter\Flame\Cart\CartItem
     */
    protected function createCartItem($id, $name, $qty, $price, array $options)
    {
        if ($id instanceof Buyable) {
            $cartItem = CartItem::fromBuyable($id, $qty ?: []);
            $cartItem->setQuantity($name ?: 1);
            $cartItem->associate($id);
        }
        elseif (is_array($id)) {
            $cartItem = CartItem::fromArray($id);
            $cartItem->setQuantity($id['qty']);
        }
        else {
            $cartItem = CartItem::fromAttributes($id, $name, $price, $options);
            $cartItem->setQuantity($qty);
        }

        return $cartItem;
    }

    /**
     * Check if the item is a multidimensional array or an array of Buyables.
     *
     * @param mixed $item
     *
     * @return bool
     */
    protected function isMulti($item)
    {
        if (!is_array($item)) return FALSE;

        return is_array(head($item)) || head($item) instanceof Buyable;
    }

    /**
     * @param $identifier
     *
     * @return bool
     */
//    protected function storedCartWithIdentifierExists($identifier)
//    {
//        return $this->getConnection()
//                    ->table($this->getTableName())
//                    ->where('identifier', $identifier)->exists();
//    }

//    protected function getStoredCartByIdentifier($identifier)
//    {
//        return $this->getConnection()
//                    ->table($this->getTableName())
//                    ->where('identifier', $identifier)->first();
//    }

    /**
     * Get the database connection.
     *
     * @return \Illuminate\Database\Connection
     */
//    protected function getConnection()
//    {
//        $connectionName = $this->getConnectionName();
//
//        return app(DatabaseManager::class)->connection($connectionName);
//    }

    /**
     * Get the database table name.
     *
     * @return string
     */
//    protected function getTableName()
//    {
//        return config('database.table', 'cart');
//    }

    /**
     * Get the database connection name.
     *
     * @param $key
     *
     * @return string
     */
//    protected function getConnectionName()
//    {
//        $connection = config('cart.database.connection');
//
//        return is_null($connection) ? config('database.default') : $connection;
//    }

    protected function hasSession($key)
    {
        return $this->session->has(sprintf('%s.%s', $this->instance, $key));
    }

    protected function getSession($key, $default = null)
    {
        return $this->session->get(sprintf('%s.%s', $this->instance, $key), $default);
    }

    protected function putSession($key, $content)
    {
        $this->session->put($this->instance.'.'.$key, $content);
    }

    /**
     * @param $name
     * @param $payload
     *
     * @return mixed
     */
    protected function fireEvent($name, $payload = null)
    {
        if (is_null($payload))
            return $this->events->fire('cart.'.$name, [$this]);

        return $this->events->fire('cart.'.$name, [$payload, $this]);
    }
}
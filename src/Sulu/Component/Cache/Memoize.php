<?php

/*
 * This file is part of Sulu.
 *
 * (c) Sulu GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Component\Cache;

use Doctrine\Common\Cache\Cache;
use Doctrine\Common\Cache\FlushableCache;
use Symfony\Contracts\Service\ResetInterface;

/**
 * Memoizer which uses Doctrine Cache to save data.
 */
class Memoize implements MemoizeInterface, ResetInterface
{
    /**
     * @param Cache $cache should also include FlushableCache to reset in other runtimes like FrankenPHP correctly
     * @param int $defaultLifeTime
     */
    public function __construct(protected Cache $cache, protected $defaultLifeTime)
    {
    }

    public function memoize($compute, $lifeTime = null)
    {
        // used to get information of the caller
        // returns a callstack (0 is current function, 1 is caller function)
        $callers = \debug_backtrace();

        if (
            !isset($callers[1])
            || !isset($callers[1]['class'])
            || !isset($callers[1]['function'])
            || !isset($callers[1]['args'])
        ) {
            throw new \InvalidArgumentException();
        }

        // build cache key
        $id = \sprintf('%s::%s', $callers[1]['class'], $callers[1]['function']);

        return $this->memoizeById($id, $callers[1]['args'], $compute, $lifeTime);
    }

    public function memoizeById($id, $arguments, $compute, $lifeTime = null)
    {
        // determine lifetime
        if (null === $lifeTime) {
            $lifeTime = $this->defaultLifeTime;
        }

        // determine cache key
        $id = \md5(\sprintf('%s(%s)', $id, \serialize($arguments)));

        // memoize pattern: save result for arguments once and
        // return the value from cache if it is called more than once
        if ($this->cache->contains($id)) {
            return $this->cache->fetch($id);
        } else {
            $value = \call_user_func_array($compute, $arguments);
            $this->cache->save($id, $value, $lifeTime);

            return $value;
        }
    }

    /**
     * @return void
     */
    public function reset()
    {
        if ($this->cache instanceof FlushableCache) {
            $this->cache->flushAll();
        }
    }
}

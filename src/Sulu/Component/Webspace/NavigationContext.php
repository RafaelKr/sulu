<?php

/*
 * This file is part of Sulu.
 *
 * (c) Sulu GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Component\Webspace;

use Sulu\Component\Content\Compat\Metadata;

/**
 * Represents a navigation context defined in webspace xml.
 */
class NavigationContext
{
    /**
     * @var Metadata
     */
    private $metadata;

    /**
     * @param string $key
     */
    public function __construct(private $key, $metadata)
    {
        $this->metadata = new Metadata($metadata);
    }

    /**
     * @return string
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * @param string $locale
     *
     * @return null|string
     */
    public function getTitle($locale)
    {
        return $this->metadata->get('title', $locale, \ucfirst($this->key));
    }

    /**
     * @return array
     */
    public function getMetadata()
    {
        return $this->metadata->getData();
    }
}

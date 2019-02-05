<?php
/**
 * Server-side rendering of the `core/calendar` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/calendar` block on server.
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the block content.
 */
function render_block_core_calendar( $attributes ) {
	return '';
}

/**
 * Registers the `core/calendar` block on server.
 */
function register_block_core_calendar() {
	register_block_type(
		'core/calendar',
		array(
			'attributes'      => array(),
			'render_callback' => 'render_block_core_calendar',
		)
	);
}

add_action( 'init', 'register_block_core_calendar' );

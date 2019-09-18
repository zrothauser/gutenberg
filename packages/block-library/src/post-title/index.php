<?php
/**
 * Server-side rendering of the `core/post-title` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/post-title` block on the server.
 *
 * @global WP_Query $wp_query WordPress query object.
 *
 * @return string Returns the filtered post title for the current post wrapped inside "h1" tags.
 */
function render_block_core_post_title() {
	global $wp_query;

	if ( isset( $wp_query ) && ! in_the_loop() ) {
		rewind_posts();
		the_post();
	}

	// Ensure no infinite loop occurs.
	if ( 'wp_template' === get_post_type() ) {
		return '';
	}

	return the_title( '<h1 class="entry-title">', '</h1>', false );
}

/**
 * Registers the `core/post-title` block on the server.
 */
function register_block_core_post_title() {
	register_block_type(
		'core/post-title',
		array(
			'render_callback' => 'render_block_core_post_title',
		)
	);
}
add_action( 'init', 'register_block_core_post_title' );

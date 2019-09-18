<?php
/**
 * Server-side rendering of the `core/post-content` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/post-content` block on the server.
 *
 * @global WP_Query $wp_query WordPress query object.
 *
 * @return string Returns the filtered post content of the current post.
 */
function render_block_core_post_content() {
	global $wp_query;

	if ( isset( $wp_query ) && ! in_the_loop() ) {
		rewind_posts();
		the_post();
	}

	// Ensure no infinite loop occurs.
	if ( 'wp_template' === get_post_type() ) {
		return '';
	}

	return '<div class="entry-content">' . apply_filters( 'the_content', str_replace( ']]>', ']]&gt;', get_the_content() ) ) . '</div>';
}

/**
 * Registers the `core/post-content` block on the server.
 */
function register_block_core_post_content() {
	register_block_type(
		'core/post-content',
		array(
			'render_callback' => 'render_block_core_post_content',
		)
	);
}
add_action( 'init', 'register_block_core_post_content' );

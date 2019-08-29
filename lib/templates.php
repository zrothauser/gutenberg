<?php
/**
 * Register Gutenberg core block editor templates.
 *
 * @package gutenberg
 */

/**
 * Registers Gutenberg core block editor templates.
 */
function gutenberg_register_templates() {
	if (
		get_option( 'gutenberg-experiments' ) &&
		! array_key_exists( 'gutenberg-full-site-editing', get_option( 'gutenberg-experiments' ) )
	) {
		return;
	}

	register_post_type(
		'wp_template',
		array(
			'labels'       => array(
				'name' => __( 'Templates', 'gutenberg' ),
			),
			'show_in_rest' => true,
		)
	);

	$template_query = new WP_Query(
		array(
			'post_type' => 'wp_template',
			'name'      => 'single-post',
		)
	);
	if ( ! $template_query->have_posts() ) {
		wp_insert_post(
			array(
				'post_type'    => 'wp_template',
				'post_name'    => 'single-post',
				'post_content' => '<!-- wp:post-title /--><!-- wp:post-content /-->',
			)
		);
	}
}
add_action( 'init', 'gutenberg_register_templates' );

/**
 * Adds the relevant template ID to the block editor settings.
 *
 * @param array $settings The editor settings.
 *
 * @return array The editor settings with the relevant template ID.
 */
function gutenberg_templates_filter_block_editor_settings( $settings ) {
	if (
		get_option( 'gutenberg-experiments' ) &&
		! array_key_exists( 'gutenberg-full-site-editing', get_option( 'gutenberg-experiments' ) )
	) {
		return $settings;
	}

	$template_query = new WP_Query(
		array(
			'post_type' => 'wp_template',
			'name'      => 'single-post',
		)
	);
	$template       = $template_query->get_posts();
	$template_id    = $template[0]->ID;

	$settings['templateId'] = $template_id;
	return $settings;
}
add_filter( 'block_editor_settings', 'gutenberg_templates_filter_block_editor_settings' );

<?php
/**
 * Plugin Name: Gutenberg Test Plugin, CPT Locking
 * Plugin URI: https://github.com/WordPress/gutenberg
 * Author: Gutenberg Team
 *
 * @package gutenberg-test-cpt-locking
 */

/**
 * Registers CPT's with 3 diffferent types of locking.
 */
function gutenberg_test_cpt_locking() {
	$template = array(
		array( 'core/image' ),
		array(
			'core/paragraph',
			array(
				'placeholder' => 'Add a description',
			),
		),
		array( 'core/quote' ),
	);

	$template_with_innerblocks = array(
		array( 'core/image' ),
		array(
			'test/test-inner-blocks-disable-locking',
			array(),
			array(
				array(
					'core/paragraph',
					array(
						'placeholder' => 'Add a description',
					),
				),
			),
		),
	);

	register_post_type(
		'locked-all-post',
		array(
			'public'        => true,
			'label'         => 'Locked All Post',
			'show_in_rest'  => true,
			'template'      => $template,
			'template_lock' => 'all',
		)
	);
	register_post_type(
		'locked-with-unlocked',
		array(
			'public'        => true,
			'label'         => 'Locked All Post With Unlocked InnerBlocks Post',
			'show_in_rest'  => true,
			'template'      => $template_with_innerblocks,
			'template_lock' => 'all',
		)
	);
	register_post_type(
		'locked-insert-post',
		array(
			'public'        => true,
			'label'         => 'Locked Insert Post',
			'show_in_rest'  => true,
			'template'      => $template,
			'template_lock' => 'insert',
		)
	);
	register_post_type(
		'not-locked-post',
		array(
			'public'        => true,
			'label'         => 'Not Locked Post',
			'show_in_rest'  => true,
			'template'      => $template,
			'template_lock' => false,
		)
	);
}

add_action( 'init', 'gutenberg_test_cpt_locking' );

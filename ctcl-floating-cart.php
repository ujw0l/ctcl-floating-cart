<?php
/**
 * Plugin Name:       Ctcl Floating Cart
 * Description:       CT Commerce Lite Floating cart block
 * Requires at least: 6.3.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            UjW0L
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ctcl-floating-cart
 *
 * @package           create-block
 */

 if(class_exists('ctcLite')){

	/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_ctcl_floating_cart_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_ctcl_floating_cart_block_init' );

 }else{

	add_thickbox();
	/**
	 * If main plugin CTC lite is not installed
	 */
	 add_action( 'admin_notices', function(){
		 echo '<div class="notice notice-error is-dismissible"><p>';
		 esc_html(_e( 'CTCL Floating Cart plugin requires CT Commerece Lite plugin installed and activated to work, please do so first.', 'ctcl-floating-cart' ));
		  echo '<a href="'.esc_url(admin_url('plugin-install.php')).'?tab=plugin-information&plugin=ctc-lite&TB_iframe=true&width=640&height=500" class="thickbox">'.esc_html(__('Click Here to install it','ctcl-floating-cart')).' </a>'; 
		 echo '</p></div>';
	 } );


 }


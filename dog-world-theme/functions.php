<?php
define('DOGWORLD_VERSION', '1.0.0');

if (!function_exists('dogworld_setup')):
function dogworld_setup() {
    load_theme_textdomain('dogworld');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', array(
        'height'      => 80,
        'width'       => 280,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');
    add_theme_support('wp-block-styles');
    add_theme_support('automatic-feed-links');

    register_nav_menus(array(
        'primary' => esc_html__('Primary Menu', 'dogworld'),
        'footer'  => esc_html__('Footer Menu', 'dogworld'),
    ));
}
endif;
add_action('after_setup_theme', 'dogworld_setup');

function dogworld_content_width() {
    $GLOBALS['content_width'] = 1200;
}
add_action('after_setup_theme', 'dogworld_content_width', 0);

function dogworld_scripts() {
    wp_enqueue_style('dogworld-main', get_template_directory_uri() . '/assets/css/main.css', array(), DOGWORLD_VERSION);
    wp_enqueue_script('dogworld-main', get_template_directory_uri() . '/assets/js/main.js', array(), DOGWORLD_VERSION, true);

    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'dogworld_scripts');

function dogworld_widgets_init() {
    register_sidebar(array(
        'name'          => esc_html__('Sidebar', 'dogworld'),
        'id'            => 'sidebar-1',
        'description'   => esc_html__('Main sidebar area', 'dogworld'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
    register_sidebar(array(
        'name'          => esc_html__('Footer 1', 'dogworld'),
        'id'            => 'footer-1',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
    register_sidebar(array(
        'name'          => esc_html__('Footer 2', 'dogworld'),
        'id'            => 'footer-2',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
    register_sidebar(array(
        'name'          => esc_html__('Footer 3', 'dogworld'),
        'id'            => 'footer-3',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
    register_sidebar(array(
        'name'          => esc_html__('Footer 4', 'dogworld'),
        'id'            => 'footer-4',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
    register_sidebar(array(
        'name'          => esc_html__('Ad Before Content', 'dogworld'),
        'id'            => 'ad-before-content',
        'before_widget' => '<div id="%1$s" class="ad-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<span class="ad-label">',
        'after_title'   => '</span>',
    ));
    register_sidebar(array(
        'name'          => esc_html__('Ad After Content', 'dogworld'),
        'id'            => 'ad-after-content',
        'before_widget' => '<div id="%1$s" class="ad-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<span class="ad-label">',
        'after_title'   => '</span>',
    ));
    register_sidebar(array(
        'name'          => esc_html__('Ad In Content', 'dogworld'),
        'id'            => 'ad-in-content',
        'before_widget' => '<div id="%1$s" class="ad-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<span class="ad-label">',
        'after_title'   => '</span>',
    ));
}
add_action('widgets_init', 'dogworld_widgets_init');

function dogworld_category_page_title($title) {
    if (is_category()) {
        $title = single_cat_title('', false);
    }
    return $title;
}
add_filter('get_the_archive_title', 'dogworld_category_page_title');

function dogworld_excerpt_length($length) {
    return 35;
}
add_filter('excerpt_length', 'dogworld_excerpt_length');

function dogworld_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'dogworld_excerpt_more');

function dogworld_register_category_images() {
    add_term_meta('category', 'category_image', '', true);
}
add_action('init', 'dogworld_register_category_images');

function dogworld_body_classes($classes) {
    if (is_singular()) {
        $classes[] = 'singular';
    }
    if (is_active_sidebar('sidebar-1')) {
        $classes[] = 'has-sidebar';
    } else {
        $classes[] = 'no-sidebar';
    }
    if (is_rtl()) {
        $classes[] = 'rtl';
    }
    return $classes;
}
add_filter('body_class', 'dogworld_body_classes');

function dogworld_contact_form_shortcode() {
    ob_start();
    ?>
    <form class="contact-form" method="post" action="">
        <div class="form-group">
            <label for="cf_name"><?php esc_html_e('Your Name', 'dogworld'); ?> *</label>
            <input type="text" id="cf_name" name="cf_name" required>
        </div>
        <div class="form-group">
            <label for="cf_email"><?php esc_html_e('Your Email', 'dogworld'); ?> *</label>
            <input type="email" id="cf_email" name="cf_email" required>
        </div>
        <div class="form-group">
            <label for="cf_subject"><?php esc_html_e('Subject', 'dogworld'); ?></label>
            <input type="text" id="cf_subject" name="cf_subject">
        </div>
        <div class="form-group">
            <label for="cf_message"><?php esc_html_e('Your Message', 'dogworld'); ?> *</label>
            <textarea id="cf_message" name="cf_message" rows="6" required></textarea>
        </div>
        <div class="form-group">
            <?php wp_nonce_field('dogworld_contact_action', 'dogworld_contact_nonce'); ?>
            <button type="submit" name="dogworld_contact_submit" class="btn btn-primary"><?php esc_html_e('Send Message', 'dogworld'); ?></button>
        </div>
    </form>
    <?php
    return ob_get_clean();
}
add_shortcode('dogworld_contact_form', 'dogworld_contact_form_shortcode');

function dogworld_handle_contact_form() {
    if (isset($_POST['dogworld_contact_submit']) && isset($_POST['dogworld_contact_nonce'])) {
        if (!wp_verify_nonce($_POST['dogworld_contact_nonce'], 'dogworld_contact_action')) {
            wp_die('Security check failed.');
        }
        $name    = sanitize_text_field($_POST['cf_name']);
        $email   = sanitize_email($_POST['cf_email']);
        $subject = sanitize_text_field($_POST['cf_subject']);
        $message = sanitize_textarea_field($_POST['cf_message']);

        $to      = get_option('admin_email');
        $headers = array('Content-Type: text/html; charset=UTF-8', 'From: ' . $name . ' <' . $email . '>');
        $body    = "<h2>Contact Form Submission</h2><p><strong>Name:</strong> {$name}</p><p><strong>Email:</strong> {$email}</p><p><strong>Subject:</strong> {$subject}</p><p><strong>Message:</strong><br>{$message}</p>";

        wp_mail($to, 'Contact: ' . $subject, $body, $headers);
    }
}
add_action('init', 'dogworld_handle_contact_form');

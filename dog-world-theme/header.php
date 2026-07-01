<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#main"><?php esc_html_e('Skip to content', 'dogworld'); ?></a>

<header id="masthead" class="site-header">
  <div class="header-inner">
    <div class="site-branding">
      <?php if (has_custom_logo()): ?>
        <div class="site-logo"><?php the_custom_logo(); ?></div>
      <?php else: ?>
        <div class="site-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 2C9.716 2 3 8.716 3 17c0 4.5 2.1 8.5 5.4 11.2C7 31 6 33.5 6 34c0 .6.4 1 1 1 3 0 6.5-1.5 9-4 1 .1 2 .2 3 .2s2-.1 3-.2c2.5 2.5 6 4 9 4 .6 0 1-.4 1-1 0-.5-1-3-2.4-5.8C30.9 25.5 33 21.5 33 17 33 8.716 26.284 2 18 2z" fill="#E8883A"/><circle cx="12" cy="14" r="2" fill="#fff"/><circle cx="24" cy="14" r="2" fill="#fff"/><path d="M13 20c0 0 2 3 5 3s5-3 5-3" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <span class="site-title"><a href="<?php echo esc_url(home_url('/')); ?>" rel="home"><?php bloginfo('name'); ?></a></span>
      <?php endif; ?>
    </div>

    <nav id="site-navigation" class="main-navigation" aria-label="<?php esc_attr_e('Primary Menu', 'dogworld'); ?>">
      <button class="menu-toggle" aria-expanded="false" aria-label="<?php esc_attr_e('Toggle menu', 'dogworld'); ?>">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <?php
      wp_nav_menu(array(
        'theme_location' => 'primary',
        'container'      => false,
        'menu_class'     => 'menu',
        'fallback_cb'    => 'dogworld_primary_menu_fallback',
        'depth'          => 3,
      ));
      ?>
    </nav>

    <div class="header-search">
      <button class="search-toggle" aria-label="<?php esc_attr_e('Toggle search', 'dogworld'); ?>">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
      <div class="search-form-header">
        <?php get_search_form(); ?>
      </div>
    </div>
  </div>
</header>

<main id="main" class="site-content">
<?php
function dogworld_primary_menu_fallback() {
  echo '<ul class="menu">';
  wp_list_pages(array('title_li' => '', 'depth' => 2));
  echo '</ul>';
}

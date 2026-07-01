<?php get_header(); ?>

<div class="page-header">
  <div class="container">
    <h1><?php the_title(); ?></h1>
  </div>
</div>

<div class="content-area <?php echo !is_active_sidebar('sidebar-1') ? 'no-sidebar' : ''; ?>">
  <div class="primary">
    <?php if (is_active_sidebar('ad-before-content')) dynamic_sidebar('ad-before-content'); ?>

    <?php while (have_posts()): the_post(); ?>
      <article id="post-<?php the_ID(); ?>" <?php post_class('page-content'); ?>>
        <?php the_content(); ?>
        <?php
        wp_link_pages(array(
          'before' => '<div class="page-links">' . esc_html__('Pages:', 'dogworld'),
          'after'  => '</div>',
        ));
        ?>
      </article>
    <?php endwhile; ?>

    <?php if (is_active_sidebar('ad-after-content')) dynamic_sidebar('ad-after-content'); ?>
  </div>

  <?php if (is_active_sidebar('sidebar-1')): ?>
    <aside class="sidebar"><?php dynamic_sidebar('sidebar-1'); ?></aside>
  <?php endif; ?>
</div>

<?php get_footer(); ?>

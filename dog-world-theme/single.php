<?php get_header(); ?>

<?php while (have_posts()): the_post(); ?>

<div class="single-post-header">
  <div class="container">
    <div class="breadcrumbs">
      <a href="<?php echo esc_url(home_url('/')); ?>"><?php esc_html_e('Home', 'dogworld'); ?></a>
      <span class="separator">/</span>
      <?php
      $categories = get_the_category();
      if (!empty($categories)):
        echo '<a href="' . esc_url(get_category_link($categories[0]->term_id)) . '">' . esc_html($categories[0]->name) . '</a>';
        echo '<span class="separator">/</span>';
      endif;
      ?>
      <span><?php the_title(); ?></span>
    </div>
    <h1><?php the_title(); ?></h1>
    <div class="post-meta">
      <span><?php echo get_the_date(); ?></span>
      <?php if (has_category()): ?>
        <span> &mdash; <?php the_category(', '); ?></span>
      <?php endif; ?>
    </div>
  </div>
</div>

<div class="content-area <?php echo !is_active_sidebar('sidebar-1') ? 'no-sidebar' : ''; ?>">
  <div class="primary">
    <?php if (is_active_sidebar('ad-before-content')) dynamic_sidebar('ad-before-content'); ?>

    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
      <?php if (has_post_thumbnail()): ?>
        <div class="post-thumbnail-single">
          <?php the_post_thumbnail('large'); ?>
        </div>
      <?php endif; ?>

      <div class="post-content">
        <?php the_content(); ?>
      </div>

      <?php
      wp_link_pages(array(
        'before' => '<div class="page-links">' . esc_html__('Pages:', 'dogworld'),
        'after'  => '</div>',
      ));
      ?>

      <?php if (has_tag()): ?>
        <div class="post-tags">
          <?php the_tags('', '', ''); ?>
        </div>
      <?php endif; ?>
    </article>

    <?php if (is_active_sidebar('ad-after-content')) dynamic_sidebar('ad-after-content'); ?>

    <?php
    $related = new WP_Query(array(
      'category__in'   => wp_get_post_categories(get_the_ID()),
      'posts_per_page' => 3,
      'post__not_in'   => array(get_the_ID()),
    ));
    if ($related->have_posts()):
    ?>
      <section class="related-posts">
        <h3><?php esc_html_e('Related Articles', 'dogworld'); ?></h3>
        <div class="related-grid">
          <?php while ($related->have_posts()): $related->the_post(); ?>
            <article class="post-card">
              <?php if (has_post_thumbnail()): ?>
                <div class="post-card-thumb">
                  <a href="<?php the_permalink(); ?>"><?php the_post_thumbnail('medium'); ?></a>
                </div>
              <?php endif; ?>
              <div class="post-card-body">
                <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                <div class="post-card-meta"><?php echo get_the_date(); ?></div>
              </div>
            </article>
          <?php endwhile; wp_reset_postdata(); ?>
        </div>
      </section>
    <?php endif; ?>

    <?php
    if (comments_open() || get_comments_number()):
      comments_template();
    endif;
    ?>
  </div>

  <?php if (is_active_sidebar('sidebar-1')): ?>
    <aside class="sidebar"><?php dynamic_sidebar('sidebar-1'); ?></aside>
  <?php endif; ?>
</div>

<?php endwhile; ?>

<?php get_footer(); ?>

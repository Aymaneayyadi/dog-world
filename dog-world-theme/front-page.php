<?php get_header(); ?>

<section class="hero-section">
  <div class="hero-content">
    <h1><?php esc_html_e('Everything About Dogs', 'dogworld'); ?></h1>
    <p><?php esc_html_e('Expert advice on dog health, food, training, breeds, grooming and more. Your ultimate guide to being the best dog parent.', 'dogworld'); ?></p>
    <div class="hero-search">
      <form role="search" method="get" action="<?php echo esc_url(home_url('/')); ?>">
        <input type="search" name="s" placeholder="<?php esc_attr_e('Search articles...', 'dogworld'); ?>" required>
        <button type="submit"><?php esc_html_e('Search', 'dogworld'); ?></button>
      </form>
    </div>
  </div>
</section>

<div class="content-area no-sidebar">
  <div class="primary">

    <?php if (is_active_sidebar('ad-before-content')): ?>
      <div class="ad-area"><?php dynamic_sidebar('ad-before-content'); ?></div>
    <?php endif; ?>

    <?php
    $featured_args = array(
      'posts_per_page' => 6,
      'ignore_sticky_posts' => 1,
    );
    $featured_query = new WP_Query($featured_args);
    if ($featured_query->have_posts()):
    ?>
      <section class="featured-posts">
        <h2><?php esc_html_e('Latest Articles', 'dogworld'); ?></h2>
        <div class="posts-grid">
          <?php while ($featured_query->have_posts()): $featured_query->the_post(); ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class('post-card'); ?>>
              <?php if (has_post_thumbnail()): ?>
                <div class="post-card-thumb">
                  <a href="<?php the_permalink(); ?>"><?php the_post_thumbnail('medium'); ?></a>
                  <?php
                  $categories = get_the_category();
                  if (!empty($categories)):
                  ?>
                    <span class="post-card-cat"><a href="<?php echo esc_url(get_category_link($categories[0]->term_id)); ?>"><?php echo esc_html($categories[0]->name); ?></a></span>
                  <?php endif; ?>
                </div>
              <?php endif; ?>
              <div class="post-card-body">
                <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                <div class="post-card-meta"><?php echo get_the_date(); ?></div>
                <div class="post-card-excerpt"><?php the_excerpt(); ?></div>
              </div>
            </article>
          <?php endwhile; wp_reset_postdata(); ?>
        </div>
      </section>
    <?php endif; ?>



    <?php if (is_active_sidebar('ad-after-content')): ?>
      <div class="ad-area"><?php dynamic_sidebar('ad-after-content'); ?></div>
    <?php endif; ?>

  </div>
</div>

<?php get_footer(); ?>

<?php get_header(); ?>

<div class="archive-header">
  <div class="container">
    <h1><?php the_archive_title(); ?></h1>
    <?php if (get_the_archive_description()): ?>
      <div class="archive-desc"><?php the_archive_description(); ?></div>
    <?php endif; ?>
  </div>
</div>

<div class="content-area <?php echo !is_active_sidebar('sidebar-1') ? 'no-sidebar' : ''; ?>">
  <div class="primary">
    <?php if (is_active_sidebar('ad-before-content')) dynamic_sidebar('ad-before-content'); ?>

    <?php if (have_posts()): ?>
      <div class="posts-grid">
        <?php while (have_posts()): the_post(); ?>
          <article id="post-<?php the_ID(); ?>" <?php post_class('post-card'); ?>>
            <?php if (has_post_thumbnail()): ?>
              <div class="post-card-thumb">
                <a href="<?php the_permalink(); ?>"><?php the_post_thumbnail('medium'); ?></a>
              </div>
            <?php endif; ?>
            <div class="post-card-body">
              <?php
              $categories = get_the_category();
              if (!empty($categories)):
              ?>
                <span class="post-card-cat"><a href="<?php echo esc_url(get_category_link($categories[0]->term_id)); ?>"><?php echo esc_html($categories[0]->name); ?></a></span>
              <?php endif; ?>
              <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
              <div class="post-card-meta"><?php echo get_the_date(); ?></div>
              <div class="post-card-excerpt"><?php the_excerpt(); ?></div>
            </div>
          </article>
        <?php endwhile; ?>
      </div>
      <div class="pagination">
        <?php
        echo paginate_links(array(
          'prev_text' => '&laquo;',
          'next_text' => '&raquo;',
        ));
        ?>
      </div>
    <?php else: ?>
      <div class="no-results">
        <h2><?php esc_html_e('Nothing Found', 'dogworld'); ?></h2>
        <p><?php esc_html_e('No posts found in this category.', 'dogworld'); ?></p>
        <?php get_search_form(); ?>
      </div>
    <?php endif; ?>

    <?php if (is_active_sidebar('ad-after-content')) dynamic_sidebar('ad-after-content'); ?>
  </div>

  <?php if (is_active_sidebar('sidebar-1')): ?>
    <aside class="sidebar"><?php dynamic_sidebar('sidebar-1'); ?></aside>
  <?php endif; ?>
</div>

<?php get_footer(); ?>

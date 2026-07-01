<?php get_header(); ?>

<div class="archive-header">
  <div class="container">
    <h1><?php printf(esc_html__('Search: %s', 'dogworld'), get_search_query()); ?></h1>
    <div class="archive-desc search-results-count">
      <?php printf(esc_html__('%d result(s) found', 'dogworld'), $wp_query->found_posts); ?>
    </div>
  </div>
</div>

<div class="content-area <?php echo !is_active_sidebar('sidebar-1') ? 'no-sidebar' : ''; ?>">
  <div class="primary">
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
              <span class="post-card-cat"><?php echo get_post_type(); ?></span>
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
        <h2><?php esc_html_e('No Results Found', 'dogworld'); ?></h2>
        <p><?php esc_html_e('Try a different search term.', 'dogworld'); ?></p>
        <?php get_search_form(); ?>
      </div>
    <?php endif; ?>
  </div>

  <?php if (is_active_sidebar('sidebar-1')): ?>
    <aside class="sidebar"><?php dynamic_sidebar('sidebar-1'); ?></aside>
  <?php endif; ?>
</div>

<?php get_footer(); ?>

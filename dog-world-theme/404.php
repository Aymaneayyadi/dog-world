<?php get_header(); ?>

<div class="content-area no-sidebar">
  <div class="primary">
    <div class="error-404">
      <h1>404</h1>
      <h2><?php esc_html_e('Page Not Found', 'dogworld'); ?></h2>
      <p><?php esc_html_e('Sorry, the page you were looking for does not exist.', 'dogworld'); ?></p>
      <a href="<?php echo esc_url(home_url('/')); ?>" class="btn btn-primary"><?php esc_html_e('Go Home', 'dogworld'); ?></a>
      <?php get_search_form(); ?>
    </div>
  </div>
</div>

<?php get_footer(); ?>

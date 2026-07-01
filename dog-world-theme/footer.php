</main>

<footer id="colophon" class="site-footer">
  <div class="footer-widgets">
    <div class="footer-widget-area"><?php if (is_active_sidebar('footer-1')) dynamic_sidebar('footer-1'); ?></div>
    <div class="footer-widget-area"><?php if (is_active_sidebar('footer-2')) dynamic_sidebar('footer-2'); ?></div>
    <div class="footer-widget-area"><?php if (is_active_sidebar('footer-3')) dynamic_sidebar('footer-3'); ?></div>
    <div class="footer-widget-area"><?php if (is_active_sidebar('footer-4')) dynamic_sidebar('footer-4'); ?></div>
  </div>
  <div class="footer-bottom">
    <div class="footer-bottom-inner">
      <div class="footer-copyright">
        &copy; <?php echo date('Y'); ?> <a href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a>.
        <?php esc_html_e('All rights reserved.', 'dogworld'); ?>
      </div>
      <?php
      wp_nav_menu(array(
        'theme_location' => 'footer',
        'container'      => false,
        'menu_class'     => 'footer-menu',
        'depth'          => 1,
        'fallback_cb'    => false,
      ));
      ?>
    </div>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>

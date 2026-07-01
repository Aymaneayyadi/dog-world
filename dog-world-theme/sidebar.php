<?php if (is_active_sidebar('sidebar-1')): ?>
  <aside class="sidebar" role="complementary">
    <?php dynamic_sidebar('sidebar-1'); ?>
    <?php if (is_active_sidebar('ad-in-content')) dynamic_sidebar('ad-in-content'); ?>
  </aside>
<?php endif; ?>

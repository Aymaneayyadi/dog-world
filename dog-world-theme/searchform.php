<form role="search" method="get" class="search-form" action="<?php echo esc_url(home_url('/')); ?>">
  <label>
    <span class="screen-reader-text"><?php esc_html_e('Search for:', 'dogworld'); ?></span>
    <input type="search" placeholder="<?php esc_attr_e('Search...', 'dogworld'); ?>" value="<?php echo get_search_query(); ?>" name="s">
  </label>
  <button type="submit"><?php esc_html_e('Search', 'dogworld'); ?></button>
</form>

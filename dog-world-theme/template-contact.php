<?php
/*
Template Name: Contact Page
*/
get_header(); ?>

<div class="page-header">
  <div class="container">
    <h1><?php the_title(); ?></h1>
  </div>
</div>

<div class="content-area no-sidebar">
  <div class="primary">
    <article class="page-content" style="max-width:800px;margin:0 auto;">
      <p><?php esc_html_e('Have a question, suggestion, or just want to say hello? We would love to hear from you! Fill out the form below and we will get back to you as soon as possible.', 'dogworld'); ?></p>
      <?php echo do_shortcode('[dogworld_contact_form]'); ?>
    </article>
  </div>
</div>

<?php get_footer(); ?>

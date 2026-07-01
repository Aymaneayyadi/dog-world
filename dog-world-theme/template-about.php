<?php
/*
Template Name: About Page
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
      <h2><?php esc_html_e('Welcome to Our Dog Community', 'dogworld'); ?></h2>
      <p><?php esc_html_e('We are dedicated to providing the most reliable, expert-backed information about dogs. From health and nutrition to training and behavior, we cover everything you need to give your furry friend the best life possible.', 'dogworld'); ?></p>
      <p><?php esc_html_e('Our team of passionate dog lovers, veterinarians, and trainers work together to bring you accurate, up-to-date content you can trust.', 'dogworld'); ?></p>

      <h3><?php esc_html_e('Our Mission', 'dogworld'); ?></h3>
      <p><?php esc_html_e('To empower dog owners worldwide with knowledge that strengthens the bond between humans and their canine companions. We believe every dog deserves a happy, healthy life.', 'dogworld'); ?></p>

      <h3><?php esc_html_e('What We Cover', 'dogworld'); ?></h3>
      <ul>
        <li><?php esc_html_e('Dog Health – Vet-approved health guides and tips', 'dogworld'); ?></li>
        <li><?php esc_html_e('Dog Food – Nutrition advice and product reviews', 'dogworld'); ?></li>
        <li><?php esc_html_e('Dog Training – Step-by-step training guides', 'dogworld'); ?></li>
        <li><?php esc_html_e('Puppy Care – Everything for new puppy parents', 'dogworld'); ?></li>
        <li><?php esc_html_e('Dog Breeds – Comprehensive breed information', 'dogworld'); ?></li>
        <li><?php esc_html_e('Dog Behavior – Understanding your dog', 'dogworld'); ?></li>
        <li><?php esc_html_e('Grooming – Professional grooming tips', 'dogworld'); ?></li>
        <li><?php esc_html_e('Dog Accessories – Best product recommendations', 'dogworld'); ?></li>
      </ul>
    </article>
  </div>
</div>

<?php get_footer(); ?>

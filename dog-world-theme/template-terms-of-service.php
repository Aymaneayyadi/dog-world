<?php
/*
Template Name: Terms of Service Page
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
      <p><strong><?php esc_html_e('Last updated:', 'dogworld'); ?> <?php echo date('F j, Y'); ?></strong></p>

      <h2><?php esc_html_e('Acceptance of Terms', 'dogworld'); ?></h2>
      <p><?php esc_html_e('By accessing and using this website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our website.', 'dogworld'); ?></p>

      <h2><?php esc_html_e('Use of Content', 'dogworld'); ?></h2>
      <p><?php esc_html_e('All content on this website is for informational purposes only. We make no representations or warranties about the accuracy, completeness, or suitability of the information provided.', 'dogworld'); ?></p>
      <p><?php esc_html_e('You may not reproduce, distribute, or create derivative works from our content without prior written consent.', 'dogworld'); ?></p>

      <h2><?php esc_html_e('User Conduct', 'dogworld'); ?></h2>
      <p><?php esc_html_e('You agree not to use this website for any unlawful purpose or in violation of any applicable laws. You must not post or transmit any harmful, offensive, or misleading content.', 'dogworld'); ?></p>

      <h2><?php esc_html_e('Intellectual Property', 'dogworld'); ?></h2>
      <p><?php esc_html_e('All content, trademarks, and intellectual property on this website are owned by or licensed to us. Unauthorized use is strictly prohibited.', 'dogworld'); ?></p>

      <h2><?php esc_html_e('Limitation of Liability', 'dogworld'); ?></h2>
      <p><?php esc_html_e('We shall not be liable for any damages arising from the use or inability to use this website, including but not limited to direct, indirect, incidental, or consequential damages.', 'dogworld'); ?></p>

      <h2><?php esc_html_e('Changes to Terms', 'dogworld'); ?></h2>
      <p><?php esc_html_e('We reserve the right to modify these terms at any time. Changes become effective immediately upon posting. Your continued use of the website constitutes acceptance of the updated terms.', 'dogworld'); ?></p>

      <h2><?php esc_html_e('Governing Law', 'dogworld'); ?></h2>
      <p><?php esc_html_e('These terms shall be governed by and construed in accordance with the applicable laws, without regard to conflict of law principles.', 'dogworld'); ?></p>

      <h2><?php esc_html_e('Contact', 'dogworld'); ?></h2>
      <p><?php esc_html_e('For any questions regarding these Terms of Service, please contact us through our contact page.', 'dogworld'); ?></p>
    </article>
  </div>
</div>

<?php get_footer(); ?>

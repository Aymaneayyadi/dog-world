<?php
/*
Template Name: Privacy Policy Page
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

      <h2><?php esc_html_e('Introduction', 'dogworld'); ?></h2>
      <p><?php esc_html_e('Welcome to our website. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website.', 'dogworld'); ?></p>

      <h2><?php esc_html_e('Information We Collect', 'dogworld'); ?></h2>
      <p><?php esc_html_e('We may collect the following types of information:', 'dogworld'); ?></p>
      <ul>
        <li><?php esc_html_e('Personal identification information (name, email address) when you voluntarily submit it through our contact form or comments', 'dogworld'); ?></li>
        <li><?php esc_html_e('Usage data such as pages visited, time spent, and browsing patterns through cookies and analytics tools', 'dogworld'); ?></li>
        <li><?php esc_html_e('Ad-related data through third-party advertising partners, including Google AdSense and Media.net', 'dogworld'); ?></li>
      </ul>

      <h2><?php esc_html_e('Cookies', 'dogworld'); ?></h2>
      <p><?php esc_html_e('We use cookies to improve your browsing experience, analyze site traffic, and serve personalized advertisements. You can control cookie preferences through your browser settings.', 'dogworld'); ?></p>

      <h2><?php esc_html_e('Advertising', 'dogworld'); ?></h2>
      <p><?php esc_html_e('We use third-party advertising companies to serve ads when you visit our website. These companies may use information about your visits to this and other websites to provide relevant advertisements.', 'dogworld'); ?></p>

      <h2><?php esc_html_e('Third-Party Links', 'dogworld'); ?></h2>
      <p><?php esc_html_e('Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.', 'dogworld'); ?></p>

      <h2><?php esc_html_e('Data Security', 'dogworld'); ?></h2>
      <p><?php esc_html_e('We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.', 'dogworld'); ?></p>

      <h2><?php esc_html_e('Contact', 'dogworld'); ?></h2>
      <p><?php esc_html_e('If you have any questions about this privacy policy, please contact us through our contact page.', 'dogworld'); ?></p>
    </article>
  </div>
</div>

<?php get_footer(); ?>

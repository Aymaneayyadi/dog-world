<div id="comments" class="comments-area">
  <?php if (have_comments()): ?>
    <h3 class="comments-title">
      <?php
      printf(
        esc_html(_n('%d Comment', '%d Comments', get_comments_number(), 'dogworld')),
        get_comments_number()
      );
      ?>
    </h3>
    <ol class="comment-list">
      <?php
      wp_list_comments(array(
        'style'       => 'ol',
        'short_ping'  => true,
        'avatar_size' => 48,
      ));
      ?>
    </ol>
    <?php if (get_comment_pages_count() > 1 && get_option('page_comments')): ?>
      <nav class="comment-navigation">
        <div class="nav-previous"><?php previous_comments_link(esc_html__('Older Comments', 'dogworld')); ?></div>
        <div class="nav-next"><?php next_comments_link(esc_html__('Newer Comments', 'dogworld')); ?></div>
      </nav>
    <?php endif; ?>
  <?php endif; ?>

  <?php if (!comments_open() && get_comments_number() && post_type_supports(get_post_type(), 'comments')): ?>
    <p class="no-comments"><?php esc_html_e('Comments are closed.', 'dogworld'); ?></p>
  <?php endif; ?>

  <?php comment_form(array(
    'title_reply_before' => '<h3 id="reply-title" class="comment-reply-title">',
    'title_reply_after'  => '</h3>',
  )); ?>
</div>

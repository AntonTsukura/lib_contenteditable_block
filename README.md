# WEB Code editor 
# contenteditable block lib-JS

Object of functions for creation a code editor in a contenteditable block 

v 0.0.1

Notice
  bad optimization

JS
HTML

## Animation main functions:
![tagbrain.gif](tagbrain.gif)


+ using
  + get a collection text editor fields or one field
    + field
      + contenteditable block
  + listen special events on these fields
    + ex
      + keyup
      + keydown
      + paste
      + other
  + if (you catch some event)
    + firstly give this post to object elements.current_post
  + after you can use functions from the object "functions"

  functions
    + find_parent_with_class()
    + get_sel_range()
      + sel obj
    + give_block_contenteditable()
      + determine current code window
    + get
      + get_current_line_div()
      + get_first_line()
      + get_row_words()
      + get_current_line_spaces()
      + get_caret_position()
      + get_position_in_row()
      + get_selection_blocks()
        + with html
    + transfer_line()
      + shift + enter
      + or enter only
    + tab
      + insert_tab()
      + delete_tab()
    + paste_text()
    + escape_text()
    + surround_text_in_html()
    + make_drop_down_rows()
    + find_row_words()
    + focus_end_row()
    + create_new_row()

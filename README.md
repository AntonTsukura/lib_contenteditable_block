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

  + functions
    + get_sel_range()
      + sel obj
    + get_current_line_div(node_par: Element | string)
    + get_current_div_n(node_par: Element | string)
    + get_first_line(post: Element)
    + create_new_row(content: string, is_enter: boolean)
    + get_current_line_spaces(current_node: Element)
    + get_first_spaces_and_boolen_exist_text(text_content: string, previous_spaces: number, pos_par: string)
    + focus_end_element(element: HTMLElement)
    + put_caret(node: HTMLElement | Text, pos: string)
    + get_row_caret_position()
    + iterate_childs_to_target(target_node: Node | Text, current_node: Node | Text, position_in_row_where_node: number)
    + get_position_in_row(target_node: HTMLElement | Text, node_position:number, current_row:Node)
    + surrounded_div(text: string)
    + transfer_line(tab_index: string)
    + insert_one_tab(focus: boolean, current_element: HTMLElement)
    + paste_formatting(paste: string)
    + deleteTab(target_block: HTMLElement, focus: boolean)
    + get_selection_obj()
    + escape_text(text: any)
    + get_pos_activation()
    + destruct_shape_activation_number(str_num: string)
    + generate_struct_activ_num(obj_allrow: [])
    + get_row_score(row_num: number)
    + get_depth_score(depth_num: number)
    + convert_num_to_custom_system(num: string)
    + get_octal_number(num: string)
    + search_format_function(current_post: HTMLElement, array_of_search_key: string[])
    + surround_post_text_in_tags_controller(rows: HTMLElement[], array_of_search_key: string[])
    + add_current_row(is_key_row: boolean, arr_objs_current_rows: {key: string,row: number,depth: number}[], obj_struct_activ: {key: string,row: number,depth: number,is_key_row: boolean})
    + validate_row_formate(node: HTMLElement, caret_pos: number)
    + put_rows(post:HTMLElement, is_return_array:boolean)
    + make_drop_down_blocks(parent_el: HTMLElement)
    + echo_data()


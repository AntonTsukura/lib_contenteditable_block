//function with tagbrain, 
	//free web text editor 
	//for creation self - optimizing graphs 
	//with the tags interface
	
//creator 
	//Anton Tsukura
	
// This is an early version of the editor
//MIT license

//using
	//get a collection text editor fields or one field
		//field
			//contenteditable block
	//listen special events on these fields
		//ex
			//keyup
			//keydown
			//paste
			//other
	//if (you catch some event)
		//firstly give this post to object elements.current_post
		//after you can use functions from the object "functions"

export let elements = {
     all_posts: document.querySelectorAll(".item_input"),
     current_post: document,
}
export let patterns = {
     invisible_char: '︀',
     pattern_tag: /#[\p{L}_0-9]*/gu,
     word: /(\w+)*/gu,
     pattern_symbols: /\$|\@|\&|\!|\(|\)|\{|\}|\[|\]|\↓|\||\→|\←|\↑|\+|<(|\/)span[^>]*>/g,
     code_pattern: /(\[code\][^]*\[\/code\])/gm,
     clean_codetag_pattern: /\[(|\/)code\]/gm,
}
//if you work with functions_obj get current_post from elements_obj
export let functions = {
     //terminal
     get_sel_range() {
          var sel, range;
          if (window.getSelection) {
               sel = window.getSelection();
               if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    return {
                         sel: sel,
                         range: range,
                    }
               }
          }
     },
     give_current_post() {
          let obj_caret = this.get_sel_range();
          let node = obj_caret.sel.anchorNode;
          elements.current_post = this.find_parent_with_class(node, "item_input");
     },
     find_parent_with_class(node, class_name) {
          let iterable_node = node;
          if (iterable_node.nodeType == 3) {
               iterable_node = iterable_node.parentNode;
          }
          while (iterable_node.classList.contains(class_name) == false) {
               iterable_node = iterable_node.parentNode;
               if (iterable_node.parentNode.classList.contains("site_template") == true)
                    break;
          }
          return iterable_node;
     },
     get_current_line_div(node_par) {
          let div_n = this.get_current_div_n(node_par);
          return elements.current_post.childNodes[div_n];
     },
     get_current_div_n(node_par) {
          let obj_caret = this.get_sel_range(),
               children_list1 = elements.current_post.children;

          //def curremt element
          let current_element = obj_caret.sel.anchorNode;
          if (typeof node_par === "string") {
               if (node_par === "start") {
                    current_element = obj_caret.sel.anchorNode
               }
               if (node_par === "end") {
                    current_element = obj_caret.sel.focusNode
               }
          } else if (node_par instanceof Element) {
               current_element = node_par;
          }

          if (current_element.nodeType == 3) {
               if (current_element.parentNode.classList.contains("item_input")) {
                    let selectNode_text = current_element.innerText;
                    let new_line_div = functions.surrounded_div(selectNode_text);
                    current_element = new_line_div;
                    children_list1 = elements.current_post.children;
               } else {
                    while (!current_element.parentNode.classList.contains("item_input")) {
                         current_element = current_element.parentNode;
                    }
               }
          } else if (current_element.classList.contains("item_input")) {
               let new_line_div = this.create_new_row("");//zero symbol
               current_element.innerHTML = "";
               current_element.appendChild(new_line_div);
               this.focus_end_element(new_line_div);
               current_element = new_line_div;
               children_list1 = elements.current_post.children;
          }
          for (let i = 0; i < children_list1.length; i++) {
               if (children_list1[i] == current_element) {
                    return i;
               }
          }
     },
     get_first_line(post) {
          let post_rows = post.childNodes;
          if (post_rows != null) {
               if (post_rows.length > 0) {
                    for (let i = 0; i < post_rows.length; i++) {
                         if (/\p{L}/gu.test(post_rows[i].innerText)) {
                              return post_rows[i];
                         }
                    }
               }
          }
     },
     find_row_words(post_row, array_of_search_key) {
          let content_row_text = post_row.innerText;
          let regexp = new RegExp(array_of_search_key.join("|"), 'gu');
          if (regexp.test(content_row_text)) {
               return true
          } else {
               return false
          }
     },
     create_new_row(content, is_enter) {
          let new_line_div = document.createElement("div");
          if (content != "") {
               new_line_div.innerHTML = content;
          } else if (is_enter == true) {
               let newtext = document.createTextNode("\n");
               new_line_div.appendChild(newtext);
          }
          new_line_div.className = "post_row";
          return new_line_div;
     },
     get_current_line_spaces(current_node) {
          let text_content = current_node.textContent;
          let obj_spaces = this.get_first_spaces_and_boolen_exist_text(text_content);
          return obj_spaces.spaces;
     },
     get_first_spaces_and_boolen_exist_text(text_content) {
          let textContent_characters_array = text_content.match(/./gi),
               textContent_first_spaces = 0,
               spaces_amount = 0,
               text_exist = false;

          if (textContent_characters_array != null) {
               for (let i = 0; i < textContent_characters_array.length; i++) {
                    if (textContent_characters_array[i] == patterns.invisible_char)
                         continue
                    if (textContent_characters_array[i] == " ") {
                         spaces_amount += 1;
                         continue
                    } else if (textContent_characters_array[i] == "\t") {
                         spaces_amount += 4;
                         continue
                    } else {
                         text_exist = true;
                         break
                    }
               }
               textContent_first_spaces = spaces_amount;
          }
          return {
               spaces: textContent_first_spaces,
               text_exist: text_exist,
          };
     },
     focus_end_element(element) {
          let new_range = new Range();
          new_range.selectNodeContents(element);
          document.getSelection().removeAllRanges();
          document.getSelection().addRange(new_range);
          new_range.collapse();
     },
     //textNode first level post
     surrounded_div(text) {
          //if contain several rows divide
          let obj_caret = this.get_sel_range(),
               range = obj_caret.range;
          range.deleteContents();
          let new_line_div = this.create_new_row(text);
          range.insertNode(new_line_div);
          obj_caret.sel.anchorNode.parentNode.removeChild(obj_caret.sel.anchorNode);
          range.collapse();
          return new_line_div;
     },
     get_row_caret_position() {
          let obj_caret = this.get_sel_range(),
               current_row = this.get_current_line_div(obj_caret.sel.anchorNode),
               caret_position = this.get_position_in_row(obj_caret.sel.anchorNode, obj_caret.sel.anchorOffset, current_row);
          return caret_position;
     },
     get_position_in_row(node, node_position, current_row) {
          let position_in_row_where_node = 0,
               current_row_childnodes = [];

          current_row_childnodes = current_row.childNodes;

          if (current_row_childnodes != null) {
               for (let i = 0; i < current_row_childnodes.length; i++) {
                    if (node == current_row_childnodes[i] || current_row_childnodes[i].contains(node)) {
                         position_in_row_where_node += node_position;
                         break
                    } else {
                         let child_textcont = current_row_childnodes[i];
                         if (current_row_childnodes[i].nodeType != 3)
                              child_textcont = current_row_childnodes[i].textContent;
                         position_in_row_where_node += child_textcont.length;
                    }
               }
          }
          current_row = current_row.textContent;

          return position_in_row_where_node;
     },
     transfer_line(tab_index) {
          let current_node = this.get_current_line_div(),
               current_node_content = current_node.textContent,
               amount_spaces_current_node = this.get_current_line_spaces(current_node),
               caret_position = this.get_row_caret_position(),
               first_part_content = current_node_content.slice(0, caret_position),
               second_part_content = current_node_content.slice(caret_position),
               obj_second_line_spaces = this.get_first_spaces_and_boolen_exist_text(second_part_content);


          tab_index == "enter" ? amount_spaces_current_node = 0 : true;
          if (obj_second_line_spaces.text_exist == false) {
               second_part_content = "";
          };

          current_node.textContent = first_part_content;
          let new_line_div;
          if (amount_spaces_current_node > 0) {
               let content = " ".repeat(amount_spaces_current_node) + second_part_content;
               new_line_div = this.create_new_row(content);
               current_node.after(new_line_div);
               let new_div_lastchild = new_line_div.lastChild;
               this.focus_end_element(new_div_lastchild);
          } else {
               let content = second_part_content;
               new_line_div = this.create_new_row(content, true);
               current_node.after(new_line_div);
               let new_div_lastchild = new_line_div.lastChild;
               this.focus_end_element(new_div_lastchild);
          }
     },
     insert_one_tab(focus, current_node) {
          let node_text = current_node.innerText;

          node_text = "    " + node_text;
          current_node.innerHTML = node_text;

          if (focus)
               if (focus == true)
                    this.focus_end_element(current_node);
     },
     paste_formatting(paste) {
          let this_post = elements.current_post,
               obj_caret = this.get_sel_range(),
               current_node = this.get_current_line_div(),
               paste_rows = [];
          paste_rows = paste.split("\n");
          //check count selectnodes

          //check count rows in paste text
          if (paste_rows.length < 2) {

               //check selected_several_line and get sel limits
               let selection_obj = this.get_selection_obj(),
                    start_sel_block = selection_obj.start_block_n,
                    end_sel_block = selection_obj.end_block_n;

               if (selection_obj.several_rows == true) {
                    obj_caret.sel.deleteFromDocument();
                    let paste_text_node = paste_rows[0];
                    let old_content_on_start_row = this_post.childNodes[start_sel_block].textContent;
                    this_post.childNodes[start_sel_block].textContent = old_content_on_start_row + paste_text_node;

                    //get value, append new value to node
                    if (/[\p{L}]*/.test(this_post.childNodes[start_sel_block + 1].textContent) == true) {
                         let spaces_previus_line_n = this.get_current_line_spaces(this_post.childNodes[start_sel_block]);
                         let content_second_line = this_post.childNodes[start_sel_block + 1].textContent;
                         this_post.childNodes[start_sel_block + 1].textContent = " ".repeat(spaces_previus_line_n) + content_second_line;
                    } else { //remove zero line
                         removeChild(this_post.childNodes[start_sel_block + 1]);
                    }

                    this.focus_end_element(this_post.childNodes[start_sel_block]);
               } else { //select content on one line

                    obj_caret.sel.deleteFromDocument();
                    let paste_text_node = paste_rows[0],
                         old_content_on_start_row = this_post.childNodes[start_sel_block].textContent,

                         caret_position = this.get_row_caret_position(),
                         paste_line = [old_content_on_start_row.slice(0, caret_position), paste_text_node, old_content_on_start_row.slice(caret_position)].join('');

                    this_post.childNodes[start_sel_block].textContent = paste_line;
                    this.focus_end_element(this_post.childNodes[start_sel_block]);
               }

          } else {
               for (let i = 0; i < paste_rows.length; i++) {
                    let paste_line = this.create_new_row(paste_rows[i]);
                    obj_caret.sel.deleteFromDocument();
                    current_node.after(paste_line);
                    this.focus_end_element(paste_line);
                    current_node = paste_line;
               }
          }

     },
     deleteTab(target_block, focus) {
          let content = target_block.innerText;

          if (content.startsWith(patterns.invisible_char)) {
               content = content.replace(patterns.invisible_char, "");
          }

          content = content.replace("\t", "    ");
          if (content.startsWith('    ')) {
               content = content.substr(4);
          } else if (content.startsWith('   ')) {
               content = content.substr(3);
          } else if (content.startsWith('  ')) {
               content = content.substr(2);
          } else if (content.startsWith(' ')) {
               content = content.substr(1);
          };

          target_block.innerHTML = content;

          if (focus)
               if (focus == true)
                    this.focus_end_element(target_block);
     },
     get_selection_obj() {
          let limit_sel_div1 = this.get_current_div_n("start"),
               limit_sel_div2 = this.get_current_div_n("end"),
               selected_several_rows = false,
               obj_range = this.get_sel_range(),
               start_block_n,
               end_block_n,
               is_direct = true,
               start_sel_node,
               start_sel_node_pos,
               end_sel_node,
               end_sel_node_pos;

          obj_range.sel.anchorNode
          if (limit_sel_div1 < limit_sel_div2) {
               is_direct = true;
               start_block_n = limit_sel_div1;
               end_block_n = limit_sel_div2;
          } else if (limit_sel_div1 > limit_sel_div2) {
               is_direct = false;
               start_block_n = limit_sel_div2;
               end_block_n = limit_sel_div1;
          } else {
               start_block_n = limit_sel_div1;
               end_block_n = limit_sel_div1;
          }

          if (is_direct == true) {
               start_sel_node = obj_range.sel.anchorNode;
               start_sel_node_pos = obj_range.sel.anchorOffset;
               end_sel_node = obj_range.sel.focusNode;
               end_sel_node_pos = obj_range.sel.focusOffset;
          } else {
               start_sel_node = obj_range.sel.focusNode;
               start_sel_node_pos = obj_range.sel.focusOffset;
               end_sel_node = obj_range.sel.anchorNode;
               end_sel_node_pos = obj_range.sel.anchorOffset;
          }

          //count selection rows
          if ((end_block_n - start_block_n) > 0)
               selected_several_rows = true;

          return {
               range: obj_range.range,
               several_rows: selected_several_rows,
               start_block_n: start_block_n,
               end_block_n: end_block_n,
               node_start: start_sel_node,
               node_end: end_sel_node,
               node_start_pos: start_sel_node_pos,
               node_end_pos: end_sel_node_pos,
          }
     },
     escape_text(text) {
          const obj_escape_html_map = {
               '&amp;': '&',
               '&lt;': '<',
               '&gt;': '>',
               '&quot': '"',
               '&#039;': "'",
               '&nbsp;': " ",
          };
          return text.replace(/&amp;|&lt;|&gt;|&quot|&#039|&nbsp;/g, function (pattern) {
               return obj_escape_html_map[pattern];
          });
     },
     //search block
     search_format_function(current_post, array_of_search_key) {
          let rows = current_post.childNodes;

          let obj_result_search = this.surround_post_text_in_tags_controller(rows, array_of_search_key);
          let finded_words = obj_result_search.finded_words;
          let finded_tags_post = obj_result_search.finded_all_tags_array;

          return {
               finded_words: finded_words,
               finded_tags_post: finded_tags_post,
          }
     },
     surround_post_text_in_tags_controller(rows, array_of_search_key) {
          let finded_words = [],
               finded_all_tags_array = [];

          for (let i = 0; i < rows.length; i++) {
               let text_row = rows[i].textContent;
               let escaped_itext_row = this.escape_text(text_row);

               let text_symbols_spans_formatting = escaped_itext_row.replace(patterns.pattern_symbols, function (match_pattern) {
                    if (match_pattern.indexOf("span") != -1) {
                         match_pattern = "";
                    } else {
                         match_pattern = "<span class='special_symbols_style'>" + match_pattern + "</span>";
                    }
                    return match_pattern;
               });

               let regexp;
               let array_is_empty = false;

               if (array_of_search_key != null) {
                    if (array_of_search_key.length > 0) {
                         regexp = new RegExp(array_of_search_key.join('|') + '|#[\\p{L}_0-9]*', 'gmu');
                    } else {
                         array_is_empty = true;
                         regexp = new RegExp('#[\\p{L}_0-9]*', 'gmu');
                    }
               }

               let text_with_symbols_tags = text_symbols_spans_formatting.replace(regexp, function (search_key) {
                    if (array_is_empty == false) {
                         if (array_of_search_key.includes(search_key) == true) {
                              finded_words.push(search_key);
                              if (/#[\p{L}_0-9]*/.test(search_key) == true) {
                                   finded_all_tags_array.push(search_key);
                                   search_key = "<span class='item_tags_style'><mark>" + search_key + "</mark></span>";
                                   return search_key;
                              } else {
                                   search_key = "<mark>" + search_key + "</mark>";
                                   return search_key;
                              }
                         }
                    }
                    if (/#[\p{L}_0-9]*/.test(search_key) == true) {
                         finded_all_tags_array.push(search_key);
                         if (array_is_empty == false) {
                              let reg_words_in_tag = new RegExp(array_of_search_key.join('|'), 'gu')
                              search_key = search_key.replace(reg_words_in_tag, function (word) {
                                   finded_words.push(word);
                                   word = "<mark>" + word + "</mark>";
                                   return word;
                              })
                         }
                         search_key = "<span class='item_tags_style'>" + search_key + "</span>";
                         return search_key;
                    }
               });

               rows[i].innerHTML = text_with_symbols_tags;
          }
          return {
               finded_words: finded_words,
               finded_all_tags_array: finded_all_tags_array,
          }
     },
     //
     put_collapsing_arrows(parent_el) {
          /*
          let classes_arr = [];
          var dictionary_row_spaces = {}
          classes_arr = parent_el.childNodes;
          if(classes_arr.length > 0){
               for(let i = 0; i < classes_arr.length; i++){
                    let text = classes_arr[i].textContent;
                    let obj_spaces = this.get_first_spaces_and_boolen_exist_text(text);
                    dictionary_row_spaces[i]= obj_spaces.spaces;
               }
          }
          for(let j in dictionary_row_spaces){
               //check exist
               if(dictionary_row_spaces[j] < dictionary_row_spaces[j+1]){
                    classes_arr[j].classList.add("class_open");
                    let subclasses = [];
               }
               let z = j;
               while(dictionary_row_spaces[j] < dictionary_row_spaces[z+1]){
                    subclasses.push(classes_arr[j+1]);
                    continue;
               }
               classes_arr[j].addEventListener('click', function (e) {
                    pos = this.getBoundingClientRect();
                    if (e.offsetX < pos.left) {
                         let el_CL = classes_arr[j].classList;
                         if(el_CL.contains("class_open")){
                              el_CL.remove('class_open');
                              el_CL.add('class_close');
                              if(subclasses != null){
                                   for(let c = 0;  ){

                                   }
                              }
                         } else {
                              el_CL.add('class_open');
                              el_CL.close('class_close');
                         }
                    }
                });
                
               //create event click content class
                    //action
                         //add subclass_elements class "subclass"
                         //backward
      
          }
          */
          //if row[n][spaces] > row[n+1][spaces]
          //row[n+1][spaces] => child(row[n][spaces])
          //next row
          //if row[n+2][spaces] = row[n+1][spaces]
          //row[n+2][spaces] => child(row[n][spaces])
          //else if row[n+2][spaces] > row[n+1][spaces]
          //row[n+2][spaces] => child(row[n+1][spaces])

          /*code
          let post = elements.current_post,
          rows_post = [];
               
          rows_post = post.childNodes;
          for(let i=0; i < rows_post.length; i++){
               rows_post[i];
          }
          */
     },
     echo_data() {
          let count_rows = 0,
               count_tags = 0,
               count_words = 0,
               count_points = 0,
               count_words_arr = [],
               count_tags_arr = [],
               rows_arr = [],
               content = elements.current_post.textContent;

          let patterns1 = {
               words: /[^\s]*[\p{L}\p{P}_0-9]/gu,
          }

          //get not empty rows
          rows_arr = elements.current_post.childNodes;
          if (rows_arr != null) {
               for (let j = 0; j < rows_arr.length; j++) {
                    let text_characters_arr = rows_arr[j].textContent.match(/[^\s]*[\p{L}\p{P}_0-9]/gu);
                    if (text_characters_arr != null)
                         count_rows += 1;
               }
          }

          //get count words
          count_words_arr = content.match(patterns1.words);
          if (count_words_arr != null)
               count_words = count_words_arr.length;

          //get count tags
          count_tags_arr = content.match(patterns.pattern_tag);
          if (count_tags_arr != null)
               count_tags = count_tags_arr.length;
          //sigmoid(count_tags)

          let counters = {
               words: count_words,
               rows: count_rows,
               tags: count_tags,
          }

          //let points = (normalizing_tag_f(count_tags) * normalizing_rows_f(count_rows) / normalizing_words_f(count_words);

          function normalizing_tag_f(count_tags) {
               sigmoid(count_tags)
          }

          function normalizing_rows_f(count_rows) {
               sigmoid(count_tags)
          }

          function normalizing_words_f(count_words) {
               //let count_words_index = 0.0001*(count_words**2) - (0.02*count_words) + 1.0001;
               //after extreme other function
               //count_words = 0,001*(count_words**2) - (0,02*count_words) + 7,99;
               //sigmoid(count_words)
               sigmoid(count_words)
          }


          //check structurization
          if (count_rows * 3 > count_words) {
               count_points = (count_tags * count_rows) / (2 * count_words);
          } else {
               count_points = (count_tags * count_rows) / count_words;
          }

          //math
          function sigmoid(z) {
               return 10 / (1 + Math.exp(-z));
          }
          function echo_points(count_points) {
               let hard_index = 10;
               let result = sigmoid(count_points / hard_index);
               return result;
          }
          count_points = echo_points(count_points);
          count_points = Math.floor(count_points * 10) / 10;

          let post_low_panel = elements.current_post.parentNode.parentNode.querySelector(".post_low_panel")
          let count_rows_node = post_low_panel.querySelector(".count_rows"),
               count_words_node = post_low_panel.querySelector(".count_words"),
               count_tags_node = post_low_panel.querySelector(".count_tags"),
               count_points_node = post_low_panel.querySelector(".count_points");

          count_rows_node.textContent = "R: " + count_rows;
          count_words_node.textContent = "W: " + count_words;
          count_tags_node.textContent = "#: " + count_tags;
          count_points_node.textContent = "points: " + count_points;
          //make vertical lines 
     },
}
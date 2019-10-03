/*\
title: gsebd-simple-list
type: application/javascript
module-type: macro

Write a simple list filter by a list of tags and with a + button in the header to create a new item.

@tags: is a list of tags coma separated. It accept spaces

\*/

(() => {

  exports.name = "gsebd-simple-list";

  exports.params = [
      {name: "title"},
      {name: "tags"}
  ];

  exports.run = (title, tags) => {
    
    debugger
    
    tags = tags.split(",").map(s => s.trim())
    
    const tag = tags[0]
    const tagsTW = tags.reduce((r, v) => r + (r === "" ? "" : " " ) + "[[" + v + "]]", "")
    const filterTags = tags.reduce((r, v) => r + (r === "" ? "" : " +" ) + "[tag[" + v + "]]", "")
    
    return `
    <strong>    
      ${title}
      <$button class="gsd-list-new-button tc-btn-invisible">
          +
          <$action-createtiddler
              $basetitle="New ${title}"
              $savetitle="!!justCreated"
              tags="${tagsTW}"
          />
          <$action-sendmessage $message="tm-edit-tiddler" $param={{!!justCreated}}/>
      </$button>
    </strong>
    <hr/>
    <$list filter="${filterTags} +[!has[draft.of]]">
      <div class="tc-menu-list-subitem">
        <$transclude tiddler="$:/plugins/sebastianovide/gsebd/ui/lists/ListViewPrefix"/>
        <span class="list-link"><$link to={{!!title}}><$view field="title"/></$link></span>
        <$transclude tiddler="$:/plugins/sebastianovide/gsebd/ui/lists/ListViewSuffix"/>
      </div>
    </$list>`;
  };

})();
/*\
title: $:/plugins/sebastianovide/gsebd/modules/macros/simple-list.js
type: application/javascript
module-type: macro

Write a simple list filter by a list of tags and with a + button in the header to create a new item.

@tags: is a list of tags coma separated. It accept spaces

\*/

(function(){
  exports.name = "gsebd-simple-list";

  exports.params = [
      {name: "title"},
      {name: "tags"},
      {name: "excludeCurrent"}
  ];

  exports.run = function(title, tags, excludeCurrent) {
    const currentTiddler = this.getVariable("currentTiddler")
    if (!excludeCurrent) {
      tags += "," + currentTiddler
    }
    tags = tags.split(",").map(s => s.trim())
    
    const tag = tags[0]
    const tagsTW = tags.reduce((r, v) => r + (r === "" ? "" : " " ) + "[[" + v + "]]", "")
    const filterTags = tags.reduce((r, v) => r + (r === "" ? "" : " +" ) + "[tag[" + v + "]]", "")
    const tmpNewTiddlerField = `new_${currentTiddler}_${title}`
  
    const saveWT = `<$action-createtiddler
                        $basetitle={{$/tmp!!${tmpNewTiddlerField}}}
                        $savetitle="!!justCreated"
                        tags="${tagsTW}"
                    />
                    <$action-setfield $tiddler="$/tmp" $field="${tmpNewTiddlerField}" $value=""/>`;
  
    return `
    <strong>          
      ${title}
    </strong>
    <hr/>
    <$list filter="${filterTags} +[!has[draft.of]]">
      <div class="tc-menu-list-subitem">
        <span class="list-link"><$link to={{!!title}}><$view field="title"/></$link></span>
      </div>
    </$list>
    <$keyboard key="enter" actions='${saveWT}' class="tc-menu-list-subitem">
      <span class="list-link">
        <$edit-text tiddler="$/tmp" field="${tmpNewTiddlerField}" type="text" size="40" placeholder="enter a new ${title} here"/> 
      </span>
    </$keyboard>
    `;
  };
})();
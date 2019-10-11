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
      {name: "excludeCurrent"},
      {name: "hideAddButton"},
      {name: "defaultValue", default: "ciccio"}
  ];

  exports.run = function(title, tags, excludeCurrent, hideAddButton, defaultValue) {
    const currentTiddler = this.getVariable("currentTiddler")
    if (!excludeCurrent) {
      tags += "," + currentTiddler
    }
    tags = tags.split(",").map(s => s.trim())
    
    const tag = tags[0]
    const tagsTW = tags.reduce((r, v) => r + (r === "" ? "" : " " ) + "[[" + v + "]]", "")
    const filterTags = tags.reduce((r, v) => r + (r === "" ? "" : " +" ) + "[tag[" + v + "]]", "")
    const tmpNewTiddlerField = `new_${currentTiddler}_${title}`.replace(/ /g,"_");
    const titleWT = title !== "" ? `<strong>${title}</strong><hr/>` : ""
  
    const saveActionsWT = `
    <$action-createtiddler
        $basetitle={{$/tmp!!${tmpNewTiddlerField}}}
        tags="${tagsTW}"
    />
    // <$action-deletefield $tiddler="$/tmp" $field="${tmpNewTiddlerField}"/>`;
    // <$action-setfield $tiddler="$/tmp" $field="${tmpNewTiddlerField}" $value="${defaultValue}"/>`;

    const addButtonWT = hideAddButton === "" ? `
      <$keyboard key="enter" actions="""${saveActionsWT}""">
        <$edit-text tiddler="$/tmp" field="${tmpNewTiddlerField}" type="text" size="40" placeholder="enter a new ${title} here" default="${defaultValue}"/> 
      </$keyboard>` : "";
  
    const finalWT = `
      ${titleWT}
      <<list-links filter:"${filterTags} +[!has[draft.of]]" type:"div" subtype:"div" >>
      ${addButtonWT}
    `;
        
    debugger
        
    return finalWT;
  };
})();
$(function() {
  var btn = $('#button');
  var textDiv = $('#text');
  var logDiv = $('#log');
  btn.click(function(){
    var references = [];
    var aStyle = "text-decoration: none;";
    var aFirst = $('a').first();
    if(aFirst){
      var aFirstStyle = aFirst.attr('style');
      if(aFirstStyle){
        aStyle = aFirstStyle;
      }
    }
    var pStyle = "";
    var pFirst = $('p').first();
    if(pFirst){
      var pFirstStyle = pFirst.attr('style');
      if(pFirstStyle){
        pStyle = pFirstStyle;
      }
    }
    textDiv.children().each(function(i, elem){
      var content = elem.innerHTML;
      if(content.match(/\[ref\]/g)){
        var new_content = content
          .replace(/\[ref\]/g, '<ref>')
          .replace(/\[\/ref\]/g, '</ref>');
        elem.innerHTML = new_content;
        $(elem).find('ref').each(function(i, elem){
          references.push(elem);
          var refNum = references.length;
          $(elem).replaceWith(
            '<sup><a href="#fn'+refNum+'" id="fna'+refNum
            +'" style="'+aStyle+'">['+refNum+']</a></sup>'
          );
        });
      }
    });
    var refList = $('<ol style="'+pStyle+'"></ol>');
    $(references).each(function(i, ref){
      refList.append(
        '<li id="fn'+(i+1)+'"><a href="#fna'+(i+1)
        +'" style="'+aStyle+'">^</a> '+ref.innerHTML+'</li>'
      );
    });
    var h1Style = "";
    var firstH1 = $('h1').first();
    if(firstH1){
      var styleAttr = firstH1.attr('style');
      if(styleAttr){
        h1Style = styleAttr;
      }
    }

    textDiv.append('<h1 style="'+h1Style+'">References</h1><hr>');
    textDiv.append(refList);
    alert("Done!");
  });
});

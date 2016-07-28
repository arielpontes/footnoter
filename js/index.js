$(function() {

  function loadSettings(){
    SETTINGS = {
      "medium": $("#medium")[0].checked,
      "parenthesis": $("#parenthesis")[0].checked
    };
  }

  function numToSup(num){
    var supChars = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    var str = num.toString();
    var sup = str.replace(
      /0|1|2|3|4|5|6|7|8|9/gi, function myFunction(x){return supChars[x];});
    if(SETTINGS["parenthesis"])
      return "⁽"+sup+"⁾";
    return " "+sup;
  }

  function refLink(refNum){
    if(SETTINGS["medium"]){
      var supRef = numToSup(refNum);
      return '<a href="#fn'+refNum+'">'+supRef+'</a>';
    } else {
      return '<sup><a href="#fn'+refNum+'" id="fna'+refNum
        +'" style="'+A_STYLE+'">['+refNum+']</a></sup>';
    }
  }

  function getRefList(references, ref_p_names){
    var refList = $('<ol style="'+P_STYLE+'"></ol>');
    $(references).each(function(i, ref){
      var ref_li;
      if(SETTINGS["medium"]){
        ref_li = '<li name="fn'+(i+1)+'"><a href="#'+ ref_p_names[i] +'">^ </a> '+ref.innerHTML+'</li>';
      } else {
        ref_li = '<li id="fn'+(i+1)+'"><a href="#fna'+(i+1)
        +'" style="'+A_STYLE+'">^</a> '+ref.innerHTML+'</li>';
      }
      refList.append(ref_li);
    });
    return refList;
  }

  var btn = $('#button'); // The button that triggers the conversion

  var textDiv = $('#text'); // The main body of text

  btn.click(function(){

    loadSettings();
    // Loads the settings specified by the user into the global variable SETTINGS

    var reflistElem = textDiv.find(":contains('[reflist]'):last");
    // The element under which the reference list will be added
    if(reflistElem.length == 0){
      alert(
        "Your text must include the code '[reflist]'. "
        + "This is where the reference list will be added.");
      return;
    }
    REFLIST_NAME = reflistElem.attr('name');
    reflistElem.html(reflistElem.html().replace('[reflist]', ''));

    var references = [];
    // A list to hold all references we find
    var ref_p_names = []
    // A list to hold the names of the parent paragraph of each reference

    A_STYLE = "text-decoration: none;"; // Default style to be used for the
    // superscript links that will be generated
    var aFirst = $('a').first(); // Get the first link
    if(aFirst){
      var aFirstStyle = aFirst.attr('style'); // If it has a style, use it as
      // default style for new links instead
      if(aFirstStyle){
        A_STYLE = aFirstStyle;
      }
    }
    // Same for paragraphs...
    P_STYLE = "";
    var pFirst = $('p').first();
    if(pFirst){
      var pFirstStyle = pFirst.attr('style');
      if(pFirstStyle){
        P_STYLE = pFirstStyle;
      }
    }
    // Same for h1...
    H1_STYLE = "";
    var firstH1 = $('h1').first();
    if(firstH1){
      var styleAttr = firstH1.attr('style');
      if(styleAttr){
        H1_STYLE = styleAttr;
      }
    }
    textDiv.children().each(function(i, elem){
      // For each child element (usually <p>) in the text body
      var content = elem.innerHTML;
      if(content.match(/\[ref\]/g)){
        // Replace [] with <> to take advantage of jQuery's find
        var new_content = content
          .replace(/\[ref\]/g, '<ref>')
          .replace(/\[\/ref\]/g, '</ref>');
        elem.innerHTML = new_content;
        $(elem).find('ref').each(function(i, elem){
          // Loop through the inline references
          var ref_p_name = $(elem).parent().closest('p').attr('name');
          references.push(elem);
          ref_p_names.push(ref_p_name);
          var refNum = references.length;
          $(elem).replaceWith(refLink(refNum));
        });
      }
    });
    var refList = getRefList(references, ref_p_names);
    textDiv.append(refList);
    if(SETTINGS['medium']){
      textDiv.append('<p>&nbsp;</p>');
      // This is necessary because Medium always updates the `name` attribute
      // in the last element
    }
    alert("Done! You can now copy the text and paste it back to your blog "
      + "editor. Refresh the page to use footnoter again.");
  });
});

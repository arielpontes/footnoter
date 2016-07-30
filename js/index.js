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
  var refList = $('<ol></ol>');
  $(references).each(function(i, ref){
    var ref_li = $('<li name="fn'+(i+1)+'"></li>');

    if(SETTINGS["medium"])
      ref_li.html('<a href="#'+ ref_p_names[i] +'">^</a>&nbsp;&nbsp;'+ref+'');
    else
      ref_li.html('<a href="#fna'+(i+1)+'" style="'+A_STYLE+'">^ </a> '+ref+'');

    refList.append(ref_li.get(0));
  });
  return refList;
}

function setDefaultStyles(){
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
  // Same for h1...
  H1_STYLE = "";
  var firstH1 = $('h1').first();
  if(firstH1){
    var styleAttr = firstH1.attr('style');
    if(styleAttr){
      H1_STYLE = styleAttr;
    }
  }
}

$(function() {

  var btn = $('#button'); // The button that triggers the conversion

  var textDiv = $('div.section-inner'); // The main body of text

  btn.click(function(){

    loadSettings();
    // Loads the settings specified by the user into the global variable SETTINGS

    var reflistElem = textDiv.find('> :last-child');
    // The element under which the reference list will be added
    // In principle take the last element

    while(reflistElem.is('p') && (reflistElem.html() == '&nbsp;')){
      textDiv.find('> :last-child').remove();
      reflistElem = textDiv.find('> :last-child');
    }

    if(reflistElem.is('ol')){
      // If there is already a list, take the previous element
      reflistElem = reflistElem.prev();
    }

    REFLIST_NAME = reflistElem.attr('name');

    var references = [];
    // A list to hold all references we find

    var existingRefs = $('a').filter(function(){
      $this = $(this);
      return (
        $this.attr('href').match(/^#fn\d*$/)
        && $this.html().match(/^ ⁽?[¹²³⁴⁵⁶⁷⁸⁹][⁰¹²³⁴⁵⁶⁷⁸⁹]*⁾?$/)
      );
    });
    // The ol with the existing references

    var existingRefContent = {};
    // If there are existing refecences, this will hold the name of the inline
    // anchor tags that link to these references

    var thereWereRefs = false;

    var refSelectorArray = [];

    // Save existing references
    if(existingRefs.length){
      thereWereRefs = true;
      ol = reflistElem.find('+ol');
      existingRefs.each(function(i, a){
        var href = $(a).attr('href').match(/^#fn\d*$/)[0];
        refSelectorArray.push('a[href="'+href+'"]');
        var refName = href.replace('#', '');
        var li = ol.find('li[name="'+refName+'"]');
        li.find('a:first').remove();
        existingRefContent[refName] = li.html();
      });
      ol.remove();
    }

    var ref_p_names = []
    // A list to hold the names of the parent paragraph of each reference
    if(!SETTINGS["medium"]){
      setDefaultStyles();
    }

    var content = textDiv.html();
    // Replace [] with <> to take advantage of jQuery's find
    var new_content = content
      .replace(/\[ref\]/g, '<ref>')
      .replace(/\[\/ref\]/g, '</ref>');
    textDiv.html(new_content);

    // Get all references. The existing references will be anchor tags, the
    // new ones will be ref tags.
    refSelectorArray.push('ref');
    var allRefsSelector = refSelectorArray.join(', ');
    textDiv.find(allRefsSelector).each(function(i, elem){
      // Loop through the inline references
      var $elem = $(elem);
      var ref_p_name = $elem.parent().attr('name');
      if($elem.is('a')){
        var refName = $elem.attr('href').replace('#', '');
        references.push(existingRefContent[refName].trim().replace(/&nbsp;/g, ''));
      } else {
        references.push(elem.innerHTML);
      }
      ref_p_names.push(ref_p_name);
      var refNum = references.length;
      if($elem.parent().is('sup'))
        $elem = $elem.parent()
      $elem.replaceWith(refLink(refNum));
    });
    var refList = getRefList(references, ref_p_names);
    textDiv.append(refList);
    if(SETTINGS['medium']){
      if(!refList.next('p').length){
        textDiv.append('<p>&nbsp;</p>');
      }
      // This is necessary because Medium always updates the `name` attribute
      // in the last element
    }
    alert("Done! You can now copy the text and paste it back to your blog "
      + "editor. Refresh the page to use footnoter again.");
  });
});

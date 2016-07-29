function numToSup(num){
  var supChars = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  var str = num.toString();
  var sup = str.replace(
    /0|1|2|3|4|5|6|7|8|9/gi, function myFunction(x){return supChars[x];});
  return " "+sup;
}

function refLink(refNum){
  var supRef = numToSup(refNum);
  return '<a href="#fn'+refNum+'">'+supRef+'</a>';
}

function getRefList(references, ref_p_names){
  var refList = $('<ol></ol>');
  $(references).each(function(i, ref){
    var ref_li = $('<li name="fn'+(i+1)+'"></li>');
    ref_li.html('<a href="#'+ ref_p_names[i] +'">^ </a> '+ref+'');
    refList.append(ref_li.get(0));
  });
  return refList;
}

function main(){
  var textDiv = $('div.section-inner').clone(); // The main body of text

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
    return $(this).attr('href').match(/^#fn\d{1}$/);
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
      var href = $(a).attr('href');
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
  var content = textDiv.html(
    textDiv.html().replace(/\[ref\]/g, '<ref>').replace(/\[\/ref\]/g, '</ref>')
    // Replace [] with <> to take advantage of jQuery's find
  );

  // Get all references. The existing references will be anchor tags, the
  // new ones will be ref tags.
  refSelectorArray.push('ref');
  var allRefsSelector = refSelectorArray.join(', ');
  textDiv.find(allRefsSelector).each(function(i, elem){
    // Loop through the inline references
    var $elem = $(elem);
    var ref_p_name = $elem.parent().closest('p').attr('name');
    if($elem.is('a')){
      var refName = $elem.attr('href').replace('#', '');
      references.push(existingRefContent[refName].trim());
    } else {
      references.push(elem.innerHTML);
    }
    ref_p_names.push(ref_p_name);
    var refNum = references.length;
    $elem.replaceWith(refLink(refNum));
  });
  var refList = getRefList(references, ref_p_names);
  textDiv.append(refList);
  if(!refList.next('p').length){
    textDiv.append('<p>&nbsp;</p>');
    // This is necessary because Medium always updates the `name` attribute
    // in the last element
  }
  var newWindow = window.open();
  newWindow.document.write(
    '<html><head><title>Done!</title>'
    +'<style>body{padding: 0 20px 0 20px;font-family: Helvetica, sans-serif;'
    +'font-weight: 100;color: #262626;}div.section-inner{display: inline-block;'
    +'margin: 10px 0 0 0;border: 1px solid #dddddd;padding: 20px;width: 722px;}'
    +'p.message{width:722px;}</style></head><body><h1>Done!</h1>'
    +'<p class="message">Now just copy the resulting text below and paste it '
    +'back to your Medium post. Nevermind if it looks ugly, it should look '
    +'good again once you paste it into the Medium editor ;)</p>'
    +'<div class="section-inner" contenteditable="true" style="border:1px solid #dddddd;padding:10px;">'
    +textDiv.html()+'</div></body></html>'
  );
  // Done!
}
main();

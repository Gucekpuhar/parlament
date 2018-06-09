function loadXMLDoc(pot)
{
  if (window.XMLHttpRequest)
  {
    xhttp=new XMLHttpRequest();
  }
  else
  {
    xhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhttp.open("GET", pot, false);
  xhttp.send();
  return xhttp.responseXML;
}

function dodajStat(gID, gIME)
{
  //console.log(gID);
  for(var i=0; i < stat.length; i++)
  {
    if(stat[i].govorecID == gID)
    {
      stat[i].stBesed++;
      return;
    }
  }

  var el = {govorecID:gID, govorecIME:gIME, stBesed:1};
  stat.push(el);
}

function dodajLemoOsebe(id_osebe, ime_osebe, novaLema)
{
  if(novaLema.length <= 3)
  {
    return;
  }
  for(var j=0; j < neupostevaneBesede.length; j++)
  {
    if(novaLema == neupostevaneBesede[j])
    {
      //console.log("NEUPOSTEVANA BESEDA: " + neupostevaneBesede[j]);
      return;
    }
  }

  for(var i=0; i < slovarLemOsebe.length; i++)
  {
    if(slovarLemOsebe[i].lema == novaLema && slovarLemOsebe[i].ime == ime_osebe)
    {
      slovarLemOsebe[i].pojavitev++;
      return;
    }
  }

  var el = {ime: ime_osebe, lema:novaLema, pojavitev:1}
  slovarLemOsebe.push(el);
}


function dodajLemo(novaLema)
{
  if(novaLema.length <= 3)
  {
    return;
  }
  for(var j=0; j < neupostevaneBesede.length; j++)
  {
    if(novaLema == neupostevaneBesede[j])
    {
      //console.log("NEUPOSTEVANA BESEDA: " + neupostevaneBesede[j]);
      return;
    }
  }

  for(var i=0; i < slovarLem.length; i++)
  {
    if(slovarLem[i].lema == novaLema)
    {
      slovarLem[i].pojavitev++;
      return;
    }
  }
  var el = {lema:novaLema, pojavitev:1}
  slovarLem.push(el);
}

function parsajXML0(xml)
{
  var desc = xml.getElementsByTagName('teiCorpus')[0].getElementsByTagName('teiHeader')[0].getElementsByTagName('profileDesc')[0];
  var listPerson = desc.getElementsByTagName('particDesc')[0];

  var osebe1 = listPerson.getElementsByTagName('listPerson')[1].getElementsByTagName('person');
  var osebe2 = listPerson.getElementsByTagName('listPerson')[2];

  for(var i=0; i < osebe1.length; i++)
  {
    var id = osebe1[i].attributes.getNamedItem('xml:id').value;
    var spol = osebe1[i].getElementsByTagName('sex')[0].attributes.getNamedItem('value').value;

    //console.log(id);
    //console.log(spol);

    var oseba = {oseba_id:id, oseba_spol:spol};
    seznamOseb.push(oseba);
  }

  for(var i=0; i < osebe2.length; i++)
  {
    var id = osebe2[i].attributes.getNamedItem('xml:id').value;
    var spol = osebe2[i].getElementsByTagName('sex')[0].attributes.getNamedItem('value').value;

    //console.log(id);
    //console.log(spol);

    var oseba = {oseba_id:id, oseba_spol:spol};
    seznamOseb.push(oseba);
  }

  //console.log(seznamOseb);

}

function dodajStatGovor(ime)
{
  for(var i=0; i < statGovor.length; i++)
  {
    var el = statGovor[i];
    if(el.govorec == ime)
    {
      el.stGov++;
      return;
    }
  }

  var el = {govorec:ime, stGov:1};
  statGovor.push(el);
}

function parsajXML(xml)
{
  var text = xml.getElementsByTagName('TEI')[0].getElementsByTagName('text')[0];
  var textDiv = text.getElementsByTagName('div');
  var body = text.getElementsByTagName('body')[0];
  var bodyDiv = body.getElementsByTagName('div');

  for(var i=0; i < textDiv.length; i++)
  {
    var tip = textDiv[i].attributes.getNamedItem("type").value;
    if(tip == "contents")
    {
      var list = textDiv[i].getElementsByTagName("list")[0];
      var items = list.getElementsByTagName("item");

      for(var j=0; j < items.length; j++)
      {
        var naslovTeme = items[j].getElementsByTagName("title")[0].firstChild.nodeValue;
        //console.log(naslovTeme);
      }
    }
  }

  for(var i = 0; i < bodyDiv.length; i++)
  {
    var tip = bodyDiv[i].attributes.getNamedItem("type").value;
    if(tip == "sp")
    {
      var govorec_ime = "";
      var govorec_ID = "";
      var govor = "";

      for(var j = 0; j < bodyDiv[i].childNodes.length; j++)
      {
          var childNode = bodyDiv[i].childNodes[j];

          switch(childNode.nodeName)
          {
            case "note":
              var tip = childNode.attributes.getNamedItem("type").value;
              if(tip == "speaker")
              {
                govorec_ime = childNode.firstChild.nodeValue;
                dodajStatGovor(govorec_ime);
                //console.log(govorec);
              }
              break;

            case "u":
              govorec_ID = childNode.attributes.getNamedItem("who").value;
              govor += getContent(childNode, govorec_ID, govorec_ime);
              //console.log(besedilo);
              break;

            case "vocal":
              var vocal = childNode.getElementsByTagName("desc")[0].firstChild.nodeValue;
              seznamVocal.push(vocal);
              //console.log("VOCAL: " + vocal);
              break;
        }
      }
      var el = {govorec:govorec_ime, govorecID:govorec_ID,vsebina:govor};
      //console.log(el);
      potekSeje.push(el);
    }
  }

  slovarLem.sort(function(a, b)
  {
    return parseFloat(b.pojavitev) - parseFloat(a.pojavitev);
  });

  slovarLemOsebe.sort(function(a, b)
  {
    return parseFloat(b.pojavitev) - parseFloat(a.pojavitev);
  });

  stat.sort(function(a, b)
  {
    return parseFloat(b.stBesed) - parseFloat(a.stBesed);
  });

  statGovor.sort(function(a, b)
  {
    return parseFloat(b.stGov) - parseFloat(a.stGov);
  });

  seja.potek = potekSeje;

  //console.log(slovarLem);
  //console.log(slovarLemOsebe);
  //console.log(stat);
  //console.log(potekSeje);
  //console.log(seznamVocal);
  //console.log(statGovor);

  var tmp_m = 0;
  var tmp_z = 0;
  for(var i=0; i < stat.length; i++)
  {
    for(var j=0; j < seznamOseb.length; j++)
    {
      var tmpID1 = stat[i].govorecID;
      var tmpID2 = "#" + seznamOseb[j].oseba_id;
      if(tmpID1 == tmpID2)
      {
        //console.log(tmpID1 + " == " + tmpID2 + ", " + seznamOseb[j].oseba_spol);
        if(seznamOseb[j].oseba_spol == "M")
        {
          tmp_m++;
        }
        if(seznamOseb[j].oseba_spol == "F")
        {
          tmp_z++;
        }
      }
    }
  }
  seja.m = tmp_m;
  seja.z = tmp_z;
  //console.log("M: " + tmp_m);
  //console.log("Z: " + tmp_z);
}

function getContent(child, govorecID, govorecIME)
{
        var lema = "";
        var result = "";
        for (var k = 0; k < child.childNodes.length; k++) {
            var node = child.childNodes[k];
            if (node.nodeType !== 1)
                continue;
            switch (node.nodeName) {
                case "s":
                    result += getContent(node, govorecID, govorecIME);
                    break;
                case "c":
                    result += node.firstChild.nodeValue;
                    break;
                case "w":
                    lema = node.attributes.getNamedItem("lemma").value;
                    dodajLemo(lema);
                    dodajLemoOsebe(govorecID, govorecIME, lema);
                    dodajStat(govorecID, govorecIME);
                    result += node.firstChild.nodeValue;
                    //console.log(node.childNodes[0].nodeValue);
                    break;
                case "pc":
                    result += node.firstChild.nodeValue;
                    break;
                default:
                    // NE PROCESIRAMO
                    break;
            }
        }
        //console.log(result);
        return result;
}

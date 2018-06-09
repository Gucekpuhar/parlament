var tortniDiagram1;
var stolpcniDiagram1;
var canvas1;
var canvas2;
var canvas3;
var canvas4;

function start()
{
  canvas1 = document.getElementById("tortniDiagram1").getContext('2d');
  canvas2 = document.getElementById("stolpcniDiagram1").getContext('2d');
  canvas3 = document.getElementById("stolpcniDiagram2").getContext('2d');
  canvas4 = document.getElementById("stolpcniDiagram3").getContext('2d');

  var xml0 = loadXMLDoc(datoteka0);
  parsajXML0(xml0);

  posodobiSeznamSej();
}

function posodobiSeznamSej()
{
  var iZD = document.getElementById("zborZD").checked;
  var iOB = document.getElementById("zborOB").checked;
  var iDP = document.getElementById("zborDP").checked;

  if(iZD)
  {
    poti = podatki_ZbZdruDel;
  }
  else if(iOB)
  {
    poti = podatki_ZbObc;

  }
  else if(iDP)
  {
    poti = podatki_DruzPolZb;
  }

  var s = document.getElementById('SeznamSej');
  s.innerHTML = "";
  var el0 = document.createElement('option');
  el0.innerHTML = "Izberi sejo";
  el0.value = "Izberi sejo";
  s.appendChild(el0);

  for(var i = 0; i < poti.length; i++)
  {
      var el = document.createElement('option');
      el.innerHTML = poti[i];
      el.value = poti[i];
      s.appendChild(el);
  }
}

function sejaIzbrana()
{
  slovarLem = [];
  stat = [];
  statGovor = [];
  potekSeje = [];
  seznamVocal = [];

  var s = document.getElementById('SeznamSej');
  indeks = s.selectedIndex - 1;

  var pot = "./SlovParl-ana/Sk-11-ana/" + poti[indeks];
  console.log(pot);
  var xml = loadXMLDoc(pot);
  var razcep = pot.split("/");
  var imeDatoteke = razcep[3];
  var datoteka = imeDatoteke.split("-");
  var leto = parseInt(datoteka[0]);
  var mesec = parseInt(datoteka[1]);
  var dan = parseInt(datoteka[2]);
  var stSeje = parseInt(datoteka[4].substr(1, 3));
  var del = parseInt(datoteka[5].split(".")[0]);

  seja.leto = leto,
  seja.mesec = mesec,
  seja.dan = dan,
  seja.stSeje = stSeje,
  seja.del = del
  seja.m = 0;
  seja.z = 0;

  parsajXML(xml);
  //console.log(seja);
  document.getElementById("izpis").innerHTML = "Izbrali ste sejo " + seja.dan + ". " + seja.mesec + ". " + seja.leto + ". Številka seje: " + seja.stSeje + ", del: " + seja.del;
  IZRIS();

}

function IZRIS()
{
  if(tortniDiagram1 != null && stolpcniDiagram1 != null && stolpcniDiagram2 != null && stolpcniDiagram3 != null)
  {
    tortniDiagram1.destroy();
    stolpcniDiagram1.destroy();
    stolpcniDiagram2.destroy();
    stolpcniDiagram3.destroy();
  }

  tortniDiagram1 = new Chart(canvas1,
    {
      type: 'pie',
  			data: {
  				datasets: [{
  					data: [
  						seja.m,
              seja.z
  					],
  					backgroundColor: [
              'rgba(0, 93, 164, 0.8)',
              'rgba(237, 28, 36, 0.8)'
  					],
  					label: 'Dataset 1'
  				}],
  				labels: [
  					'Moški',
  					'Ženske',
  				]
  			},
  			options: {
  				responsive: true,
          legend: {
            onClick: (e) => e.stopPropagation()
          }

        }
  });

// ####################################################################################


  var podatkiLeme = [];
  var podatkiPojavitev = [];
  for(var i=0; i < 10; i++)
  {
    if(i >= slovarLem.length)
    {
      break;
    }
    podatkiLeme.push(slovarLem[i].lema);
    podatkiPojavitev.push(slovarLem[i].pojavitev);
  }

  stolpcniDiagram1 = new Chart(canvas2,
    {
      type: 'bar',
    data: {
      labels: podatkiLeme,
      datasets: [
        {
          label: "Najpogostejše besede",
          backgroundColor: "rgba(237, 28, 36, 0.8)",
          data: podatkiPojavitev
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: "Najpogostejše besede - Vseh govorcev"
      },
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }],
        xAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
      }
    }
  });


// ####################################################################################


  var podatkiStatIme = [];
  var podatkiStatSTB = [];
  for(var i=0; i < 10; i++)
  {
    if(i >= stat.length)
    {
      break;
    }
    podatkiStatIme.push(stat[i].govorecIME);
    podatkiStatSTB.push(stat[i].stBesed);
  }

  stolpcniDiagram2 = new Chart(canvas3,
    {
      type: 'horizontalBar',
    data: {
      labels: podatkiStatIme,
      datasets: [
        {
          label: "Število besed govorcev",
          backgroundColor: "rgba(0, 93, 164, 0.8)",
          data: podatkiStatSTB
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: "Število besed govorcev"
      },
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }],
        xAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
      }
    }
  });

  var klik1 = document.getElementById("stolpcniDiagram2");  //get canvas element
      klik1.addEventListener('click', function(evt)
      {
        //console.log("KLIK!!");
        var activePoints = stolpcniDiagram2.getElementsAtEvent(evt);
        //console.log(activePoints[0]._model.label);
        var izbranoIme = activePoints[0]._model.label;

        var st = 0;
        var podatkiLemeOseba = [];
        var podatkiPojavitevOseba = [];

        for(var i=0; i < slovarLemOsebe.length; i++)
        {
          if(st >= 10 || i >= slovarLemOsebe.length)
          {
            break;
          }

          if(slovarLemOsebe[i].ime == izbranoIme)
          {
            podatkiLemeOseba.push(slovarLemOsebe[i].lema);
            podatkiPojavitevOseba.push(slovarLemOsebe[i].pojavitev);
            st++;
          }
        }
//console.log(podatkiLemeOseba);
//console.log(podatkiPojavitevOseba);

stolpcniDiagram1.destroy();
stolpcniDiagram1 = new Chart(canvas2,
  {
    type: 'bar',
  data: {
    labels: podatkiLemeOseba,
    datasets: [
      {
        label: "Najpogostejše besede",
        backgroundColor: "rgba(237, 28, 36, 0.8)",
        data: podatkiPojavitevOseba
      }
    ]
  },
  options: {
    legend: { display: false },
    title: {
      display: true,
      text: "Najpogostejše besede - " + izbranoIme
    },
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true
          }
      }],
      xAxes: [{
          ticks: {
              beginAtZero: true
          }
      }]
    }
  }
});
}, false);
// ####################################################################################

  var podatkiStatGovorIme = [];
  var podatkiStatGovorSTB = [];
  for(var i=0; i < 10; i++)
  {
    if(i >= statGovor.length)
    {
      break;
    }

    podatkiStatGovorIme.push(statGovor[i].govorec);
    podatkiStatGovorSTB.push(statGovor[i].stGov);
  }

//console.log(statGovor);

  stolpcniDiagram3 = new Chart(canvas4,
    {
      type: 'horizontalBar',
    data: {
      labels: podatkiStatGovorIme,
      datasets: [
        {
          label: "Število govorov",
          backgroundColor: "rgba(255,221,0,0.8)",
          data: podatkiStatGovorSTB
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: "Število govorov"
      },
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }],
        xAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
      }
    }
  });

  var klik2 = document.getElementById("stolpcniDiagram3");  //get canvas element
      klik2.addEventListener('click', function(evt)
      {
        console.log("KLIK2!!");
        var activePoints = stolpcniDiagram3.getElementsAtEvent(evt);
        //console.log(activePoints[0]._model.label);
        var izbranoIme = activePoints[0]._model.label;

        var st = 0;
        var podatkiLemeOseba = [];
        var podatkiPojavitevOseba = [];

        for(var i=0; i < slovarLemOsebe.length; i++)
        {
          if(st >= 10 || i >= slovarLemOsebe.length)
          {
            break;
          }

          if(slovarLemOsebe[i].ime == izbranoIme)
          {
            podatkiLemeOseba.push(slovarLemOsebe[i].lema);
            podatkiPojavitevOseba.push(slovarLemOsebe[i].pojavitev);
            st++;
          }
        }
  //console.log(podatkiLemeOseba);
  //console.log(podatkiPojavitevOseba);

  stolpcniDiagram1.destroy();
  stolpcniDiagram1 = new Chart(canvas2,
    {
      type: 'bar',
    data: {
      labels: podatkiLemeOseba,
      datasets: [
        {
          label: "Najpogostejše besede",
          backgroundColor: "rgba(237, 28, 36, 0.8)",
          data: podatkiPojavitevOseba
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: "Najpogostejše besede - " + izbranoIme
      },
      scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }],
        xAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
      }
    }
  });
}, false);
}

function izbira_zborZD()
{
  posodobiSeznamSej();
}

function izbira_zborDP()
{
  posodobiSeznamSej();
}

function izbira_zborOB()
{
  posodobiSeznamSej();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
} 
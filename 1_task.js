function sortByMonth(arr) { // Pagrindiniame kode butu nauodjama tuo atveju, jeigu reiktu surikiuoti menesius
  var months = ["January", "February", "March", "April", "May", "June",
  	        "July", "August", "September", "October", "November", "December"];
  arr.sort(function(a, b){
      return months.indexOf(a.split(" ")[0]) - months.indexOf(b.split(" ")[0]);
  });
}

function myFunction_final(){

  // Uzduotis atliekama su prielada, jog Tickets ir Chats visada bus isrikiuoti mazejimo tvarka (latest report turi buti Spreadsheets pradzioje)
  // Chat turi eiti pirmas, o Ticket antras -> Feb Chat, Feb Ticket, Jan Chat, Jan Ticket.

  var activeSpreadsheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Jv5KHpO2pGEpOupxWLvv8oQwnCpRMDHr1oo_TdFQhBc/edit#gid=1769300063"); // Spreadsheet linkas
  var yourNewSheet = activeSpreadsheet.getSheetByName("Test");   // Sukuriamas kintamasis naujam Sheet'ui

    if (yourNewSheet !== null) {                                    // Sheet'as istrinamas jeigu jis jau yra sukurtas
    activeSpreadsheet.deleteSheet(yourNewSheet);
  }

  yourNewSheet = activeSpreadsheet.insertSheet();                // Sukuriamas naujas Sheet'as, kuriam priskiriamas vardas "Test"
  yourNewSheet.setName("Test");

  var sheetList = [];                                             // Kintamasis visiems Sheet'u pavadinimams
  activeSpreadsheet.getSheets().forEach(function(val){
    if(val.getName().includes('Chats') || val.getName().includes('Tickets')){
      sheetList.push(val.getName()); // I sheetList sudedami visi Sheet'u pavadinimai
    }

  });

  //sortByMonth(sheetList); Butu naudojama tuo atveju, jeigu pridedamu menesiu sheetsai susimaisytu.
  //su sortByMonth problema atsirastu tuo atveju, jeigu zmogus dirbo December - January - February, nes December turi auksciausia value is siu menesiu.


//  for( var j = 4; j < sheetList.length; j++ ) { Butu naudojama tuo atveju, jeigu reiktui surikiuoti sheetsus.
//    if(sheetList[j].includes('Chats') || sheetList[j].includes('Tickets'))
//    {
//      activeSpreadsheet.setActiveSheet(activeSpreadsheet.getSheetByName(sheetList[j]));
//      activeSpreadsheet.moveActiveSheet(j + 1);
//    }
//  }


  yourNewSheet = activeSpreadsheet.getSheetByName("Test");


  // Gaunami Chatu bei Ticket row,column duomenys
  var ticketRows = activeSpreadsheet.getSheetByName(sheetList[1]).getMaxRows();
  var ticketColumns = activeSpreadsheet.getSheetByName(sheetList[1]).getMaxColumns();
  var chatRows = activeSpreadsheet.getSheetByName(sheetList[0]).getMaxRows();
  var chatColumns = activeSpreadsheet.getSheetByName(sheetList[0]).getMaxColumns();
  var columnWidths = SpreadsheetApp.CopyPasteType.PASTE_COLUMN_WIDTHS; // Si kodo dalis reikalinga tam, jog nebutu prarastas formatavimas kopijuojant

  var copySheet;   // Kintamasis, laikantis lentele, kuri bus kopijuojama
  var source;      // Kintamasis, laikantis lenteles range
  var destination; // Vieta, i kuria bus kopijuojama

  // Tikrinama, kuris is Chat ar Ticket turi ilgesne eilute. Pagal tai bus lygiuojama.
  if(ticketRows>=chatRows){
  	chatRows = ticketRows
  }
  else{
    ticketRows = chatRows;
  }

  var Rows = 0;
  var Columns = 0;
  var extraCol = 0;
  var row = -1; //Kintamasis naudojamas ciklui
  // Kiekvienos iteracijos metu galima butu nuskaityti kiekvieno ticketo ir chato eilutes ir stulpelius atskirai.
  // Taip galima butu lygiuoti skirtingus ticketus ir chatus. Dabar lygiuojama tik pagal tai, kokie buvo naujausio menesio ticketai
  // ar chatai, tikintis, kad tvarka nesikeis.
  for (var i = 0; i < sheetList.length ; i++ ) { // Su ciklu gaunami visi Sheet'sai
    // Ciklas perkopijuoja chatus, po to ticketus.
    if(i%2 === 0){
      row++; // kai praeina dvi iteracijos, keicasi eilute.
      Rows = chatRows;
      Columns = chatColumns;
      extraCol = ticketColumns + 2;
    }
    else{
      Rows = ticketRows;
      Columns = ticketColumns;
      extraCol = 1;
    }

  	copySheet = activeSpreadsheet.getSheetByName(sheetList[i]); // Ticket sheet
    source = copySheet.getDataRange();                     // Gaunamas Ticket sheet langeliu range
	destination = yourNewSheet.getRange(2+row*(Rows+2),extraCol, Rows+1, Columns+1);// Vieta, kur bus iklijuoti Ticketai (rows+1, nes reikia palikti 1 tuscia tarpa. Taip pat su columns)
	source.copyTo(destination);
	source.copyTo(destination, columnWidths, false);

    // Apacioje esancias eilutes galima keisti i:
    //yourNewSheet.getRange(1+row*(Rows+2),extraCol,1,Columns).mergeAcross().setHorizontalAlignment("center").setValue(sheetList[i]); // Reikiamose vietose sumerginami langeliai bei pridedamas tekstas.
    // Taciau tuomet atsiranda bugas ir pirmos eilutes chatu paskutinis langelis nesusimergina.

    yourNewSheet.getRange(1+row*(Rows+2),extraCol,1,1).setHorizontalAlignment("center").setValue(sheetList[i]); // Reikiamose vietose sumerginami langeliai bei pridedamas tekstas.
    yourNewSheet.getRange(1+row*(Rows+2),extraCol,1,Columns).mergeAcross();

  }
}

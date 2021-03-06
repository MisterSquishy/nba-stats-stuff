redrawTable = function (headers, data) {
  table.destroy(); //can't i just redraw the dang thing??
  $("#statstable").empty();
  createTable(headers, data);
}
createTable = function (headers, data) {
  createFooter(headers.length);
  table = $('#statstable').DataTable({
    pageLength: 100,
    columns: headers,
    data: data,
    footerCallback: footerCallback,
    order: [[0, "asc"]],
    columnDefs: [{ orderSequence: ["desc", "asc"], "targets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] }],
    fixedHeader: {header: true}
  });
}
setUpFantasyCols = function () {
  var displayResults = [];
  for (var row in filteredResults) {
    var displayHeaders = [];
    var displayRow = [];
    for (var col in filteredResults[row]) {
      if (headers[col].title === 'Name' || headers[col].title === 'Team' || headers[col].title === 'Game' || col == (headers.length - 1)) {
        displayRow.push(filteredResults[row][col]);
        if (!displayHeaders.includes(headers[col])) {displayHeaders.push(headers[col]);}
      }
      else if (scoringMap.hasOwnProperty(headers[col].title)) {
        if (isNaN(filteredResults[row][col])) {
          displayRow.push(filteredResults[row][col]);
        }
        else {
          displayRow.push(Math.round(10 * filteredResults[row][col] * scoringMap[headers[col].title])/10);
        }
        if (!displayHeaders.includes(headers[col])) {displayHeaders.push(headers[col]);}
      }
      else if (headers[col].title === 'FGA') { //hack city
        if (isNaN(filteredResults[row][col])) {
          displayRow.push(filteredResults[row][col]);
        }
        else {
          displayRow.push((parseFloat(filteredResults[row][col]) - parseFloat(filteredResults[row][col-1])) * scoringMap['FGA-FGM']);
        }
        if (!displayHeaders.includes({title:"FGMi"})) {displayHeaders.push({title:"FGMi"});}
      }
    }
    displayResults.push(displayRow);
  }
  return [displayHeaders, displayResults];
};
createFooter = function(n) {
  //create footer (surely there's a saner way to do this)
  var footerHTML = '<tfoot><tr>';
  for (var i = 0; i < n; i++) {
    footerHTML += '<td style="padding: 10px 18px 6px 10px;"/>';
  }
  $('#statstable').append(footerHTML + '</tr></tfoot>');
};
footerCallback = function (row, data, start, end, display) {
  var api = this.api(), data;

  // Remove the formatting to get integer data for summation
  var intVal = function (i) {
    return typeof i === 'string' ?
      i.replace(/[,-]/g, '') * 1 :
      typeof i === 'number' ?
      i : 0;
  };

  // Total over this page
  for (var i in data[0]) {
    if (headers[i].title.endsWith('%')) {
      num = api
        .column( i-2 )
        .data()
        .reduce(function (a, b) {
          return intVal(a) + intVal(b);
        }, 0);
      denom = api
        .column( i-1 )
        .data()
        .reduce(function (a, b) {
          return intVal(a) + intVal(b);
        }, 0);
      pageTotal = Math.round(num/denom*1000)/10;
    }
    else {
      pageTotal = Math.round(api
        .column( i )
        .data()
        .reduce(function (a, b) {
          return intVal(a) + intVal(b);
        }, 0)*10)/10;
    }

    // Update footer
    if (i === "0") {
      $(api.column( i ).footer()).html('Totals:');
    }
    // else if (parseFloat(i) === (api.columns()[0].length - 1)) {
    //   $(api.column( i ).footer()).html(pageTotal + '*');
    // }
    else {
      $(api.column( i ).footer()).html(pageTotal);
    }
  }
};
setCookie = function(cookieName, cookieValue) { //this sucks
  var today = new Date();
  var expire = new Date();

  expire.setTime(today.getTime() + 3600000*24);
  document.cookie = cookieName+"="+escape(cookieValue) + ";expires="+expire.toGMTString();
};
readCookie = function(name, fallback) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return fallback;
};
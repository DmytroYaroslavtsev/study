/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.57142857142857, "KoPercent": 1.4285714285714286};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9489795918367347, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Post new user"], "isController": false}, {"data": [1.0, 500, 1500, "Get posts using dates from CSV"], "isController": false}, {"data": [1.0, 500, 1500, "Post Login.aspx"], "isController": false}, {"data": [1.0, 500, 1500, "Edit POST"], "isController": false}, {"data": [0.625, 500, 1500, "Edit Random Post"], "isController": true}, {"data": [1.0, 500, 1500, "Get POST"], "isController": false}, {"data": [1.0, 500, 1500, "Get HomePage"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "Refresh post after Saveing"], "isController": false}, {"data": [1.0, 500, 1500, "Choose Predefined Date"], "isController": true}, {"data": [1.0, 500, 1500, "Get Home page"], "isController": true}, {"data": [1.0, 500, 1500, "Open Random Post"], "isController": true}, {"data": [1.0, 500, 1500, "Open post"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Number from Current Page"], "isController": false}, {"data": [1.0, 500, 1500, "Get POST content XML"], "isController": false}, {"data": [0.0, 500, 1500, "Add new user"], "isController": true}, {"data": [1.0, 500, 1500, "Get API user roles"], "isController": false}, {"data": [1.0, 500, 1500, "Get Login.aspx"], "isController": false}, {"data": [1.0, 500, 1500, "Get EDIT Page"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 70, 1, 1.4285714285714286, 127.28571428571433, 3, 3168, 26.0, 240.6, 316.5500000000001, 3168.0, 0.23870661933455414, 5.713753305660416, 0.3167957867002902], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Post new user", 1, 1, 100.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 78.90625, 294.7265625], "isController": false}, {"data": ["Get posts using dates from CSV", 8, 0, 0.0, 31.0, 20, 37, 32.5, 37.0, 37.0, 37.0, 0.031006429958412626, 0.9600486994740534, 0.036759576142102464], "isController": false}, {"data": ["Post Login.aspx", 3, 0, 0.0, 53.666666666666664, 37, 64, 60.0, 64.0, 64.0, 64.0, 0.15642924183960788, 5.810287178016477, 0.3646960384294504], "isController": false}, {"data": ["Edit POST", 6, 0, 0.0, 251.66666666666666, 219, 338, 239.0, 338.0, 338.0, 338.0, 0.031198976673565103, 0.009170792947991306, 0.05950351703464127], "isController": false}, {"data": ["Edit Random Post", 8, 0, 0.0, 949.5, 270, 3168, 488.5, 3168.0, 3168.0, 3168.0, 0.0301305783941155, 1.7908053362195915, 0.17806171401561516], "isController": true}, {"data": ["Get POST", 6, 0, 0.0, 143.16666666666666, 26, 299, 125.5, 299.0, 299.0, 299.0, 0.0328981637341609, 1.6506000402317127, 0.041154831780722774], "isController": false}, {"data": ["Get HomePage", 2, 0, 0.0, 44.0, 34, 54, 44.0, 54.0, 54.0, 54.0, 0.39541320680110714, 11.989051996836695, 0.16565650948991698], "isController": false}, {"data": ["Login", 3, 0, 0.0, 62.0, 41, 76, 69.0, 76.0, 76.0, 76.0, 0.23659305993690852, 9.864975601340694, 0.6534805057176656], "isController": true}, {"data": ["Refresh post after Saveing", 6, 0, 0.0, 4.0, 3, 7, 3.5, 7.0, 7.0, 7.0, 0.03125292996218395, 0.028536610854142577, 0.04089738881770166], "isController": false}, {"data": ["Choose Predefined Date", 8, 0, 0.0, 31.0, 20, 37, 32.5, 37.0, 37.0, 37.0, 0.030767574053704796, 0.9526530302214495, 0.03647640127070081], "isController": true}, {"data": ["Get Home page", 2, 0, 0.0, 44.0, 34, 54, 44.0, 54.0, 54.0, 54.0, 0.3956478733926805, 11.99616716122651, 0.16575482195845698], "isController": true}, {"data": ["Open Random Post", 8, 0, 0.0, 68.375, 38, 202, 50.5, 202.0, 202.0, 202.0, 0.030541578541486918, 1.761859855671953, 0.036596207881254346], "isController": true}, {"data": ["Open post", 8, 0, 0.0, 68.375, 38, 202, 50.5, 202.0, 202.0, 202.0, 0.0303449845430235, 1.7505188873821762, 0.03636064065848617], "isController": false}, {"data": ["Get Random Number from Current Page", 8, 0, 0.0, 25.625, 20, 43, 22.0, 43.0, 43.0, 43.0, 0.030541928341000626, 1.002593230429305, 0.036656279229579855], "isController": false}, {"data": ["Get POST content XML", 8, 0, 0.0, 4.625, 3, 8, 3.5, 8.0, 8.0, 8.0, 0.030790073280374405, 0.038859688433324095, 0.040291697456739946], "isController": false}, {"data": ["Add new user", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 95.81163194444446, 300.78125], "isController": true}, {"data": ["Get API user roles", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 116.943359375, 308.349609375], "isController": false}, {"data": ["Get Login.aspx", 3, 0, 0.0, 8.333333333333334, 4, 16, 5.0, 16.0, 16.0, 16.0, 0.2381330369899984, 1.0841564633275123, 0.10255534112557549], "isController": false}, {"data": ["Get EDIT Page", 8, 0, 0.0, 12.125, 3, 21, 12.0, 21.0, 21.0, 21.0, 0.03078794036375952, 0.6046041921629298, 0.03851499180271088], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 1, 100.0, 1.4285714285714286], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 70, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Post new user", 1, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

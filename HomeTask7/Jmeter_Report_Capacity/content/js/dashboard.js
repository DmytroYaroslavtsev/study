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

    var data = {"OkPercent": 78.42929602586256, "KoPercent": 21.57070397413745};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.04557740970784449, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6, 500, 1500, "Post new user"], "isController": false}, {"data": [0.05, 500, 1500, "Get posts using dates from CSV"], "isController": false}, {"data": [0.056140350877192984, 500, 1500, "Get posts using random date less 10"], "isController": false}, {"data": [0.4, 500, 1500, "Get API packages"], "isController": false}, {"data": [0.25, 500, 1500, "Get users (with data of deleted user)"], "isController": false}, {"data": [1.0, 500, 1500, "Post Login.aspx"], "isController": false}, {"data": [0.4, 500, 1500, "Get Admin"], "isController": false}, {"data": [0.07074864934396707, 500, 1500, "Open First Post"], "isController": true}, {"data": [0.036883356385431075, 500, 1500, "Choose Predefined Date"], "isController": true}, {"data": [0.02861035422343324, 500, 1500, "Open Large calendar"], "isController": true}, {"data": [0.04863013698630137, 500, 1500, "Get large calendar"], "isController": false}, {"data": [0.4, 500, 1500, "Get Admin Dashboard html"], "isController": false}, {"data": [0.05, 500, 1500, "Go to users data in Admin page"], "isController": true}, {"data": [0.04294478527607362, 500, 1500, "Get Home page"], "isController": true}, {"data": [0.4, 500, 1500, "Get Admin Data"], "isController": false}, {"data": [0.25, 500, 1500, "Delete user"], "isController": true}, {"data": [0.007398273736128237, 500, 1500, "Open Random Post"], "isController": true}, {"data": [0.028955532574974147, 500, 1500, "Get Random Number from Current Page"], "isController": false}, {"data": [0.4, 500, 1500, "Get API Customfield"], "isController": false}, {"data": [0.04380841121495327, 500, 1500, "Open Random Date"], "isController": true}, {"data": [0.6, 500, 1500, "Add new user"], "isController": true}, {"data": [1.0, 500, 1500, "Get Login.aspx"], "isController": false}, {"data": [0.4, 500, 1500, "Get API Dashboard"], "isController": false}, {"data": [0.3, 500, 1500, "Get API Newsfeed"], "isController": false}, {"data": [0.015159171298635674, 500, 1500, "Search by Name"], "isController": true}, {"data": [0.375, 500, 1500, "Put Delete User"], "isController": false}, {"data": [0.06989748369058714, 500, 1500, "Get HomePage"], "isController": false}, {"data": [0.5, 500, 1500, "Get API users (refresh)"], "isController": false}, {"data": [0.009846827133479213, 500, 1500, "Post Comment"], "isController": false}, {"data": [0.04984472049689441, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.04614185502727981, 500, 1500, "Get contact"], "isController": false}, {"data": [0.35, 500, 1500, "Get API Setup"], "isController": false}, {"data": [1.0, 500, 1500, "Login Admin"], "isController": true}, {"data": [0.012430238457635717, 500, 1500, "Use search"], "isController": false}, {"data": [1.0, 500, 1500, "Login Editor"], "isController": true}, {"data": [0.6, 500, 1500, "Get API user roles"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "Get users"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 17941, 3870, 21.57070397413745, 42149.887798896605, 0, 383161, 30442.0, 79704.00000000003, 119271.49999999999, 153630.55999999994, 9.605716421218776, 208.21689110015598, 4.735233418714951], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Post new user", 5, 1, 20.0, 5287.8, 7, 21007, 70.0, 21007.0, 21007.0, 21007.0, 0.003792021283857062, 0.0038920062200525117, 0.004505987791208275], "isController": false}, {"data": ["Get posts using dates from CSV", 2160, 389, 18.00925925925926, 37225.26388888893, 12, 147414, 28763.5, 71342.90000000001, 81275.59999999993, 129718.35999999991, 1.1752741898361636, 27.362395277832643, 0.4372506283091994], "isController": false}, {"data": ["Get posts using random date less 10", 855, 188, 21.98830409356725, 36543.00818713451, 12, 140243, 24691.0, 72352.4, 83554.59999999992, 128088.11999999997, 0.47474073880764006, 10.764323848594074, 0.16472341077067357], "isController": false}, {"data": ["Get API packages", 10, 0, 0.0, 17054.6, 4, 78041, 5386.5, 75166.40000000001, 78041.0, 78041.0, 0.006414882527463716, 0.0324264794322829, 0.007930899687274477], "isController": false}, {"data": ["Get users (with data of deleted user)", 4, 0, 0.0, 10988.0, 3, 29229, 7360.0, 29229.0, 29229.0, 29229.0, 0.0050212839674168884, 0.04462764197994248, 0.0064482308761261795], "isController": false}, {"data": ["Post Login.aspx", 3, 0, 0.0, 50.0, 39, 60, 51.0, 60.0, 60.0, 60.0, 0.09781864423359092, 3.6830693758355344, 0.22696982294825394], "isController": false}, {"data": ["Get Admin", 10, 1, 10.0, 13290.6, 3, 61650, 4805.5, 58339.90000000001, 61650.0, 61650.0, 0.005718743066024032, 0.04730640321227517, 0.006137037846927549], "isController": false}, {"data": ["Open First Post", 3887, 1008, 25.932595832261384, 37260.664780036044, 0, 164235, 28527.0, 72904.8, 84124.4, 135987.84, 2.095331943273483, 67.87503142559927, 0.7654804515084557], "isController": true}, {"data": ["Choose Predefined Date", 2169, 599, 27.616413093591518, 79552.75610880603, 0, 347640, 74161.0, 151117.0, 177855.0, 227676.80000000013, 1.1713174648348248, 53.85972270955863, 1.2730934735908144], "isController": true}, {"data": ["Open Large calendar", 734, 212, 28.88283378746594, 74550.26158038143, 0, 250370, 66264.5, 135958.0, 149183.75, 221021.0499999999, 0.40681588422042103, 17.76556429717429, 0.38988813550432977], "isController": true}, {"data": ["Get large calendar", 730, 157, 21.506849315068493, 36722.92054794522, 26, 144078, 25925.0, 72634.7, 89652.19999999998, 129608.80999999998, 0.4076208344501027, 10.146808172693033, 0.1452754503023653], "isController": false}, {"data": ["Get Admin Dashboard html", 10, 1, 10.0, 11120.599999999999, 4, 44913, 5023.5, 42522.20000000001, 44913.0, 44913.0, 0.006752910335531856, 0.05586120857342743, 0.007211237746000082], "isController": false}, {"data": ["Don\'t Open Post", 0, 0, NaN, NaN, 9223372036854775807, -9223372036854775808, NaN, NaN, NaN, NaN, 0.0, 0.0, 0.0], "isController": true}, {"data": ["Go to users data in Admin page", 10, 3, 30.0, 127983.8, 1303, 453861, 37246.5, 446791.0, 453861.0, 453861.0, 0.005422781756894524, 4.375744276796134, 0.056047944609809164], "isController": true}, {"data": ["Get Home page", 1141, 286, 25.06573181419807, 85812.34881682732, 43, 312477, 85643.0, 155817.8, 183216.69999999998, 228590.39999999997, 0.6244756128864183, 32.937166045281046, 0.708103256919447], "isController": true}, {"data": ["Get Admin Data", 10, 1, 10.0, 13651.800000000001, 3, 51924, 3253.5, 50271.50000000001, 51924.0, 51924.0, 0.005605286906610316, 0.005562590385251369, 0.006123666467211874], "isController": false}, {"data": ["Delete user", 4, 0, 0.0, 37300.0, 15, 102490, 23347.5, 102490.0, 102490.0, 102490.0, 0.004740875592313144, 0.0822268759348414, 0.020750590239011244], "isController": true}, {"data": ["Open Random Post", 811, 247, 30.456226880394574, 40418.533908754594, 0, 154356, 31573.0, 72752.60000000002, 84742.0, 135965.48, 0.47428342850191935, 15.116187469589718, 0.18895174370799578], "isController": true}, {"data": ["Get Random Number from Current Page", 967, 263, 27.19751809720786, 36641.85211995864, 20, 150596, 26166.0, 69978.40000000001, 83197.79999999999, 130448.91999999995, 0.5475623283913049, 12.205578855699489, 0.20545089237937067], "isController": false}, {"data": ["Get API Customfield", 10, 0, 0.0, 16644.0, 3, 58090, 2649.0, 57641.0, 58090.0, 58090.0, 0.005441809641145305, 0.0018530849822923515, 0.006818204853114674], "isController": false}, {"data": ["Open Random Date", 856, 260, 30.373831775700936, 80580.71728971954, 0, 329696, 76852.0, 151148.0, 175035.9, 226348.15999999995, 0.47358570213783, 21.5365170589747, 0.4828159725353488], "isController": true}, {"data": ["Add new user", 5, 1, 20.0, 25516.8, 16, 102400, 79.0, 102400.0, 102400.0, 102400.0, 0.003618471282726359, 0.03781373163716286, 0.012407398796785929], "isController": true}, {"data": ["Get Login.aspx", 3, 0, 0.0, 7.666666666666666, 3, 16, 4.0, 16.0, 16.0, 16.0, 0.09396435618755285, 0.42779475443981585, 0.040467071365928524], "isController": false}, {"data": ["Get API Dashboard", 10, 1, 10.0, 15835.4, 58, 59639, 6888.0, 58361.0, 59639.0, 59639.0, 0.006178541308182552, 4.772289015364487, 0.007560265878078844], "isController": false}, {"data": ["Get API Newsfeed", 10, 1, 10.0, 13490.5, 409, 66155, 5866.5, 61716.400000000016, 66155.0, 66155.0, 0.005788249621737887, 0.004176696919435669, 0.0064405582216876455], "isController": false}, {"data": ["Search by Name", 1979, 521, 26.32642748863062, 74489.71248105107, 0, 244773, 67374.0, 137509.0, 153680.0, 197117.80000000028, 1.0683968324922204, 71.64959666197522, 1.0667983199878206], "isController": true}, {"data": ["Put Delete User", 4, 0, 0.0, 10031.25, 8, 26228, 6944.5, 26228.0, 26228.0, 26228.0, 0.0052124938264526246, 0.0015321881267209374, 0.009106593218284907], "isController": false}, {"data": ["Get HomePage", 2146, 284, 13.233923578751165, 38478.52656104383, 18, 146704, 30778.5, 72197.4, 85071.54999999994, 129211.31000000001, 1.153904266811057, 31.52701108381238, 0.4317311171847317], "isController": false}, {"data": ["Get API users (refresh)", 9, 0, 0.0, 15260.555555555555, 4, 60389, 960.0, 60389.0, 60389.0, 60389.0, 0.006305660591513002, 0.05265938170195385, 0.008163969420348647], "isController": false}, {"data": ["Post Comment", 1371, 401, 29.24872355944566, 42698.47921225373, 18, 176641, 34045.0, 80698.4, 94159.39999999988, 135463.47999999998, 0.7727034475762137, 1.9325429335466582, 1.426791557291931], "isController": false}, {"data": ["Open Contacts", 6440, 1241, 19.270186335403725, 37519.66506211182, 0, 157507, 28878.0, 71871.8, 83261.9, 132599.90000000002, 3.465473338456207, 63.3765415832249, 1.2719340684280311], "isController": true}, {"data": ["Get contact", 6415, 1241, 19.345284489477788, 37415.87716289949, 11, 150223, 28823.0, 71664.80000000005, 83233.8, 128963.04000000001, 3.45872818008894, 63.499691207248446, 1.274405617023089], "isController": false}, {"data": ["Get API Setup", 10, 0, 0.0, 19126.300000000003, 392, 88614, 4356.5, 85136.90000000001, 88614.0, 88614.0, 0.005858083246877788, 0.002032022626260733, 0.007459902884695934], "isController": false}, {"data": ["Login Admin", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 608.2827919407895, 36.145662006578945], "isController": true}, {"data": ["Use search", 1971, 374, 18.975139523084728, 40721.07661085747, 702, 152897, 32081.0, 76584.8, 89861.2, 135837.52, 1.0640997262818055, 36.37879972952108, 0.41118307283090477], "isController": false}, {"data": ["Login Editor", 2, 0, 0.0, 48.5, 43, 54, 48.5, 54.0, 54.0, 54.0, 0.07007217433956976, 2.816367655560227, 0.19290376900707729], "isController": true}, {"data": ["Get API user roles", 5, 1, 20.0, 5784.6, 3, 21004, 32.0, 21004.0, 21004.0, 21004.0, 0.003844961907962378, 0.003544574258902817, 0.0037938960076222524], "isController": false}, {"data": ["Get users", 9, 1, 11.11111111111111, 8140.0, 6, 32794, 242.0, 32794.0, 32794.0, 32794.0, 0.00677727684498184, 0.07922486613936942, 0.007553839816802676], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 2618, 67.6485788113695, 14.592274678111588], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 15, 0.3875968992248062, 0.0836073797447188], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException", 102, 2.635658914728682, 0.5685301822640878], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 349, 9.018087855297157, 1.9452650353937908], "isController": false}, {"data": ["500\/Internal Server Error", 15, 0.3875968992248062, 0.0836073797447188], "isController": false}, {"data": ["404", 106, 2.739018087855297, 0.5908254835293462], "isController": false}, {"data": ["404\/Not Found", 203, 5.245478036175711, 1.1314865392118612], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException", 8, 0.20671834625322996, 0.04459060253051669], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 454, 11.731266149870802, 2.530516693606822], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 17941, 3870, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 2618, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 454, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 349, "404\/Not Found", 203, "404", 106], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Post new user", 5, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Get posts using dates from CSV", 2160, 389, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 333, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 53, "500\/Internal Server Error", 3, null, null, null, null], "isController": false}, {"data": ["Get posts using random date less 10", 855, 188, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 162, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 25, "500\/Internal Server Error", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get Admin", 10, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Open First Post", 203, 130, "404", 92, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 27, "Non HTTP response code: java.net.SocketTimeoutException", 8, "Non HTTP response code: java.net.SocketException", 3, null, null], "isController": false}, {"data": ["Choose Predefined Date", 189, 106, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 85, "Non HTTP response code: java.net.SocketTimeoutException", 20, "Non HTTP response code: java.net.SocketException", 1, null, null, null, null], "isController": false}, {"data": ["Open Large calendar", 81, 37, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 29, "Non HTTP response code: java.net.SocketTimeoutException", 7, "Non HTTP response code: java.net.SocketException", 1, null, null, null, null], "isController": false}, {"data": ["Get large calendar", 730, 157, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 131, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 25, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 1, null, null, null, null], "isController": false}, {"data": ["Get Admin Dashboard html", 10, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Go to users data in Admin page", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Get Home page", 117, 54, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 44, "Non HTTP response code: java.net.SocketTimeoutException", 10, null, null, null, null, null, null], "isController": false}, {"data": ["Get Admin Data", 10, 1, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Random Post", 33, 23, "404", 14, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 8, "Non HTTP response code: java.net.SocketTimeoutException", 1, null, null, null, null], "isController": false}, {"data": ["Get Random Number from Current Page", 967, 263, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 177, "404\/Not Found", 59, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 26, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 1, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Open Random Date", 96, 54, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 41, "Non HTTP response code: java.net.SocketTimeoutException", 13, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Get API Dashboard", 10, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Get API Newsfeed", 10, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Search by Name", 174, 88, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 64, "Non HTTP response code: java.net.SocketTimeoutException", 23, "Non HTTP response code: java.net.SocketException", 1, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Get HomePage", 2146, 284, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 237, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 45, "500\/Internal Server Error", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Post Comment", 1371, 401, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 203, "404\/Not Found", 144, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 53, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 1, null, null], "isController": false}, {"data": ["Open Contacts", 310, 72, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 50, "Non HTTP response code: java.net.SocketTimeoutException", 20, "Non HTTP response code: java.net.SocketException", 2, null, null, null, null], "isController": false}, {"data": ["Get contact", 6415, 1241, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 1059, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 164, "Non HTTP response code: java.net.SocketException\/Non HTTP response message: Connection reset", 12, "500\/Internal Server Error", 6, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Use search", 1971, 374, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 310, "Non HTTP response code: java.net.SocketTimeoutException\/Non HTTP response message: Read timed out", 62, "500\/Internal Server Error", 2, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Get API user roles", 5, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Get users", 9, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to 192.168.56.112:8081 [\\\/192.168.56.112] failed: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

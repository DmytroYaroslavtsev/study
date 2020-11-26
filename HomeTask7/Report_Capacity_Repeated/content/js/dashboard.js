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

    var data = {"OkPercent": 99.93638676844783, "KoPercent": 0.06361323155216285};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7867456497593484, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Post new user"], "isController": false}, {"data": [0.8627450980392157, 500, 1500, "Get posts using random date less 10"], "isController": false}, {"data": [1.0, 500, 1500, "Post Login.aspx"], "isController": false}, {"data": [1.0, 500, 1500, "Get users-0"], "isController": false}, {"data": [0.6122881355932204, 500, 1500, "Choose Predefined Date"], "isController": true}, {"data": [0.7048192771084337, 500, 1500, "Open Large calendar"], "isController": true}, {"data": [0.9096385542168675, 500, 1500, "Get large calendar"], "isController": false}, {"data": [1.0, 500, 1500, "Don\'t Open Post"], "isController": true}, {"data": [0.34615384615384615, 500, 1500, "Go to users data in Admin page"], "isController": true}, {"data": [0.75, 500, 1500, "Delete user"], "isController": true}, {"data": [0.7362637362637363, 500, 1500, "Open Random Post"], "isController": true}, {"data": [0.8114754098360656, 500, 1500, "Get Random Number from Current Page"], "isController": false}, {"data": [1.0, 500, 1500, "Get API Customfield"], "isController": false}, {"data": [1.0, 500, 1500, "Open post-0"], "isController": false}, {"data": [0.7421052631578947, 500, 1500, "Open Random Date"], "isController": true}, {"data": [1.0, 500, 1500, "Get API Dashboard"], "isController": false}, {"data": [0.25, 500, 1500, "Edit Random Post"], "isController": true}, {"data": [0.8461538461538461, 500, 1500, "Get API users (refresh)"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "Get API Setup"], "isController": false}, {"data": [0.7362637362637363, 500, 1500, "Open post"], "isController": false}, {"data": [0.4657534246575342, 500, 1500, "Use search"], "isController": false}, {"data": [1.0, 500, 1500, "Login Editor"], "isController": true}, {"data": [0.7860082304526749, 500, 1500, "Get posts using dates from CSV"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "Get API packages"], "isController": false}, {"data": [0.75, 500, 1500, "Get users (with data of deleted user)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Admin"], "isController": false}, {"data": [0.8101415094339622, 500, 1500, "Open First Post"], "isController": true}, {"data": [0.8101415094339622, 500, 1500, "Open first post"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "Get Admin Dashboard html"], "isController": false}, {"data": [0.6926229508196722, 500, 1500, "Get Home page"], "isController": true}, {"data": [1.0, 500, 1500, "Get Admin Data"], "isController": false}, {"data": [1.0, 500, 1500, "Add new user"], "isController": true}, {"data": [1.0, 500, 1500, "Get Login.aspx"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "Get API Newsfeed"], "isController": false}, {"data": [0.4135514018691589, 500, 1500, "Search by Name"], "isController": true}, {"data": [0.25, 500, 1500, "Edit POST"], "isController": false}, {"data": [0.75, 500, 1500, "Put Delete User"], "isController": false}, {"data": [0.75, 500, 1500, "Get POST"], "isController": false}, {"data": [0.854978354978355, 500, 1500, "Get HomePage"], "isController": false}, {"data": [1.0, 500, 1500, "Open first post-0"], "isController": false}, {"data": [0.875, 500, 1500, "Refresh post after Saveing"], "isController": false}, {"data": [0.5752688172043011, 500, 1500, "Post Comment"], "isController": false}, {"data": [0.8082758620689655, 500, 1500, "Open Contacts"], "isController": true}, {"data": [0.8082758620689655, 500, 1500, "Get contact"], "isController": false}, {"data": [1.0, 500, 1500, "Login Admin"], "isController": true}, {"data": [0.7, 500, 1500, "Get POST content XML"], "isController": false}, {"data": [1.0, 500, 1500, "Post Login.aspx-1"], "isController": false}, {"data": [1.0, 500, 1500, "Get API user roles"], "isController": false}, {"data": [1.0, 500, 1500, "Post Login.aspx-0"], "isController": false}, {"data": [1.0, 500, 1500, "Get users"], "isController": false}, {"data": [0.6, 500, 1500, "Get EDIT Page"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3144, 2, 0.06361323155216285, 905.8804071246824, 0, 21245, 30.0, 3654.0, 5861.5, 9496.65000000006, 10.246549448400605, 284.2084240613848, 5.546261376228267], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Post new user", 5, 0, 0.0, 65.2, 6, 213, 15.0, 213.0, 213.0, 213.0, 0.022163710027748966, 0.013267924069345816, 0.03292090132051385], "isController": false}, {"data": ["Get posts using random date less 10", 102, 0, 0.0, 545.0392156862746, 9, 5775, 25.5, 2385.3, 5324.649999999998, 5770.83, 0.41184165899510633, 12.028388306119481, 0.18292507510053782], "isController": false}, {"data": ["Post Login.aspx", 3, 0, 0.0, 46.666666666666664, 32, 55, 53.0, 55.0, 55.0, 55.0, 0.35194744251525106, 13.252218918641484, 0.8175445800093853], "isController": false}, {"data": ["Get users-0", 13, 0, 0.0, 0.07692307692307693, 0, 1, 0.0, 0.5999999999999996, 1.0, 1.0, 0.046110246051366814, 0.17728128779710073, 0.0], "isController": false}, {"data": ["Choose Predefined Date", 236, 1, 0.423728813559322, 2780.983050847457, 17, 25836, 202.0, 9533.400000000003, 12861.249999999996, 16497.62, 0.821306643187505, 51.273091228766965, 1.1961086845782278], "isController": true}, {"data": ["Open Large calendar", 83, 0, 0.0, 1353.3132530120483, 41, 8567, 165.0, 4784.000000000001, 7046.5999999999985, 8567.0, 0.35823884603930267, 22.393384153973646, 0.41581956982204593], "isController": true}, {"data": ["Get large calendar", 83, 0, 0.0, 348.5783132530122, 17, 5849, 38.0, 1015.0000000000014, 2856.999999999999, 5849.0, 0.3561024373710201, 10.969624301202597, 0.16045810245667777], "isController": false}, {"data": ["Don\'t Open Post", 235, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 1.0862029119482322, 0.0, 0.0], "isController": true}, {"data": ["Go to users data in Admin page", 13, 0, 0.0, 2093.9999999999995, 903, 8924, 1008.0, 7214.399999999998, 8924.0, 8924.0, 0.045591319412783805, 41.20361042151805, 0.5046656304139692], "isController": true}, {"data": ["Delete user", 8, 0, 0.0, 3251.7500000000005, 14, 14740, 22.0, 14740.0, 14740.0, 14740.0, 0.031817621394168626, 0.49592687838310806, 0.13926423739127322], "isController": true}, {"data": ["Open Random Post", 91, 1, 1.098901098901099, 1435.999999999999, 17, 10244, 46.0, 6568.8, 8029.999999999994, 10244.0, 0.3334151604972649, 17.66068088940326, 0.18626867101999392], "isController": true}, {"data": ["Get Random Number from Current Page", 122, 0, 0.0, 824.8278688524593, 10, 7065, 30.0, 3713.7000000000003, 5582.699999999999, 6977.369999999998, 0.4428569354300068, 13.249592648756371, 0.22463305491426], "isController": false}, {"data": ["Get API Customfield", 13, 0, 0.0, 4.153846153846153, 3, 10, 4.0, 7.599999999999998, 10.0, 10.0, 0.046255937661228624, 0.01576496312868046, 0.05795543751890266], "isController": false}, {"data": ["Open post-0", 91, 0, 0.0, 0.10989010989010992, 0, 1, 0.0, 1.0, 1.0, 1.0, 0.33938001611122715, 0.8844006341464778, 0.0], "isController": false}, {"data": ["Open Random Date", 95, 0, 0.0, 1177.3578947368417, 35, 10451, 70.0, 5180.200000000001, 5983.199999999992, 10451.0, 0.3889441599010854, 25.982841261397088, 0.5087140124298365], "isController": true}, {"data": ["Get API Dashboard", 13, 0, 0.0, 130.46153846153845, 48, 408, 82.0, 388.4, 408.0, 408.0, 0.045885483950669576, 39.849995141212574, 0.05614698377948142], "isController": false}, {"data": ["Edit Random Post", 4, 1, 25.0, 6230.75, 370, 15810, 4371.5, 15810.0, 15810.0, 15810.0, 0.028394369396548665, 3.3268759250353157, 0.1997865542013019], "isController": true}, {"data": ["Get API users (refresh)", 13, 0, 0.0, 873.4615384615385, 4, 6221, 5.0, 5747.799999999999, 6221.0, 6221.0, 0.04601037002955282, 0.2997828609159603, 0.06029183404413456], "isController": false}, {"data": ["Get API Setup", 13, 0, 0.0, 520.0, 394, 910, 415.0, 842.0, 910.0, 910.0, 0.04581497797356828, 0.01592786343612335, 0.05834251101321586], "isController": false}, {"data": ["Open post", 91, 1, 1.098901098901099, 1435.999999999999, 17, 10244, 46.0, 6568.8, 8029.999999999994, 10244.0, 0.33930409103789766, 17.97261188529098, 0.1895586331917702], "isController": false}, {"data": ["Use search", 219, 0, 0.0, 2395.6986301369852, 110, 9642, 1209.0, 6431.0, 8015.0, 9085.8, 0.7997253910985817, 29.098844397951023, 0.3838044253753962], "isController": false}, {"data": ["Login Editor", 2, 0, 0.0, 49.0, 39, 59, 49.0, 59.0, 59.0, 59.0, 8.23045267489712, 330.8175797325103, 22.649819958847736], "isController": true}, {"data": ["Get posts using dates from CSV", 243, 0, 0.0, 920.0041152263376, 9, 7935, 33.0, 4298.2, 5434.599999999996, 7145.64, 0.8610426056637469, 25.18561040678948, 0.40448572635853386], "isController": false}, {"data": ["Get API packages", 13, 0, 0.0, 410.3076923076923, 3, 4984, 4.0, 3085.1999999999985, 4984.0, 4984.0, 0.04589277330029053, 0.23201844470273839, 0.05673852636539826], "isController": false}, {"data": ["Get users (with data of deleted user)", 8, 0, 0.0, 1212.25, 3, 6380, 3.5, 6380.0, 6380.0, 6380.0, 0.03194556475765296, 0.28386005247059015, 0.041023845367493796], "isController": false}, {"data": ["Get Admin", 13, 0, 0.0, 3.692307692307692, 3, 6, 3.0, 6.0, 6.0, 6.0, 0.04625511474826543, 0.4110110245063156, 0.05515380381604697], "isController": false}, {"data": ["Open First Post", 424, 0, 0.0, 782.698113207547, 14, 7876, 43.0, 3379.5, 5182.25, 7312.75, 1.5069233175058996, 72.84411145945879, 0.671197562000654], "isController": true}, {"data": ["Open first post", 424, 0, 0.0, 782.698113207547, 14, 7876, 43.0, 3379.5, 5182.25, 7312.75, 1.5252676413030966, 73.73086923393073, 0.6793682932291067], "isController": false}, {"data": ["Get Admin Dashboard html", 13, 0, 0.0, 489.0, 3, 2981, 4.0, 2666.6, 2981.0, 2981.0, 0.04589277330029053, 0.4077913518157652, 0.05445285113266895], "isController": false}, {"data": ["Get Home page", 122, 0, 0.0, 2399.1311475409834, 42, 26267, 169.0, 9393.600000000002, 13928.099999999997, 25345.159999999985, 0.47665745910318075, 30.392548448372526, 0.7510498917753146], "isController": true}, {"data": ["Get Admin Data", 13, 0, 0.0, 4.153846153846154, 3, 7, 4.0, 6.199999999999999, 7.0, 7.0, 0.046255608492529715, 0.03771819637818585, 0.05614816538692816], "isController": false}, {"data": ["Add new user", 5, 0, 0.0, 82.0, 14, 259, 23.0, 259.0, 259.0, 259.0, 0.022628837285082616, 0.17550607980285757, 0.0898965918708165], "isController": true}, {"data": ["Get Login.aspx", 3, 0, 0.0, 5.666666666666667, 4, 7, 6.0, 7.0, 7.0, 7.0, 0.4805382027871216, 2.187762794329649, 0.2069505345987506], "isController": false}, {"data": ["Get API Newsfeed", 13, 0, 0.0, 512.2307692307693, 407, 1078, 436.0, 891.1999999999998, 1078.0, 1078.0, 0.045849718729610106, 0.022835309132911277, 0.05668529678875623], "isController": false}, {"data": ["Search by Name", 214, 0, 0.0, 4276.528037383179, 125, 22540, 1440.5, 11964.5, 14898.75, 19579.349999999995, 0.7926219489610726, 68.5081073604578, 1.112548439294048], "isController": true}, {"data": ["Edit POST", 4, 1, 25.0, 3723.5, 317, 8282, 3147.5, 8282.0, 8282.0, 8282.0, 0.025332649351800837, 0.008083440601270432, 0.04856249089607914], "isController": false}, {"data": ["Put Delete User", 8, 0, 0.0, 628.6249999999999, 6, 3322, 14.5, 3322.0, 3322.0, 3322.0, 0.03194492694594519, 0.00939006153391553, 0.05581003350224213], "isController": false}, {"data": ["Get POST", 4, 0, 0.0, 604.25, 32, 2272, 56.5, 2272.0, 2272.0, 2272.0, 0.02375550830848903, 2.259214956542267, 0.029717584124193796], "isController": false}, {"data": ["Get HomePage", 231, 0, 0.0, 607.9004329004332, 16, 8183, 37.0, 2550.6000000000013, 4457.799999999984, 7415.560000000009, 0.7550746902886282, 23.431578634205536, 0.32460895364135584], "isController": false}, {"data": ["Open first post-0", 424, 0, 0.0, 0.09669811320754713, 0, 1, 0.0, 0.0, 1.0, 1.0, 1.5254816600406556, 3.777546620059724, 0.0], "isController": false}, {"data": ["Refresh post after Saveing", 4, 0, 0.0, 202.75, 3, 797, 5.5, 797.0, 797.0, 797.0, 0.02525603303489121, 0.02331990159618129, 0.03304988697925217], "isController": false}, {"data": ["Post Comment", 186, 0, 0.0, 3483.247311827956, 15, 21245, 132.0, 11724.200000000008, 15074.050000000005, 21040.55, 0.8596783139212424, 2.2202488762941393, 1.954912385607321], "isController": false}, {"data": ["Open Contacts", 725, 0, 0.0, 794.813793103448, 9, 7489, 26.0, 3523.5999999999985, 5187.799999999997, 7072.9800000000005, 2.443471549565399, 53.923480687306416, 1.1164696775712903], "isController": true}, {"data": ["Get contact", 725, 0, 0.0, 794.813793103448, 9, 7489, 26.0, 3523.5999999999985, 5187.799999999997, 7072.9800000000005, 2.494821095518957, 55.05668244282559, 1.1399322838882735], "isController": false}, {"data": ["Login Admin", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 783.5838188559322, 46.72603283898305], "isController": true}, {"data": ["Get POST content XML", 5, 0, 0.0, 631.8, 4, 1818, 6.0, 1818.0, 1818.0, 1818.0, 0.024024254887734655, 0.027613816409046574, 0.031437989794496524], "isController": false}, {"data": ["Post Login.aspx-1", 3, 0, 0.0, 36.333333333333336, 26, 42, 41.0, 42.0, 42.0, 42.0, 0.35252643948296125, 12.830952555816687, 0.4351498237367803], "isController": false}, {"data": ["Get API user roles", 5, 0, 0.0, 3.2, 2, 5, 3.0, 5.0, 5.0, 5.0, 0.022630783296671463, 0.010586079296001593, 0.027912772757515684], "isController": false}, {"data": ["Post Login.aspx-0", 3, 0, 0.0, 9.0, 6, 11, 10.0, 11.0, 11.0, 11.0, 0.3530242409978819, 0.44369355289479884, 0.3842815956695693], "isController": false}, {"data": ["Get users", 13, 0, 0.0, 20.000000000000004, 4, 164, 6.0, 110.39999999999995, 164.0, 164.0, 0.046105503578496396, 0.48247650060114483, 0.057811979096473995], "isController": false}, {"data": ["Get EDIT Page", 5, 0, 0.0, 2470.6, 5, 6893, 79.0, 6893.0, 6893.0, 6893.0, 0.024234551685028378, 0.4758870754712408, 0.030316856160665383], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 2, 100.0, 0.06361323155216285], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3144, 2, "500\/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Open post", 91, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Edit POST", 4, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

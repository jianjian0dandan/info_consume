
function network_request_callback(data) {
    $("#network_progress").removeClass("active");
    $("#network_progress").removeClass("progress-striped");
    networkUpdated = 1;

    if (data) {
        $("#loading_network_data").text("计算完成!");
        $("#sigma-graph").show();

        sigma.parsers.gexf(data, {
            container: 'sigma-graph',
            settings: {
                drawEdges: true,
                edgeColor: 'default',
                defaultEdgeColor: '#ccc',
                defaultNodeColor: '#11c897'
            }
        },
            function(s) {
              // Initialize the Filter API
              filter = new sigma.plugins.filter(s);

              updatePane(s.graph, filter);

              function applyMinDegreeFilter(e) {
                var v = e.target.value;
                _.$('min-degree-val').textContent = v;

                filter
                  .undo('min-degree')
                  .nodesBy(function(n) {
                    return this.degree(n.id) >= v;
                  }, 'min-degree')
                  .apply();
              }

              function applyCategoryFilter(e) {
                var c = e.target[e.target.selectedIndex].value;
                filter
                  .undo('node-category')
                  .nodesBy(function(n) {
                    return !c.length || n.attributes.acategory === c;
                  }, 'node-category')
                  .apply();
              }

              function applyMinPagerankFilter(e) {
                var v = e.target.value;
                _.$('min-pagerank-val').textContent = v;

                filter
                  .undo('min-pagerank')
                  .nodesBy(function(n) {
                    return n.attributes.pagerank * 100000000 >= v;
                  }, 'min-pagerank')
                  .apply();
              }

              function applyZhibiaoCategoryFilter(e){
                var v = e.target.value;
                _.$('min-degree').value = 0;
                _.$('min-degree-val').textContent = '0';
                _.$('min-pagerank').value = 0;
                _.$('min-pagerank-val').textContent = '0';
                _.$('node-category').selectedIndex = 0;
                filter.undo().apply();
                if(v == 'degree'){
                    $('#min_degree_container').removeClass('hidden');
                    $('#min_pagerank_container').addClass('hidden');
                }
                if(v == 'pagerank'){
                    $('#min_pagerank_container').removeClass('hidden');
                    $('#min_degree_container').addClass('hidden');
                }
              }

              _.$('min-degree').addEventListener("input", applyMinDegreeFilter);  // for Chrome and FF
              _.$('min-degree').addEventListener("change", applyMinDegreeFilter); // for IE10+, that sucks
              _.$('min-pagerank').addEventListener("input", applyMinPagerankFilter);  // for Chrome and FF
              _.$('min-pagerank').addEventListener("change", applyMinPagerankFilter); // for IE10+, that sucks
              _.$('zhibiao-category').addEventListener("change", applyZhibiaoCategoryFilter);
              _.$('node-category').addEventListener("change", applyCategoryFilter);

              // Start the ForceAtlas2 algorithm:
              var linLogMode = ($('#linLogModeInput').val() === 'true');
              var outboundAttractionDistribution = ($('#outboundAttractionInput').val() === 'true');
              var adjustSizes = ($('#adjustSizesInput').val() === 'true');
              var strongGravityMode = ($('#strongGravityInput').val() === 'true');
              var edgeWeightInfluence = parseInt($('#edgeWeightInfluence_input').val());
              var scalingRatio = parseInt($('#scalingRatio_input').val());
              var gravity = parseInt($('#gravity_input').val());
              var slowDown = parseInt($('#slowdown_input').val());
              var config = {
                  'linLogMode': linLogMode,
                  'outboundAttractionDistribution': outboundAttractionDistribution,
                  'adjustSizes': adjustSizes,
                  'edgeWeightInfluence': edgeWeightInfluence,
                  'scalingRatio': scalingRatio,
                  'strongGravityMode': strongGravityMode,
                  'gravity': gravity,
                  'slowDown': slowDown
              }
              s.startForceAtlas2(config);

              $("#refresh_layout").click(function(){
                  //s.stopForceAtlas2();
                  var linLogMode = ($('#linLogModeInput').val() === 'true');
                  var outboundAttractionDistribution = ($('#outboundAttractionInput').val() === 'true');
                  var adjustSizes = ($('#adjustSizesInput').val() === 'true');
                  var strongGravityMode = ($('#strongGravityInput').val() === 'true');
                  var edgeWeightInfluence = parseInt($('#edgeWeightInfluence_input').val());
                  var scalingRatio = parseInt($('#scalingRatio_input').val());
                  var gravity = parseInt($('#gravity_input').val());
                  var slowDown = parseInt($('#slowdown_input').val());
                  var config = {
                      'linLogMode': linLogMode,
                      'outboundAttractionDistribution': outboundAttractionDistribution,
                      'adjustSizes': adjustSizes,
                      'edgeWeightInfluence': edgeWeightInfluence,
                      'scalingRatio': scalingRatio,
                      'strongGravityMode': strongGravityMode,
                      'gravity': gravity,
                      'slowDown': slowDown
                  }
                  s.configForceAtlas2(config);
                  s.startForceAtlas2();
                  s.refresh();
              });

              $("#pause_layout").click(function(){
                  s.stopForceAtlas2();
              });

              $("#stop_layout").click(function(){
                  s.killForceAtlas2();
              });

                // We first need to save the original colors of our
                // nodes and edges, like this:
                s.graph.nodes().forEach(function(n) {
                  n.originalColor = n.color;
                });
                s.graph.edges().forEach(function(e) {
                  e.originalColor = e.color;
                });

                // When a node is clicked, we check for each node
                // if it is a neighbor of the clicked one. If not,
                // we set its color as grey, and else, it takes its
                // original color.
                // We do the same for the edges, and we only keep
                // edges that have both extremities colored.
                s.bind('clickNode', function(e) {
                  var nodeId = e.data.node.id,
                      neighbor_graph = s.graph.neighborhood(nodeId),
                      toKeep = {},
                      node = e.data.node;

                  var node_uid = node.label;
                  var node_name = node.attributes.name;
                  var node_location = node.attributes.location;
                  var node_pagerank = node.attributes.pagerank;
                  var node_community = node.attributes.acategory;
                  var node_text = node.attributes.text;
                  var node_reposts_count = node.attributes.reposts_count;
                  var node_comments_count = node.attributes.comments_count;
                  var node_timestamp = node.attributes.timestamp;
                  var node_rank_pr = node.attributes.rank_pr;
                  var graph_type = 1; 

                  $('#nickname').html('<a target="_blank" href="http://weibo.com/u/' + node_uid + '">' + node_name + '</a>');
                  $('#location').html(node_location);
                  $('#pagerank').html(new Number(node_pagerank).toExponential(2) + ' ( 排名:' + node_rank_pr + ' )');
                  //$('#weibo_created_at').html(node_timestamp);
                  //$('#weibo_text').html(node_text);
                  //$('#weibo_reposts_count').html(node_reposts_count);
                  //$('#weibo_comments_count').html(node_comments_count);
                  $('#community_detail_a').html('<button onclick="network_uid_community(' + node_community +','+ node_uid +',' + graph_type +')">' + '社团' + '</button>');
                  $('#user_weibo').html('<button onclick="network_weibolist(' + node_uid + ',' + graph_type +')">' + '微博' + '</button>');
                  $('#neighbourhood_detail_a').html('<button onclick="network_uid_neighbor(' + node_uid + ',' + graph_type +')">' + '邻居' + '</button>');

                  neighbor_graph.nodes.forEach(function(n){
                      toKeep[n.id] = n; 
                  });
                  toKeep[nodeId] = e.data.node;

                  s.graph.nodes().forEach(function(n) {
                    if (toKeep[n.id])
                      n.color = n.originalColor;
                    else
                      n.color = '#eee';
                  });

                  s.graph.edges().forEach(function(e) {
                    if (toKeep[e.source] && toKeep[e.target])
                      e.color = e.originalColor;
                    else
                      e.color = '#eee';
                  });

                  // Since the data has been modified, we need to
                  // call the refresh method to make the colors
                  // update effective.
                  s.refresh();
                });

                // When the stage is clicked, we just color each
                // node and edge with its original color.
                s.bind('clickStage', function(e) {
                  s.graph.nodes().forEach(function(n) {
                    n.color = n.originalColor;
                  });

                  s.graph.edges().forEach(function(e) {
                    e.color = e.originalColor;
                  });

                  // Same as in the previous event:
                  s.refresh();
                });
        });
    }

    else {
        $("#loading_network_data").text("暂无结果!");
    }

}



function show_network() {
    networkShowed = 0;
    network_type2 = 'source_graph'
    if (!networkShowed) {
        $("#network").height(610);
        $("#main_network").css("display", "block");
        $("#network").removeClass('out');
        $("#network").addClass('in');
        networkShowed = 0;
        if (!networkUpdated){
            $.ajax({
                url: "/identify/graph/?topic=" + topic +'&start_ts=' + start_ts +'&end_ts='+end_ts+'&network_type='+network_type2,
                dataType: "xml",
                type: "GET",
                async: false,

                success: function (data) {
                    networkdata = data;
                    network_request_callback(data);
                },
                error: function(result) {
                    $("#main_network").text("暂无结果!");
                }
            })
        }
   }
 else {
          networkShowed = 0;
          $("#network").removeClass('in');
           $("#network").addClass('out');
 }
}

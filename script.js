

var app = angular.module('reviewData', ['ui.router']);

app.controller('ReviewCtrl', function($scope, $http) {

  // initial http request gets page 1 data and totalPages to loop through all pages, sorted by publishDate.
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://secure.reviewtrackers.com/api/locations/18598/reviews?api_token=274b859d23b5e2778b46&sort=publishDate&order=desc&per_page=50&page=1", false);
  xhr.send();
  console.log(xhr.status);
  console.log(xhr.statusText);
  $scope.data = angular.fromJson(xhr.response);

  // loop through remaining pages to get all reviews
  for (var i = 2; i <= $scope.data.totalPages; i++) {
    var page = new XMLHttpRequest();
    page.open("GET", "https://secure.reviewtrackers.com/api/locations/18598/reviews?api_token=274b859d23b5e2778b46&sort=publishDate&order=desc&per_page=50&page=" + i.toString(), false);
    page.send();
    var jsonPage = angular.fromJson(page.response);
    for (var review in jsonPage.reviews) {
       var obj = jsonPage.reviews[review];
       $scope.data.reviews.push(obj);
    }
  }

  console.log($scope.data);

  // calculate overall score across all sites
  $scope.overallScore = function() {
    var scoreSum = 0;
    var noRatingCounter = 0;
    for (var i = 0; i < $scope.data.totalReviews; i++) {
      if ($scope.data.reviews[i].rating != null) {
        scoreSum += $scope.data.reviews[i].rating;
      } else {
        noRatingCounter += 1;
      }
    }
    return scoreSum / ($scope.data.totalReviews - noRatingCounter);
  }

  $scope.averageRatings = function (datum) {
    var sum = 0;
    var nullCounter = 0;
    for (var i = 0; i < datum.length; i++) {
      if (datum[i].rating != null) {
        sum += datum[i].rating ;
      } else {
        nullCounter += 1;
      }
    }
    return sum / (datum.length - nullCounter);
  }

  var addMonths = function (months) {
    var date = new Date();
    date.setMonth(date.getMonth() + months);
    // var newDate = date;
    // newDate.setMonth(newDate.getMonth() + months);
    return date;
  }

  var pastSixMonthRatings = function () {
    var today = new Date();
    $scope.sixMonthsAgo = addMonths(today, -6);

  }();

  var parseReviewsByMonth = function () {
    $scope.today = new Date();
    $scope.sixAgo = addMonths(-6);
    $scope.fiveAgo = addMonths(-5);
    $scope.fourAgo = addMonths(-4);
    $scope.threeAgo = addMonths(-3);
    $scope.twoAgo = addMonths(-2);
    $scope.oneAgo = addMonths(-1);

    $scope.sixAgoObjects = [];
    $scope.fiveAgoObjects = [];
    $scope.fourAgoObjects = [];
    $scope.threeAgoObjects = [];
    $scope.twoAgoObjects = [];
    $scope.oneAgoObjects = [];

    for (var review in $scope.data.reviews) {
      var revObj = $scope.data.reviews[review];
      var revDate = new Date(revObj.publishDate);
      console.log(typeof(revDate));
      if ( revDate >= $scope.sixAgo && revDate < $scope.fiveAgo) {
        $scope.sixAgoObjects.push(revObj);
      } else if (revDate >= $scope.fiveAgo && revDate < $scope.fourAgo){
        $scope.fiveAgoObjects.push(revObj);
      } else if (revDate >= $scope.fourAgo && revDate < $scope.threeAgo){
        $scope.fourAgoObjects.push(revObj);
      } else if (revDate >= $scope.threeAgo && revDate < $scope.twoAgo){
        $scope.threeAgoObjects.push(revObj);
      } else if (revDate >= $scope.twoAgo && revDate < $scope.oneAgo){
        $scope.twoAgoObjects.push(revObj);
      } else if (revDate >= $scope.oneAgo && revDate < $scope.today){
        $scope.oneAgoObjects.push(revObj);
      }
    }
      
  }();

  console.log($scope.averageRatings($scope.sixAgoObjects));

  var monthConverter = function () {
    $scope.month = new Array();
    $scope.month[0] = "January";
    $scope.month[1] = "February";
    $scope.month[2] = "March";
    $scope.month[3] = "April";
    $scope.month[4] = "May";
    $scope.month[5] = "June";
    $scope.month[6] = "July";
    $scope.month[7] = "August";
    $scope.month[8] = "September";
    $scope.month[9] = "October";
    $scope.month[10] = "November";
    $scope.month[11] = "December";
  }();

  $(function () {
      $('#overallLine').highcharts({
          title: {
              text: 'Average Ratings for the Past Six Months',
              x: -20 //center
          },
          subtitle: {
              text: 'Source: Review Trackers',
              x: -20
          },
          xAxis: {
              categories: [ $scope.month[$scope.sixAgo.getMonth()], 
                            $scope.month[$scope.fiveAgo.getMonth()], 
                            $scope.month[$scope.fourAgo.getMonth()], 
                            $scope.month[$scope.threeAgo.getMonth()], 
                            $scope.month[$scope.twoAgo.getMonth()], 
                            $scope.month[$scope.oneAgo.getMonth()]
                          ]
          },
          yAxis: {
              title: {
                  text: 'Average Ratings'
              },
              plotLines: [{
                  value: 0,
                  width: 3,
                  color: '#1A49B0'
              }]
          },
          plotOptions: {
              series: {
                  color: '#0000FF'
              }
          },
          tooltip: {
              valueSuffix: ''
          },
          legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle',
              borderWidth: 0
          },
          series: [{
              name: 'Overall Averages',
              data: [$scope.averageRatings($scope.sixAgoObjects), 
                     $scope.averageRatings($scope.fiveAgoObjects), 
                     $scope.averageRatings($scope.fourAgoObjects), 
                     $scope.averageRatings($scope.threeAgoObjects), 
                     $scope.averageRatings($scope.twoAgoObjects), 
                     $scope.averageRatings($scope.oneAgoObjects) 
                    ]
          }]
      });
  });
  
  $(function () {
      $('#totalReviews').highcharts({
          title: {
              text: 'Amount of Reviews in the Past Six Months',
              x: -20 //center
          },
          subtitle: {
              text: 'Source: Review Trackers',
              x: -20
          },
          xAxis: {
              categories: [ $scope.month[$scope.sixAgo.getMonth()], 
                            $scope.month[$scope.fiveAgo.getMonth()], 
                            $scope.month[$scope.fourAgo.getMonth()], 
                            $scope.month[$scope.threeAgo.getMonth()], 
                            $scope.month[$scope.twoAgo.getMonth()], 
                            $scope.month[$scope.oneAgo.getMonth()]
                          ]
          },
          yAxis: {
              title: {
                  text: 'Reviews'
              },
              plotLines: [{
                  value: 0,
                  width: 3,
                  color: '#1A49B0'
              }]
          },
          plotOptions: {
              series: {
                  color: '#FF0000'
              }
          },
          tooltip: {
              valueSuffix: ''
          },
          legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle',
              borderWidth: 0
          },
          series: [{
              name: 'Reviews',
              data: [$scope.sixAgoObjects.length, 
                     $scope.fiveAgoObjects.length, 
                     $scope.fourAgoObjects.length, 
                     $scope.threeAgoObjects.length, 
                     $scope.twoAgoObjects.length, 
                     $scope.oneAgoObjects.length 
                    ]
          }]
      });
  });

  $scope.displayReview = function (reviewObj) {

    var date = new Date(reviewObj.publishDate);

    $('#displayBox').html('Author: ' + reviewObj.author + '<br>' +
                          'Date Published: ' + date.toDateString() + '<br>' +
                          'Rating: ' + reviewObj.rating + '<br>' +
                          'Review: ' + reviewObj.review + '<br>' +
                          'Review URL: ' + reviewObj.reviewUrl + '<br>' +
                          'Site Name: ' + reviewObj.siteName);
  }

})


// setup for ui-router
app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/bysite");
  //
  // Now set up the states
  $stateProvider
    .state('bysite', {
      url: "/bysite",
      templateUrl: "partials/bysite.html"
    })
    .state('bysite.list', {
      url: "/list",
      templateUrl: "partials/bysite.list.html",
      controller: function($scope) {
        $scope.items = ["A", "List", "Of", "Items"];
      }
    })
    .state('byrating', {
      url: "/byrating",
      templateUrl: "partials/byrating.html"
    })
    .state('byrating.list', {
      url: "/list",
      templateUrl: "partials/byrating.list.html",
      controller: function($scope) {
        $scope.things = ["A", "Set", "Of", "Things"];
      }
    });
});

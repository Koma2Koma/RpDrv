

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
    var today = new Date();
    var sixAgo = addMonths(-6);
    var fiveAgo = addMonths(-5);
    var fourAgo = addMonths(-4);
    var threeAgo = addMonths(-3);
    var twoAgo = addMonths(-2);
    var oneAgo = addMonths(-1);

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
      if ( revDate >= sixAgo && revDate < fiveAgo) {
        $scope.sixAgoObjects.push(revObj);
      } else if (revDate >= fiveAgo && revDate < fourAgo){
        $scope.fiveAgoObjects.push(revObj);
      } else if (revDate >= fourAgo && revDate < threeAgo){
        $scope.fourAgoObjects.push(revObj);
      } else if (revDate >= threeAgo && revDate < twoAgo){
        $scope.threeAgoObjects.push(revObj);
      } else if (revDate >= twoAgo && revDate < oneAgo){
        $scope.twoAgoObjects.push(revObj);
      } else if (revDate >= oneAgo && revDate < today){
        $scope.oneAgoObjects.push(revObj);
      }
    }
      
      // console.log($scope.sixAgoObjects);
      // console.log($scope.fiveAgoObjects);
      // console.log($scope.fourAgoObjects);
      // console.log($scope.threeAgoObjects);
      // console.log($scope.twoAgoObjects);
      // console.log($scope.oneAgoObjects);
  }();

  console.log($scope.averageRatings($scope.sixAgoObjects));

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

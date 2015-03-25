

var app = angular.module('reviewData', []);

app.controller('ReviewCtrl', function($scope, $http) {

  // initial http request gets page 1 data and totalPages to loop through all pages.
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


})


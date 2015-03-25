

var app = angular.module('reviewData', []);




app.controller('ReviewCtrl', function($scope, $http) {

  // $http({method: 'GET', url: 'https://secure.reviewtrackers.com/api/locations/18598/reviews?api_token=274b859d23b5e2778b46&sort=publishDate&order=desc&per_page=50&page=1'}).success(function(data) {
  //   $scope.data = data; // response data 
  // });

  // var more_pages = true;
  // do 

  // while (more_pages == true);

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://secure.reviewtrackers.com/api/locations/18598/reviews?api_token=274b859d23b5e2778b46&sort=publishDate&order=desc&per_page=50&page=1", false);
  xhr.send();

  console.log(xhr.status);
  console.log(xhr.statusText);

  $scope.data = angular.fromJson(xhr.response);

  var reviews = $scope.data.reviews;
  console.log(reviews);

  for (var i = 2; i <= $scope.data.totalPages; i++) {
    var page = new XMLHttpRequest();
    page.open("GET", "https://secure.reviewtrackers.com/api/locations/18598/reviews?api_token=274b859d23b5e2778b46&sort=publishDate&order=desc&per_page=50&page=" + i.toString(), false);
    page.send();


    var jsonPage = angular.fromJson(page.response);

    reviews.push(jsonPage.reviews);

  }


  console.log(reviews);
})

// app.controller('ReviewCtrl', function($scope, $http) {
//     $http.get("https://secure.reviewtrackers.com/api/locations/18598/reviews?api_token=274b859d23b5e2778b46&sort=publishDate&order=desc&per_page=50&page=1")
//     .success(function(response) {$scope.data = response}).
//     error( function(response) {$scope.data = response});

//     console.log($scope.data);

// });


// // Simple GET request example :
// $http.get('https://secure.reviewtrackers.com/api/locations/18598/reviews?api_token=274b859d23b5e2778b46&sort=publishDate&order=desc&per_page=50&page=1').
//   success(function(data, status, headers, config) {
//     // this callback will be called asynchronously
//     // when the response is available
//   }).
//   error(function(data, status, headers, config) {
//     // called asynchronously if an error occurs
//     // or server returns response with an error status.
//   });
angular.module('issueTracker.home', ['issueTracker.dashboard.getDashboard', 'issueTracker.users.getUsers']).config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'app/home/home.html',
		controller: 'HomeController'
	});
}]).filter('range', function() {
	return function(input, total) {
		total = parseInt(total);
		for (var i = 1; i <= total; i++) {
			input.push(i);
		}
		return input;
	};
}).controller('HomeController', ['$scope', '$rootScope', '$route', '$location', 'getDashboard', 'getUsers', function($scope, $rootScope, $route, $location, getDashboard, getUsers) {
	$scope.login = function(user) {
		getUsers.loginUser(user).then(function(loggingUser) {
			getUsers.identity(loggingUser.access_token).then(function(getIdentity) {
				getUsers.me().then(function(getMe) {
					$rootScope.isAdmin = getMe.isAdmin;
					$rootScope.loginedInUser = getMe.Username;
					document.currentUser = true;
					document.isAdmin = getMe.isAdmin;
					$route.reload();
				});
			});
		});
	};

	$scope.register = function(user) {
		getUsers.registerUser(user).then(function(registeredUser) {
			var loggingUser = {
				username: user.username,
				password: user.password
			};
			getUsers.loginUser(loggingUser).then(function(loggingUser) {
				getUsers.identity(loggingUser.access_token).then(function(getIdentity) {
					getUsers.me().then(function(getMe) {
						console.log(getMe);
						$rootScope.isAdmin = getMe.isAdmin;
						$rootScope.loginedInUser = getMe.Username;
						document.currentUser = true;
						document.isAdmin = getMe.isAdmin;
						$route.reload();
					});
				});
			});
		});
	};

	// the dashboard
	if (document.cookie) {
		getDashboard.myProjects(localStorage.username, 1).then(function(getMyProjects) {
			// console.log(getMyProjects.data.Projects);
			$scope.myProjects = getMyProjects.data.Projects;
		});

		getDashboard.myIssues(1).then(function(getMyIssues) {
			$scope.myIssues = getMyIssues.data.Issues;
		});

		$scope.changePage = function(pNum) {
			getDashboard.myIssues(pNum).then(function(getMyIssues) {
				$scope.myIssues = getMyIssues.data.Issues;
			});
		};

		$scope.changeProjectPage = function(pNum) {
			getDashboard.myProjects(localStorage.username, pNum).then(function(getMyProjects) {
				$scope.myProjects = getMyProjects.data.Projects;
			});
		};

		getDashboard.myTotalIssues().then(function(getMyTotalIssues) {
			var totalNumOfIssues = getMyTotalIssues.data.Issues.length;
			var pages = Math.ceil(totalNumOfIssues / 10);
			$scope.pages = pages;
		});

		getDashboard.allMyProjects(localStorage.username).then(function(getAllMyProjects) {
			console.log(getAllMyProjects.data.Projects.length);
			var totalNumsOfProjects = getAllMyProjects.data.Projects.length;
			var pages = Math.ceil(totalNumsOfProjects / 13);
			$scope.projectPages = pages;
		});
	}
}]);
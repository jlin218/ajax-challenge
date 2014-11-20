"use strict";

angular.module('ToDoApp', ['ui.bootstrap'])

    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'qoBSlepRm9uiogMmKhuT5j8K8qxyiqZ1xQorVa4p';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'z3Y0pLqhk1h42aNnQx7DzTHp9Z70fmWns1kNC5RR';
    })
    .controller('TasksController', function($scope, $http) {
      var tasksUrl = 'https://api.parse.com/1/classes/tasks';
        console.log('here iam');
        $scope.scoreOrder = '-score';
        $scope.refreshTasks = function() {
            $scope.loading = true;
            $http.get(tasksUrl + '?where={"done": false}')  
               .success(function(responseData) {
                    $scope.tasks = responseData.results;
                    console.log(responseData.results.length);
                    if (responseData.results.length == 0){
                        document.getElementById("noComment").style.display = "inherit";
                    }
                })
                .error(function(err) {
                    alert("Please refresh again.");
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }; 

        $scope.refreshTasks();
        $scope.newTask = {done: false};
        $scope.addTask = function(task) {
            $scope.inserting = true;
            $scope.newTask.score = 0;
           
            if (task.rating != 0 && task.name != null && task.title!= null && task.comment!= null){
                $http.post(tasksUrl, task)
                    .success(function(responseData) {
                        document.getElementById("noComment").style.display = "none";
                        task.objectId = responseData.objectId;
                        $scope.tasks.push(task);
                        $scope.newTask = {done: false};
                    })
                    .error(function(err) {
                        alert("Please submit it again.");
                    })
                    .finally(function() {
                        $scope.inserting = false;
                    });
            } else {
                alert("Please fill out all the fields.");
                $scope.inserting = false;
            }

        };

        //function to update an existing task
        $scope.updateTask = function(task) {
            $scope.updating = true;
            $http.put(tasksUrl + '/' + task.objectId, task)
                .error(function(err) {
                    alert("Please refresh again.");
                })
                .finally(function() {
                    $scope.updating = false;
                });
        };
        $scope.deleteTask = function(task) {
            $scope.updating = true;
            $http.delete(tasksUrl + '/' + task.objectId, task)
                .error(function(err) {
                    alert("Cannot be deleted, try again");

                })
                .finally(function() {
                    $scope.updating = false;
                });
        };
        $scope.scoreChange =function(task, value){
            $scope.updating = true;
            task.score += value;
            if (task.score < 0)
                task.score = 0;
            $http.put(tasksUrl + '/' + task.objectId, task)
                .error(function(err) {
                    alert("Something's wrong, try again.");

                })
                .finally(function() {
                    $scope.updating = false;
                });
        };

    });
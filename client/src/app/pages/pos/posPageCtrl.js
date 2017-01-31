(function () {
    'use strict';

    angular.module('BlurAdmin.pages.pos')
        .controller('posPageCtrl', posPageCtrl)

    function posPageCtrl($scope, $filter, sessionService, Client, baSidebarService) {
        var vm = this
        manageObjects()



        $scope.dateString = '2015-05-08';
        $scope.dateObject = new Date();
        //Change-stream
        var urlToChangeStream = 'https://localhost:4000/api/Clients/change-stream?_format=event-stream&access_token=' + sessionService.token;
        var src = new EventSource(urlToChangeStream);
        src.addEventListener('data', function (msg) {
            console.log('EVENT')
            var data = JSON.parse(msg.data);

            var dispContain = findId($scope.displayedCollection, data.target)
            var tempContain = findId($scope.clientsNotInProgress, data.target)


            if (data.data) {
                console.log(data.data.inProgress)
                console.log(dispContain)
                console.log(tempContain)
                if (data.data.inProgress && typeof dispContain != undefined && typeof tempContain == undefined) {
                    manageObjects()
                }

                if (!data.data.inProgress && typeof tempContain != undefined && typeof dispContain == undefined) {
                    manageObjects()
                }
            }
        });
        //EOF Change-stream
        $scope.donesearch = false

        $scope.msg = function (itemId) {
            $scope.inpUserID = itemId
        }


        $scope.addClientToList = function () {
            var d1 = new Date();
            var d2 = new Date(d1);
            d2.setHours(d1.getHours() + 1);

            Client.prototype$updateAttributes({ id: $scope.addCli }, { inProgress: 1, inPSince: d2 }
                , function (success) {


                }, function (error) {
                    console.log(error);
                })
        }

        $scope.closeClient = function (clientId) {
            Client.prototype$updateAttributes({ id: $scope.inpUserID }, { inProgress: 0 }
                , function (success) {


                }, function (error) {
                    console.log(error);
                })
        }

        function manageObjects() {
            $scope.clientsInProgress = Client.find({ filter: { where: { inProgress: 1 }, order: 'inPSince' } })
            $scope.clientsNotInProgress = Client.find({ filter: { where: { inProgress: 0 } } })
            $scope.displayedCollection = [].concat($scope.clientsInProgress);
        }

        function findId(data, idToLookFor) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == idToLookFor) {
                    return (i);
                }
            }
        }

    }




})();

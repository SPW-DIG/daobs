/*
 * Copyright 2014-2016 European Environment Agency
 *
 * Licensed under the EUPL, Version 1.1 or – as soon
 * they will be approved by the European Commission -
 * subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance
 * with the Licence.
 * You may obtain a copy of the Licence at:
 *
 * https://joinup.ec.europa.eu/community/eupl/og_page/eupl
 *
 * Unless required by applicable law or agreed to in
 * writing, software distributed under the Licence is
 * distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied.
 * See the Licence for the specific language governing
 * permissions and limitations under the Licence.
 */
(function () {
  "use strict";
  var app = angular.module('daobs');

  /**
   * Controller for home page displaying dashboards. Used also on reporting.
   * available.
   */
  app.controller('HomeCtrl', ['$scope', '$http', 'cfg',
    function ($scope, $http, cfg) {
      $scope.dashboards = null;
      $scope.dashboardsLoaded = null;
      $scope.listOfDashboardToLoad = null;
      $scope.hasINSPIREdashboard = false;
      $scope.hasOnlyINSPIREdashboard = true;
      $scope.solrConnectionError = null;

      // Set to last 5 years the default dashboard parameters.
      $scope.dashboardParams = '?_g=(time:(from:now-5y,mode:quick,to:now))';

      var init = function () {
        $scope.dashboardBaseURL = cfg.SERVICES.dashboardBaseURL;
        $http.get(cfg.SERVICES.esdashboardCore +
          '/dashboard/_search').then(function (response) {
          $scope.dashboards = response.data.hits.hits;
          angular.forEach($scope.dashboards, function (d) {
            if ($scope.startsWith(d._source.title, 'inspire')) {
              $scope.hasINSPIREdashboard = true;
            } else {
              $scope.hasOnlyINSPIREdashboard = false;
            }
          });
        }, function (response) {
          if (response.status = 500) {
            $scope.solrConnectionError = response;
          }
        });

        // $http.get(cfg.SERVICES.samples + '/dashboardType.json').success(function (data) {
        //   $scope.listOfDashboardToLoad = data;
        // });
      };

      // TODO: Move to dashboard service
      $scope.loadDashboard = function (type) {
        $scope.dashboardsLoaded = null;
        // return $http.put(cfg.SERVICES.samples +
        //   '/dashboard/' + type + '*.json').success(function (data) {
        //   $scope.dashboardsLoaded = data;
        //   init();
        // });
      };

      $scope.removeDashboard = function (id) {
        var documentFilter = id ? '/' + id : '';
        $http.delete(cfg.SERVICES.dashboards + documentFilter).then(init);
      };

      $scope.startsWith = function (actual, expected) {
        if (angular.isObject(actual)) {
          actual = actual.title;
        }
        var lowerStr = (actual + "").toLowerCase();
        return lowerStr.indexOf(expected.toLowerCase()) === 0;
      };
      $scope.notStartsWith = function (actual, expected) {
        return !$scope.startsWith(actual, expected);
      };
      init();
    }]);
}());

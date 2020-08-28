angular.module('kityminderEditor')
	.directive('saveasKm', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/saveasKm/saveasKm.html',
			scope: {
				minder: '='
			},
      replace: true,
			link: function(scope) {
        scope.saveasKm = function() {
          fetch(window.appHost+"editor/fileSave", {
            "credentials": "include",
            "headers": {
              "accept": "application/json, text/javascript, */*; q=0.01",
              "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6",
              "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
              "x-requested-with": "XMLHttpRequest"
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": "path="+window.filePath+"&charset=utf-8&filestr="+encodeURIComponent(JSON.stringify(window.minder.exportJson())),
            "method": "POST",
            "mode": "cors"
          })
          .then(function(response) {
            if (!response.ok) {
              throw new Error("HTTP error, status = " + response.status);
            }
            return response.json();
          })
          .then(function(json) {
            if (!json.code === "true") {
              throw new Error("Operation error, error = " + json.data);
            } else {
              alert(json.data);
            }
          })
          .catch(function(error) {
            var p = document.createElement('p');
            p.appendChild(
              document.createTextNode('Error: ' + error.message)
            );
            document.body.insertBefore(p, myList);
          });
        }
			}
		}
	});

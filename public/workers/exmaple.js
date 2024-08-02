"use strict";
self.onmessage = function (e) {
    var filteredData = e.data.list.filter(function (item) { return item.type === "HELLO"; });
    self.postMessage(filteredData);
};
